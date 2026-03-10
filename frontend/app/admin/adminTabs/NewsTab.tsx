"use client";

import { useState, useEffect } from "react";
import { Search, MoreVertical, Plus, X } from "lucide-react";

type News = {
id: number;
title: string;
author: string;
date: string;
status: "published" | "draft";
tags: string[];
};

const dummyNews: News[] = [
{
id: 1,
title: "IFASA Alumni Launch New Design Initiative",
author: "Admin",
date: "May 10, 2026",
status: "published",
tags: ["Announcement"],
},
{
id: 2,
title: "Architecture Alumni Win International Award",
author: "Admin",
date: "Jun 02, 2026",
status: "draft",
tags: ["Award"],
},
];

const newsTags = [
"Announcement",
"Event",
"Award",
"Research",
"Community",
];

export default function NewsTab() {
const [query, setQuery] = useState("");
const [activeMenu, setActiveMenu] = useState<number | null>(null);
const [showModal, setShowModal] = useState(false);
const [tags, setTags] = useState<string[]>([]);

const filtered = dummyNews.filter((news) =>
news.title.toLowerCase().includes(query.toLowerCase())
);

const toggleTag = (tag: string) => {
if (tags.includes(tag)) {
setTags(tags.filter((t) => t !== tag));
} else {
setTags([...tags, tag]);
}
};

useEffect(() => {
const closeMenu = () => setActiveMenu(null);
window.addEventListener("click", closeMenu);
return () => window.removeEventListener("click", closeMenu);
}, []);

return ( <section className="space-y-6">

  {/* Header */}
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-2xl font-semibold">News</h1>
      <p className="text-sm text-gray-500 max-md:w-[85%] pt-1">
        Publish announcements and updates for alumni.
      </p>
    </div>

    <button
      onClick={() => setShowModal(true)}
      className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm hover:opacity-90"
    >
      <Plus size={16} />
      Add News
    </button>
  </div>

  {/* Search */}
  <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-3">
    <Search size={18} className="text-gray-400" />

    <input
      type="text"
      placeholder="Search news..."
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
            <th className="text-left p-4 font-medium">Title</th>
            <th className="hidden md:table-cell text-left p-4 font-medium">
              Author
            </th>
            <th className="text-left p-4 font-medium max-md:hidden">Tags</th>
            <th className="text-left p-4 font-medium">Date</th>
            <th className="text-left p-4 font-medium">Status</th>
            <th className="text-right p-4 font-medium max-md:hidden"></th>
          </tr>
        </thead>

        <tbody>

          {filtered.map((news) => (

            <tr
              key={news.id}
              className="border-t border-gray-100 hover:bg-gray-50"
            >

              {/* Title */}
              <td className="p-4 font-medium">
                {news.title}
              </td>

              {/* Author */}
              <td className="hidden md:table-cell p-4">
                {news.author}
              </td>

              {/* Tags */}
              <td className="p-4 max-md:hidden">

                <div className="flex flex-wrap gap-2 ">

                  {news.tags.map((tag) => (

                    <span
                      key={tag}
                      className="text-xs bg-gray-100 px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>

                  ))}

                </div>

              </td>

              {/* Date */}
              <td className="p-4">{news.date}</td>

              {/* Status */}
              <td className="p-4">

                {news.status === "published" ? (
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                    Published
                  </span>
                ) : (
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                    Draft
                  </span>
                )}

              </td>

              {/* Actions */}
              <td className="p-4 text-right relative max-md:hidden">

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenu(
                      activeMenu === news.id ? null : news.id
                    );
                  }}
                  className="p-2 rounded hover:bg-gray-100"
                >
                  <MoreVertical size={18} />
                </button>

                {activeMenu === news.id && (

                  <div className="absolute right-4 mt-2 w-40 bg-white border border-gray-100 rounded-lg shadow-lg text-sm z-20">

                    <button className="block w-full text-left px-4 py-2 hover:bg-gray-50">
                      Edit
                    </button>

                    <button className="block w-full text-left px-4 py-2 hover:bg-gray-50">
                      Publish
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

  {/* Add News Modal */}
  {/* News Modal */}
{showModal && (

  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

<div className="w-full max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden">

  {/* Header */}
  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
    <div>
      <h2 className="text-lg font-semibold">Create News Post</h2>
      <p className="text-sm text-gray-500">
        Share updates, announcements, and achievements.
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
    <div className="space-y-1">
      <label className="text-sm font-medium">
        News Title
      </label>

      <input
        type="text"
        placeholder="Enter news title..."
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
      />
    </div>

    {/* Content */}
    <div className="space-y-1">
      <label className="text-sm font-medium">
        News Content
      </label>

      <textarea
        rows={5}
        placeholder="Write the news content..."
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 resize-none"
      />
    </div>

    {/* Tags */}
    <div className="space-y-2">

      <label className="text-sm font-medium">
        News Category
      </label>

      <div className="flex flex-wrap gap-2">

        {newsTags.map((tag) => {

          const active = tags.includes(tag);

          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1.5 text-xs rounded-full border transition
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

    {/* Publish Options */}
    <div className="space-y-1">
      <label className="text-sm font-medium">
        Status
      </label>

      <select
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
      >
        <option value="draft">Save as Draft</option>
        <option value="published">Publish Now</option>
      </select>
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

    <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:opacity-90">
      Publish News
    </button>

  </div>

</div>

  </div>
)}


</section>

);
}
