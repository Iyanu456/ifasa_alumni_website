"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Search, MoreVertical } from "lucide-react";

type Alumni = {
id: number;
name: string;
email: string;
graduationYear: string;
location: string;
role: string;
status: "approved" | "pending";
avatar?: string;
};

const dummyAlumni: Alumni[] = [
{
id: 1,
name: "Tunde Adebayo",
email: "tunde@email.com",
graduationYear: "2015",
location: "Lagos, Nigeria",
role: "Senior Architect",
status: "approved",
avatar: "https://picsum.photos/seed/a1/100",
},
{
id: 2,
name: "Funke Oladipo",
email: "funke@email.com",
graduationYear: "2017",
location: "London, UK",
role: "Urban Designer",
status: "pending",
avatar: "https://picsum.photos/seed/a2/100",
},

{
id: 3,
name: "Bayo Adeleke",
email: "funke@email.com",
graduationYear: "2017",
location: "London, UK",
role: "Urban Designer",
status: "approved",
avatar: "https://picsum.photos/seed/a2/100",
},

{
id: 4,
name: "Funke Oladipo",
email: "funke@email.com",
graduationYear: "2017",
location: "London, UK",
role: "Urban Designer",
status: "pending",
avatar: "https://picsum.photos/seed/a2/100",
},
];

export default function AlumniTab() {
const [query, setQuery] = useState("");
const [activeMenu, setActiveMenu] = useState<number | null>(null);

const filtered = dummyAlumni.filter((alumni) =>
alumni.name.toLowerCase().includes(query.toLowerCase())
);

useEffect(() => {
const closeMenu = () => setActiveMenu(null);
window.addEventListener("click", closeMenu);
return () => window.removeEventListener("click", closeMenu);
}, []);

return ( <section className="space-y-6">

  {/* Header */}
  <div>
    <h1 className="text-2xl font-semibold">Alumni</h1>
    <p className="text-sm text-gray-500">
      Manage registered alumni members.
    </p>
  </div>

  {/* Search */}
  <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-3">
    <Search size={18} className="text-gray-400" />

    <input
      type="text"
      placeholder="Search alumni..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className="w-full outline-none text-sm"
    />
  </div>

  {/* Table */}
  <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">

    <div className="overflow-x-auto">

      <table className="w-full text-sm">

        {/* Head */}
        <thead className="bg-gray-50 text-gray-500">
          <tr>
            <th className="text-left p-4 font-medium">Alumni</th>

            {/* Hidden on mobile */}
            <th className="hidden md:table-cell text-left p-4 font-medium">
              Year
            </th>

            <th className="hidden lg:table-cell text-left p-4 font-medium">
              Location
            </th>

            <th className="hidden lg:table-cell text-left p-4 font-medium">
              Role
            </th>

            <th className="text-left p-4 font-medium">Status</th>

            <th className="text-right p-4 font-medium"></th>
          </tr>
        </thead>

        {/* Body */}
        <tbody>

          {filtered.map((alumni) => (

            <tr
              key={alumni.id}
              className="border-t border-gray-100 hover:bg-gray-50"
            >

              {/* Alumni */}
              <td className="p-4">

                <div className="flex items-center gap-3">

                  <Image
                    src={alumni.avatar || "https://picsum.photos/100"}
                    alt={alumni.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />

                  <div>
                    <p className="font-medium">{alumni.name}</p>

                    <p className="text-xs text-gray-500">
                      {alumni.email}
                    </p>

                    {/* Mobile info */}
                    <p className="text-xs text-gray-400 md:hidden">
                      {alumni.location}
                    </p>

                  </div>

                </div>

              </td>

              {/* Year */}
              <td className="hidden md:table-cell p-4">
                {alumni.graduationYear}
              </td>

              {/* Location */}
              <td className="hidden lg:table-cell p-4">
                {alumni.location}
              </td>

              {/* Role */}
              <td className="hidden lg:table-cell p-4">
                {alumni.role}
              </td>

              {/* Status */}
              <td className="p-4">

                {alumni.status === "approved" ? (
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                    Approved
                  </span>
                ) : (
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                    Pending
                  </span>
                )}

              </td>

              {/* Actions */}
              <td className="p-4 text-right relative">

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenu(
                      activeMenu === alumni.id ? null : alumni.id
                    );
                  }}
                  className="p-2 rounded hover:bg-gray-100"
                >
                  <MoreVertical size={18} />
                </button>

                {activeMenu === alumni.id && (

                  <div className="absolute right-4 mt-2 w-40 bg-white border border-gray-100 rounded-lg shadow-lg text-sm z-20">

                    {/* Approve */}
                    {alumni.status === "pending" && (
                      <button className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-green-600">
                        Approve
                      </button>
                    )}

                    <button className="block w-full text-left px-4 py-2 hover:bg-gray-50">
                      Edit
                    </button>

                    <button className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-red-500">
                      Delete
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
