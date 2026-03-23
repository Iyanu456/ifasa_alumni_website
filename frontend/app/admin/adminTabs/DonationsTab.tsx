"use client";

import { useState } from "react";
import { MoreVertical, Search } from "lucide-react";
import { getApiErrorMessage, useAppMutations } from "../../apiServices/mutations";
import {
  useAdminDonationsQuery,
  useDonationSummaryQuery,
} from "../../apiServices/queries";
import { formatCurrency, formatDate } from "../../lib/formatters";
import type { Donation } from "../../types/types";

const statuses: Donation["status"][] = ["pending", "completed", "failed"];

export default function DonationsTab() {
  const [search, setSearch] = useState("");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const summaryQuery = useDonationSummaryQuery();
  const donationsQuery = useAdminDonationsQuery({ search, limit: 50 });
  const { updateDonationStatusMutation } = useAppMutations();
  const donations = donationsQuery.data?.data ?? [];
  const summary = summaryQuery.data?.data;

  const handleStatusUpdate = async (id: string, status: Donation["status"]) => {
    setActiveMenu(null);
    await updateDonationStatusMutation.mutateAsync({ id, status });
  };

  const mutationError = updateDonationStatusMutation.error
    ? getApiErrorMessage(
        updateDonationStatusMutation.error,
        "We could not update the donation status.",
      )
    : "";

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold md:text-2xl">Donations</h1>
        <p className="text-sm text-gray-500">
          Track donation intents and update payment status.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <p className="text-sm text-gray-500">Total Donations</p>
          <p className="mt-1 text-2xl font-semibold">
            {summaryQuery.isLoading ? "..." : formatCurrency(summary?.totalAmount || 0)}
          </p>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <p className="text-sm text-gray-500">Total Donors</p>
          <p className="mt-1 text-2xl font-semibold">
            {summaryQuery.isLoading ? "..." : summary?.donorCount || 0}
          </p>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <p className="text-sm text-gray-500">Pending Donations</p>
          <p className="mt-1 text-2xl font-semibold">
            {summaryQuery.isLoading ? "..." : summary?.pendingDonations || 0}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search donors, email, or reference..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full text-sm outline-none"
        />
      </div>

      {mutationError ? <p className="text-sm text-red-500">{mutationError}</p> : null}

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
        {donationsQuery.isLoading ? (
          <div className="p-8 text-center text-sm text-gray-500">
            Loading donations...
          </div>
        ) : donationsQuery.error ? (
          <div className="p-8 text-center text-sm text-red-500">
            We could not load donations.
          </div>
        ) : donations.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            No donations found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="p-4 text-left font-medium">Donor</th>
                  <th className="hidden p-4 text-left font-medium md:table-cell">Email</th>
                  <th className="p-4 text-left font-medium">Amount</th>
                  <th className="p-4 text-left font-medium">Date</th>
                  <th className="p-4 text-left font-medium">Status</th>
                  <th className="p-4 text-right font-medium" />
                </tr>
              </thead>
              <tbody>
                {donations.map((donation) => (
                  <tr
                    key={donation.id}
                    className="border-t border-gray-100 transition hover:bg-gray-50"
                  >
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{donation.donorName}</p>
                        <p className="text-xs text-gray-500 md:hidden">
                          {donation.email || donation.reference}
                        </p>
                      </div>
                    </td>
                    <td className="hidden p-4 md:table-cell">
                      {donation.email || "—"}
                    </td>
                    <td className="p-4 font-medium">{formatCurrency(donation.amount)}</td>
                    <td className="p-4">{formatDate(donation.createdAt || donation.paidAt)}</td>
                    <td className="p-4">
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          donation.status === "completed"
                            ? "bg-green-100 text-green-600"
                            : donation.status === "failed"
                              ? "bg-red-100 text-red-500"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {donation.status}
                      </span>
                    </td>
                    <td className="relative p-4 text-right">
                      <button
                        onClick={() =>
                          setActiveMenu((current) =>
                            current === donation.id ? null : donation.id,
                          )
                        }
                        className="rounded p-2 hover:bg-gray-100"
                      >
                        <MoreVertical size={18} />
                      </button>

                      {activeMenu === donation.id ? (
                        <div className="absolute right-4 z-20 mt-2 w-40 rounded-lg border border-gray-100 bg-white text-sm shadow-lg">
                          {statuses.map((status) => (
                            <button
                              key={status}
                              onClick={() => void handleStatusUpdate(donation.id, status)}
                              disabled={updateDonationStatusMutation.isPending}
                              className="block w-full px-4 py-2 text-left capitalize hover:bg-gray-50 disabled:opacity-60"
                            >
                              Mark {status}
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
