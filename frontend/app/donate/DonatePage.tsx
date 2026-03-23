"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import {
  Building2,
  GraduationCap,
  HeartHandshake,
  Wrench,
} from "lucide-react";
import { getApiErrorMessage, useAppMutations } from "../apiServices/mutations";
import { useDonationSummaryQuery, usePublicSettingsQuery } from "../apiServices/queries";
import { formatCurrency } from "../lib/formatters";

const impactCards = [
  {
    title: "Student Support",
    description: "Scholarships, studio materials, and learning resources.",
    icon: GraduationCap,
  },
  {
    title: "Studio Improvements",
    description: "Equipment upgrades and workspace enhancements.",
    icon: Building2,
  },
  {
    title: "Events & Workshops",
    description: "Funding alumni events, talks, and professional workshops.",
    icon: Wrench,
  },
  {
    title: "Mentorship Programs",
    description: "Supporting mentorship initiatives for students and young graduates.",
    icon: HeartHandshake,
  },
];

export default function DonatePage() {
  const [donationForm, setDonationForm] = useState({
    amount: "",
    donorName: "",
    email: "",
    note: "",
  });
  const [sponsorForm, setSponsorForm] = useState({
    name: "",
    email: "",
    organization: "",
    message: "",
  });
  const [donationNotice, setDonationNotice] = useState("");
  const [sponsorshipNotice, setSponsorshipNotice] = useState("");
  const { createDonationMutation, createSponsorshipMutation } = useAppMutations();
  const summaryQuery = useDonationSummaryQuery();
  const settingsQuery = usePublicSettingsQuery();

  const summary = summaryQuery.data?.data;
  const settings = settingsQuery.data?.data.settings;

  const donationDisabled = settings?.enableDonations === false;

  const formattedSummary = useMemo(
    () => [
      {
        label: "Total Donations",
        value: formatCurrency(summary?.totalAmount || 0),
      },
      {
        label: "Total Donors",
        value: String(summary?.donorCount || 0),
      },
      {
        label: "Pending Donations",
        value: String(summary?.pendingDonations || 0),
      },
    ],
    [summary],
  );

  const handleDonationSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDonationNotice("");

    try {
      const response = await createDonationMutation.mutateAsync({
        amount: Number(donationForm.amount),
        donorName: donationForm.donorName || undefined,
        email: donationForm.email || undefined,
        note: donationForm.note || undefined,
      });

      setDonationForm({
        amount: "",
        donorName: "",
        email: "",
        note: "",
      });

      const checkoutUrl = response.data.checkoutUrl || settings?.donationLink;

      if (checkoutUrl && typeof window !== "undefined") {
        window.location.assign(checkoutUrl);
        return;
      }

      setDonationNotice("Your donation intent has been recorded successfully.");
    } catch {
      setDonationNotice("");
    }
  };

  const handleSponsorSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSponsorshipNotice("");

    try {
      await createSponsorshipMutation.mutateAsync(sponsorForm);
      setSponsorForm({
        name: "",
        email: "",
        organization: "",
        message: "",
      });
      setSponsorshipNotice("Your sponsorship request has been submitted.");
    } catch {
      setSponsorshipNotice("");
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f8f8] pt-[6em] pb-[5em]">
      <section className="mx-auto mb-14 w-[92%] text-center sm:w-[90%] md:w-[80%]">
        <h1 className="mb-3 text-2xl font-semibold sm:text-3xl md:text-4xl">
          Donate &amp; Sponsor
        </h1>
        <p className="mx-auto max-w-2xl text-gray-600">
          Your support strengthens the alumni community, empowers students, and
          improves learning facilities within the Department of Architecture,
          OAU.
        </p>
      </section>

      <section className="mx-auto mb-10 grid w-[92%] grid-cols-1 gap-4 sm:w-[90%] md:w-[80%] md:grid-cols-3">
        {formattedSummary.map((item) => (
          <div key={item.label} className="rounded-2xl border border-gray-100 bg-white p-5">
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className="mt-1 text-2xl font-semibold">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto mb-16 grid w-[92%] gap-6 sm:w-[90%] md:w-[80%] sm:grid-cols-2 md:grid-cols-4">
        {impactCards.map(({ title, description, icon: Icon }) => (
          <div
            key={title}
            className="rounded-2xl border border-gray-100 bg-white p-6 text-center"
          >
            <Icon className="mx-auto mb-3 text-primary" />
            <h3 className="mb-1 font-medium">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        ))}
      </section>

      {settings?.donationAccountNumber || settings?.donationBankName ? (
        <section className="mx-auto mb-10 w-[92%] rounded-2xl border border-gray-100 bg-white p-6 sm:w-[90%] md:w-[80%]">
          <h2 className="text-lg font-semibold">Direct Bank Donation</h2>
          <p className="mt-2 text-sm text-gray-600">
            Prefer a direct transfer? Use the account details below.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">Account Number</p>
              <p className="mt-1 text-lg font-semibold">
                {settings?.donationAccountNumber || "Not configured"}
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">Bank Name</p>
              <p className="mt-1 text-lg font-semibold">
                {settings?.donationBankName || "Not configured"}
              </p>
            </div>
          </div>
        </section>
      ) : null}

      <section className="mx-auto mb-16 grid h-[max-content] w-[92%] items-start gap-8 sm:w-[90%] md:w-[80%] md:grid-cols-2">
        <div className="grid h-full rounded-2xl border border-gray-100 bg-white p-6">
          <h2 className="mb-3 text-lg font-semibold">Make a Donation</h2>
          <p className="mb-4 text-sm text-gray-600">
            Your support funds mentorship programs, student support initiatives,
            studio improvements, and alumni-led projects.
          </p>

          <form onSubmit={handleDonationSubmit} className="flex flex-col gap-3">
            <input
              type="number"
              min={1}
              required
              disabled={donationDisabled || createDonationMutation.isPending}
              placeholder="Enter donation amount (NGN)"
              value={donationForm.amount}
              onChange={(event) =>
                setDonationForm((prev) => ({ ...prev, amount: event.target.value }))
              }
              className="w-full rounded-lg border border-gray-300 bg-[#FAFAFA] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />

            <input
              type="text"
              placeholder="Full name (optional)"
              value={donationForm.donorName}
              onChange={(event) =>
                setDonationForm((prev) => ({ ...prev, donorName: event.target.value }))
              }
              className="w-full rounded-lg border border-gray-300 bg-[#FAFAFA] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />

            <input
              type="email"
              placeholder="Email address (optional, for receipt)"
              value={donationForm.email}
              onChange={(event) =>
                setDonationForm((prev) => ({ ...prev, email: event.target.value }))
              }
              className="w-full rounded-lg border border-gray-300 bg-[#FAFAFA] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />

            <textarea
              rows={4}
              placeholder="Leave a note (optional)"
              value={donationForm.note}
              onChange={(event) =>
                setDonationForm((prev) => ({ ...prev, note: event.target.value }))
              }
              className="w-full rounded-lg border border-gray-300 bg-[#FAFAFA] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />

            <button
              type="submit"
              disabled={donationDisabled || createDonationMutation.isPending}
              className="mt-auto w-full rounded-lg bg-primary py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {donationDisabled
                ? "Donations are currently disabled"
                : createDonationMutation.isPending
                  ? "Processing..."
                  : "Proceed to Donate"}
            </button>
          </form>

          {donationNotice ? (
            <p className="mt-3 text-sm text-green-600">{donationNotice}</p>
          ) : null}

          {createDonationMutation.error ? (
            <p className="mt-3 text-sm text-red-500">
              {getApiErrorMessage(
                createDonationMutation.error,
                "We could not create this donation right now.",
              )}
            </p>
          ) : null}

          <p className="mt-3 text-xs text-gray-500">
            {settings?.donationLink
              ? "You will be redirected to the configured payment link after submission."
              : "A payment link can be configured from the admin settings."}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <h2 className="mb-3 text-lg font-semibold">Become a Sponsor / Partner</h2>
          <p className="mb-4 text-sm text-gray-600">
            Organizations and individuals can support specific programs, events,
            or facilities. Tell us how you would like to partner with us.
          </p>

          <form onSubmit={handleSponsorSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Your name"
              required
              value={sponsorForm.name}
              onChange={(event) =>
                setSponsorForm((prev) => ({ ...prev, name: event.target.value }))
              }
              className="w-full rounded-lg border border-gray-300 bg-[#FAFAFA] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />

            <input
              type="email"
              placeholder="Email address"
              required
              value={sponsorForm.email}
              onChange={(event) =>
                setSponsorForm((prev) => ({ ...prev, email: event.target.value }))
              }
              className="w-full rounded-lg border border-gray-300 bg-[#FAFAFA] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />

            <input
              type="text"
              placeholder="Organization (optional)"
              value={sponsorForm.organization}
              onChange={(event) =>
                setSponsorForm((prev) => ({
                  ...prev,
                  organization: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-gray-300 bg-[#FAFAFA] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />

            <textarea
              rows={4}
              placeholder="How would you like to sponsor or partner with us?"
              required
              value={sponsorForm.message}
              onChange={(event) =>
                setSponsorForm((prev) => ({ ...prev, message: event.target.value }))
              }
              className="w-full rounded-lg border border-gray-300 bg-[#FAFAFA] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />

            <button
              type="submit"
              disabled={createSponsorshipMutation.isPending}
              className="w-full rounded-lg bg-primary py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {createSponsorshipMutation.isPending
                ? "Submitting..."
                : "Submit Sponsorship Request"}
            </button>
          </form>

          {sponsorshipNotice ? (
            <p className="mt-3 text-sm text-green-600">{sponsorshipNotice}</p>
          ) : null}

          {createSponsorshipMutation.error ? (
            <p className="mt-3 text-sm text-red-500">
              {getApiErrorMessage(
                createSponsorshipMutation.error,
                "We could not submit your sponsorship request.",
              )}
            </p>
          ) : null}
        </div>
      </section>

      <section className="w-full border-t border-gray-100 bg-white py-12 text-center">
        <p className="text-sm text-gray-600">
          All donations and sponsorships go directly towards alumni and
          departmental development initiatives.
        </p>
        <Link
          href="/contact"
          className="mt-3 inline-block font-medium text-primary hover:underline"
        >
          Have questions? Contact us →
        </Link>
      </section>
    </main>
  );
}
