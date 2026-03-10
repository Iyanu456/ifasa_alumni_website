"use client";


import { useState, useEffect } from "react";
import { Search, MoreVertical, Plus, X } from "lucide-react";

type Opportunity = {
id: number;
title: string;
organization: string;
location: string;
deadline: string;
status: "open" | "closed";
};

const dummyOpportunities: Opportunity[] = [
{
id: 1,
title: "Junior Architect",
organization: "Studio Contra",
location: "Lagos, Nigeria",
deadline: "Aug 30, 2026",
status: "open",
},
{
id: 2,
title: "Urban Design Internship",
organization: "Urban Lab",
location: "London, UK",
deadline: "Sep 15, 2026",
status: "open",
},
{
id: 3,
title: "Graduate Architect Role",
organization: "BuildSpace",
location: "Abuja, Nigeria",
deadline: "Jul 01, 2026",
status: "closed",
},
];

export default function OpportunitiesTab() {
const [query, setQuery] = useState("");
const [activeMenu, setActiveMenu] = useState<number | null>(null);
const [showModal, setShowModal] = useState(false);
const [tags, setTags] = useState<string[]>([]);

const opportunityTags = [
  "Job",
  "Internship",
  "Scholarship",
  "Grant",
  "Fellowship",
  "Competition",
];

const toggleTag = (tag: string) => {
  if (tags.includes(tag)) {
    setTags(tags.filter((t) => t !== tag));
  } else {
    setTags([...tags, tag]);
  }
};

const filtered = dummyOpportunities.filter((opp) =>
opp.title.toLowerCase().includes(query.toLowerCase())
);

useEffect(() => {
const closeMenu = () => setActiveMenu(null);
window.addEventListener("click", closeMenu);
return () => window.removeEventListener("click", closeMenu);
}, []);

return ( <section className="space-y-6">

  {/* Header */}
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-2xl font-semibold">Opportunities</h1>
      <p className="text-sm text-gray-500 max-md:w-[90%] pt-1">
        Manage job and internship opportunities.
      </p>
    </div>

    <button
      onClick={() => setShowModal(true)}
      className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm hover:opacity-90"
    >
      <Plus size={16} />
      Add New
    </button>
  </div>

  {/* Search */}
  <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-3">
    <Search size={18} className="text-gray-400" />

    <input
      type="text"
      placeholder="Search opportunities..."
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
            <th className="text-left p-4 font-medium">Opportunity</th>
            <th className="hidden md:table-cell text-left p-4 font-medium">
              Organization
            </th>
            <th className="hidden lg:table-cell text-left p-4 font-medium">
              Location
            </th>
            <th className="text-left p-4 font-medium">Deadline</th>
            <th className="text-left p-4 font-medium">Status</th>
            <th className="text-right p-4 font-medium"></th>
          </tr>
        </thead>

        <tbody>

          {filtered.map((opp) => (

            <tr
              key={opp.id}
              className="border-t border-gray-100 hover:bg-gray-50"
            >

              <td className="p-4">
                <div>
                  <p className="font-medium">{opp.title}</p>
                  <p className="text-xs text-gray-500 md:hidden">
                    {opp.organization}
                  </p>
                  <p className="text-xs text-gray-400 lg:hidden">
                    {opp.location}
                  </p>
                </div>
              </td>

              <td className="hidden md:table-cell p-4">
                {opp.organization}
              </td>

              <td className="hidden lg:table-cell p-4">
                {opp.location}
              </td>

              <td className="p-4">{opp.deadline}</td>

              <td className="p-4">
                {opp.status === "open" ? (
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                    Open
                  </span>
                ) : (
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                    Closed
                  </span>
                )}
              </td>

              <td className="p-4 text-right relative">

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenu(
                      activeMenu === opp.id ? null : opp.id
                    );
                  }}
                  className="p-2 rounded hover:bg-gray-100"
                >
                  <MoreVertical size={18} />
                </button>

                {activeMenu === opp.id && (

                  <div className="absolute right-4 mt-2 w-40 bg-white border border-gray-100 rounded-lg shadow-lg text-sm z-20">

                    <button className="block w-full text-left px-4 py-2 hover:bg-gray-50">
                      Edit
                    </button>

                    <button className="block w-full text-left px-4 py-2 hover:bg-gray-50">
                      Close Opportunity
                    </button>

                    <button className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-50">
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

  {/* Modal */}
  {/* Modal */}
{showModal && (

  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 z-[2500] ">

<div className="w-full max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden max-md:max-h-[90vh] max-md:overflow-y-scroll">

  {/* Header */}
  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
    <div>
      <h2 className="text-lg font-semibold">Add Opportunity</h2>
      <p className="text-sm text-gray-500 max-md:max-w-[90%] pt-1">
        Share a job, internship or opportunity with alumni.
      </p>
    </div>

    <button
      onClick={() => setShowModal(false)}
      className="p-2 rounded-lg hover:bg-gray-100"
    >
      <X size={18} />
    </button>
  </div>

  {/* Form */}
  <div className="px-6 py-6 space-y-5">

    {/* Title */}
    <div className="space-y-2">
      <label className="text-sm font-medium">Opportunity Title</label>
      <input
        type="text"
        placeholder="e.g. Junior Architect"
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 mt-1.5"
      />
    </div>

    {/* Organization */}
    <div className="space-y-1">
      <label className="text-sm font-medium">Organization</label>
      <input
        type="text"
        placeholder="Company or studio name"
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 mt-1.5"
      />
    </div>

    {/* Location + Deadline */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      <div className="space-y-1">
        <label className="text-sm font-medium">Location</label>
        <input
          type="text"
          placeholder="City, Country"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 mt-1.5"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Deadline</label>
        <input
          type="date"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 mt-1.5"
        />
      </div>

    </div>

    {/* Description */}
    <div className="space-y-1">
      <label className="text-sm font-medium">
        Description
        <span className="text-gray-400 text-xs ml-1">(optional)</span>
      </label>

      <textarea
        rows={4}
        placeholder="Describe the opportunity..."
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 resize-none mt-1.5"
      />
    </div>

    {/* Tags */}
<div className="space-y-2">
  <label className="text-sm font-medium">
    Opportunity Type
  </label>

  <div className="flex flex-wrap gap-2">

    {opportunityTags.map((tag) => {

      const active = tags.includes(tag);

      return (
        <button
          key={tag}
          type="button"
          onClick={() => toggleTag(tag)}
          className={`mt-1.5 px-3 py-1.5 text-xs rounded-full border transition
          ${
            active
              ? "bg-primary text-white border-primary"
              : "border-gray-200 text-gray-600 hover:bg-gray-100"
          }`}
        >
          {tag}
        </button>
      );
    })}

  </div>

</div>

  </div>

  {/* Footer */}
  <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">

    <button
      onClick={() => setShowModal(false)}
      className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-white"
    >
      Cancel
    </button>

    <button  onClick={() => setShowModal(false)} className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:opacity-90">
      Publish Opportunity
    </button>

  </div>

</div>


  </div>
)}


</section>


);
}
