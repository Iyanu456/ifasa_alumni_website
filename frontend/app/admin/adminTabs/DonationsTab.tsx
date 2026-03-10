"use client";

import { useState, useEffect } from "react";
import { Search, MoreVertical } from "lucide-react";

type Donation = {
id: number;
donor: string;
email: string;
amount: number;
date: string;
status: "completed" | "pending";
};

const dummyDonations: Donation[] = [
{
id: 1,
donor: "Tunde Adebayo",
email: "tunde@email.com",
amount: 50000,
date: "May 10, 2026",
status: "completed",
},
{
id: 2,
donor: "Funke Oladipo",
email: "funke@email.com",
amount: 25000,
date: "May 22, 2026",
status: "completed",
},
{
id: 3,
donor: "Adeola Ogun",
email: "adeola@email.com",
amount: 10000,
date: "Jun 03, 2026",
status: "pending",
},
];

export default function DonationsTab() {
const [query, setQuery] = useState("");
const [activeMenu, setActiveMenu] = useState<number | null>(null);

const filtered = dummyDonations.filter((donation) =>
donation.donor.toLowerCase().includes(query.toLowerCase())
);

const totalDonations = dummyDonations.reduce(
(sum, d) => sum + d.amount,
0
);

useEffect(() => {
const closeMenu = () => setActiveMenu(null);
window.addEventListener("click", closeMenu);
return () => window.removeEventListener("click", closeMenu);
}, []);

return ( <section className="space-y-6">

  {/* Header */}
  <div>
    <h1 className="text-lg md:text-2xl font-semibold">Donations</h1>
    <p className="text-sm text-gray-500">
      Track alumni donations and contributions.
    </p>
  </div>

  {/* Stats */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

    <div className="bg-white border border-gray-100 rounded-xl p-5">
      <p className="text-sm text-gray-500">
        Total Donations
      </p>

      <p className="text-2xl font-semibold mt-1">
        ₦{totalDonations.toLocaleString()}
      </p>
    </div>

    <div className="bg-white border border-gray-100 rounded-xl p-5">
      <p className="text-sm text-gray-500">
        Total Donors
      </p>

      <p className="text-2xl font-semibold mt-1">
        {dummyDonations.length}
      </p>
    </div>

    <div className="bg-white border border-gray-100 rounded-xl p-5">
      <p className="text-sm text-gray-500">
        Pending Donations
      </p>

      <p className="text-2xl font-semibold mt-1">
        {
          dummyDonations.filter(
            (d) => d.status === "pending"
          ).length
        }
      </p>
    </div>

  </div>

  {/* Search */}
  <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-3">

    <Search size={18} className="text-gray-400" />

    <input
      type="text"
      placeholder="Search donors..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className="w-full outline-none text-sm"
    />

  </div>

  {/* Table */}
  <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">

    <div className="overflow-x-auto">

      <table className="w-full text-sm">

        <thead className="bg-gray-50 text-gray-500">

          <tr>
            <th className="text-left p-4 font-medium">Donor</th>
            <th className="hidden md:table-cell text-left p-4 font-medium">
              Email
            </th>
            <th className="text-left p-4 font-medium">
              Amount
            </th>
            <th className="text-left p-4 font-medium">
              Date
            </th>
            <th className="text-left p-4 font-medium max-md:hidden">
              Status
            </th>
            <th className="text-right p-4 font-medium max-md:hidden"></th>
          </tr>

        </thead>

        <tbody>

          {filtered.map((donation) => (

            <tr
              key={donation.id}
              className="border-t border-gray-100 hover:bg-gray-50"
            >

              {/* Donor */}
              <td className="p-4">

                <div>
                  <p className="font-medium">
                    {donation.donor}
                  </p>

                  <p className="text-xs text-gray-500 md:hidden">
                    {donation.email}
                  </p>
                </div>

              </td>

              {/* Email */}
              <td className="hidden md:table-cell p-4">
                {donation.email}
              </td>

              {/* Amount */}
              <td className="p-4 font-medium">
                ₦{donation.amount.toLocaleString()}
              </td>

              {/* Date */}
              <td className="p-4">
                {donation.date}
              </td>

              {/* Status */}
              <td className="p-4 max-md:hidden">

                {donation.status === "completed" ? (
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                    Completed
                  </span>
                ) : (
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                    Pending
                  </span>
                )}

              </td>

              {/* Actions */}
              <td className="p-4 text-right relative max-md:hidden">

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenu(
                      activeMenu === donation.id
                        ? null
                        : donation.id
                    );
                  }}
                  className="p-2 rounded hover:bg-gray-100"
                >
                  <MoreVertical size={18} />
                </button>

                {activeMenu === donation.id && (

                  <div className="absolute right-4 mt-2 w-36 bg-white border border-gray-100 rounded-lg shadow-lg text-sm z-20">

                    <button className="block w-full text-left px-4 py-2 hover:bg-gray-50">
                      View Details
                    </button>

                    <button className="block w-full text-left px-4 py-2 hover:bg-gray-50">
                      Mark Completed
                    </button>

                  </div>

                )}

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  </div>

</section>

);
}
