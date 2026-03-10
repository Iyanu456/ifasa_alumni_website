"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { X, Download } from "lucide-react";

type GalleryItem = {
  id: number;
  src: string;
  alt: string;
  category: "Events" | "Reunions" | "Campus" | "Workshops";
};

const GALLERY_DATA: GalleryItem[] = [
  { id: 1, src: "https://picsum.photos/seed/oau1/800/600", alt: "OAU Campus Landscape", category: "Campus" },
  { id: 2, src: "https://picsum.photos/seed/event1/800/600", alt: "Alumni Networking Night 2025", category: "Events" },
  { id: 3, src: "https://picsum.photos/seed/reunion1/800/600", alt: "Class of 2015 Reunion Dinner", category: "Reunions" },
  { id: 4, src: "https://picsum.photos/seed/workshop1/800/600", alt: "Design Thinking Workshop", category: "Workshops" },
  { id: 5, src: "https://picsum.photos/seed/oau2/800/600", alt: "Architecture Studio Session", category: "Campus" },
  { id: 6, src: "https://picsum.photos/seed/event2/800/600", alt: "Guest Lecture by Alumni Professionals", category: "Events" },
  { id: 7, src: "https://picsum.photos/seed/reunion2/800/600", alt: "Annual Alumni Reunion 2024", category: "Reunions" },
  { id: 8, src: "https://picsum.photos/seed/workshop2/800/600", alt: "Hands-on Digital Fabrication Workshop", category: "Workshops" },
];

const TABS = ["All", "Events", "Reunions", "Campus", "Workshops"] as const;

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("All");
  const [activeImage, setActiveImage] = useState<GalleryItem | null>(null);

  const filteredImages = useMemo(() => {
    if (activeTab === "All") return GALLERY_DATA;
    return GALLERY_DATA.filter((img) => img.category === activeTab);
  }, [activeTab]);

  return (
    <main className="bg-[#f8f8f8] min-h-screen pt-[3em] md:pt-[6em]  pb-[4em]">
      {/* Header */}
      <section className="w-[92%] sm:w-[90%] md:w-[80%] mx-auto mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-2">
          Gallery
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Moments from alumni events, reunions, workshops, and campus life.
        </p>
      </section>

      {/* Tabs */}
      <section className="w-[92%] sm:w-[90%] md:w-[80%] mx-auto mb-6 flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              activeTab === tab
                ? "bg-primary text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </section>

      {/* Grid */}
      <section className="w-[92%] sm:w-[90%] md:w-[80%] mx-auto columns-1 sm:columns-2 md:columns-3 gap-4">
        {filteredImages.map((img) => (
          <div
            key={img.id}
            className="group mb-4 break-inside-avoid overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition"
          >
            <button
              onClick={() => setActiveImage(img)}
              className="relative block w-full aspect-[4/3] overflow-hidden"
              aria-label={`View ${img.alt}`}
            >
              <Image
                unoptimized
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />

              {/* Hover overlay with caption */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-3 text-left">
                  <p className="text-white text-sm font-medium leading-snug">
                    {img.alt}
                  </p>
                  <span className="text-white/80 text-xs">
                    {img.category}
                  </span>
                </div>
              </div>
            </button>

            {/* Actions */}
            <div className="flex items-center justify-between px-3 py-2 text-xs sm:text-sm bg-white">
              <span className="text-gray-500 line-clamp-1">{img.alt}</span>

              <a
                href={img.src}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                <Download size={14} />
                Download
              </a>
            </div>
          </div>
        ))}
      </section>

      {/* Lightbox */}
      {activeImage && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <button
            onClick={() => setActiveImage(null)}
            className="absolute top-4 right-4 text-white hover:opacity-80"
            aria-label="Close"
          >
            <X size={28} />
          </button>

          <div className="relative max-w-5xl w-full">
            <Image
              unoptimized
              src={activeImage.src}
              alt={activeImage.alt}
              width={1200}
              height={800}
              className="w-full h-auto rounded-lg object-contain"
            />

            <div className="flex items-center justify-between mt-3 text-sm text-gray-200">
              <p>
                {activeImage.alt} • {activeImage.category}
              </p>

              <a
                href={activeImage.src}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-white hover:underline"
              >
                <Download size={16} />
                Download
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
