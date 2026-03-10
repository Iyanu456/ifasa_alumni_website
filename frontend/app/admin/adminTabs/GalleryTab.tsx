"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, MoreVertical, X } from "lucide-react";

type GalleryItem = {
id: number;
title: string;
image: string;
date: string;
};

const dummyGallery: GalleryItem[] = [
{
id: 1,
title: "IFASA Alumni Meetup",
image: "https://picsum.photos/seed/gallery1/600/400",
date: "May 2026",
},
{
id: 2,
title: "Architecture Workshop",
image: "https://picsum.photos/seed/gallery2/600/400",
date: "April 2026",
},
{
id: 3,
title: "Design Exhibition",
image: "https://picsum.photos/seed/gallery3/600/400",
date: "March 2026",
},
];

export default function GalleryTab() {
const [gallery, setGallery] = useState(dummyGallery);
const [showModal, setShowModal] = useState(false);
const [activeMenu, setActiveMenu] = useState<number | null>(null);

useEffect(() => {
const closeMenu = () => setActiveMenu(null);
window.addEventListener("click", closeMenu);
return () => window.removeEventListener("click", closeMenu);
}, []);

return ( <section className="space-y-6">

  {/* Header */}
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-2xl font-semibold">Gallery</h1>
      <p className="text-sm text-gray-500">
        Upload and manage alumni event photos.
      </p>
    </div>

    <button
      onClick={() => setShowModal(true)}
      className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm hover:opacity-90"
    >
      <Plus size={16} />
      Upload Photo
    </button>
  </div>

  {/* Gallery Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">

    {gallery.map((item) => (

      <div
        key={item.id}
        className="bg-white border border-gray-100 rounded-xl overflow-hidden relative group"
      >

        {/* Image */}
        <div className="relative h-48">

          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
          />

        </div>

        {/* Info */}
        <div className="p-4">

          <p className="text-sm font-medium">
            {item.title}
          </p>

          <p className="text-xs text-gray-500">
            {item.date}
          </p>

        </div>

        {/* Menu */}
        <div className="absolute top-2 right-2">

          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveMenu(
                activeMenu === item.id ? null : item.id
              );
            }}
            className="p-2 bg-white rounded-lg shadow hover:bg-gray-100"
          >
            <MoreVertical size={16} />
          </button>

          {activeMenu === item.id && (

            <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-100 rounded-lg shadow-lg text-sm z-20">

              <button className="block w-full text-left px-4 py-2 hover:bg-gray-50">
                Edit
              </button>

              <button className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-50">
                Delete
              </button>

            </div>

          )}

        </div>

      </div>

    ))}

  </div>

  {/* Upload Modal */}
  {showModal && (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">

      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">

          <div>
            <h2 className="text-lg font-semibold">
              Upload Photo
            </h2>

            <p className="text-sm text-gray-500">
              Add images from alumni events.
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
              Photo Title
            </label>

            <input
              type="text"
              placeholder="e.g. IFASA Alumni Meetup"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
            />

          </div>

          {/* Image Upload */}
          <div className="space-y-1">

            <label className="text-sm font-medium">
              Upload Image
            </label>

            <input
              type="file"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />

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
            Upload Photo
          </button>

        </div>

      </div>

    </div>

  )}

</section>

);
}
