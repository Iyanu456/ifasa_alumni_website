"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Users } from "lucide-react";

type EventCategory = "All" | "Networking" | "Workshop" | "Talk" | "Reunion";

type EventItem = {
  id: number;
  title: string;
  date: string;
  location: string;
  category: Exclude<EventCategory, "All">;
  image: string;
  description: string;
  isPast?: boolean;
};

const EVENTS: EventItem[] = [
  {
    id: 1,
    title: "Alumni Networking Night 2026",
    date: "Feb 20, 2026",
    location: "Lagos, Nigeria",
    category: "Networking",
    image: "https://picsum.photos/seed/eventA/800/600",
    description:
      "An evening of networking with fellow alumni, industry leaders, and current students.",
  },
  {
    id: 2,
    title: "Digital Fabrication Workshop",
    date: "Mar 12, 2026",
    location: "OAU Campus",
    category: "Workshop",
    image: "https://picsum.photos/seed/eventB/800/600",
    description:
      "Hands-on workshop exploring modern digital fabrication tools and workflows.",
  },
  {
    id: 3,
    title: "Architecture Career Talk",
    date: "Apr 5, 2026",
    location: "Virtual (Zoom)",
    category: "Talk",
    image: "https://picsum.photos/seed/eventC/800/600",
    description:
      "Industry professionals share career paths and practical advice for young architects.",
  },
  {
    id: 4,
    title: "Class of 2015 Reunion",
    date: "Dec 15, 2025",
    location: "Ile-Ife, Nigeria",
    category: "Reunion",
    image: "https://picsum.photos/seed/eventD/800/600",
    description:
      "Reconnecting with classmates and celebrating milestones together.",
    isPast: true,
  },
];

const CATEGORIES: EventCategory[] = [
  "All",
  "Networking",
  "Workshop",
  "Talk",
  "Reunion",
];

export default function EventsPage() {
  const [activeCategory, setActiveCategory] =
    useState<EventCategory>("All");

  const upcomingEvents = useMemo(
    () => EVENTS.filter((e) => !e.isPast),
    []
  );

  const pastEvents = useMemo(() => EVENTS.filter((e) => e.isPast), []);

  const filteredUpcoming = useMemo(() => {
    if (activeCategory === "All") return upcomingEvents;
    return upcomingEvents.filter((e) => e.category === activeCategory);
  }, [activeCategory, upcomingEvents]);

  return (
    <main className="bg-[#f8f8f8] min-h-screen pt-[6em] pb-[5em]">
      {/* Header */}
      <section className="w-[92%] sm:w-[90%] md:w-[80%] mx-auto mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-2">
          Events
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Stay connected through alumni events, workshops, talks, and reunions.
        </p>
      </section>

      {/* Filters */}
      <section className="w-[92%] sm:w-[90%] md:w-[80%] mx-auto mb-8 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              activeCategory === cat
                ? "bg-primary text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* Upcoming */}
      <section className="w-[92%] sm:w-[90%] md:w-[80%] mx-auto mb-14">
        <h2 className="text-xl sm:text-2xl font-semibold mb-5">
          Upcoming Events
        </h2>

        {filteredUpcoming.length === 0 ? (
          <div className="bg-white rounded-xl p-6 text-center text-gray-500 border border-gray-100">
            No upcoming events found for this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUpcoming.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition"
              >
                <div className="relative h-44 w-full">
                  <Image
                    unoptimized
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-4">
                  <h3 className="font-semibold mb-1">{event.title}</h3>

                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} /> {event.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={14} /> {event.location}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {event.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                      {event.category}
                    </span>

                    <button className="text-primary text-sm font-medium hover:underline">
                      RSVP →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Past */}
      <section className="w-[92%] sm:w-[90%] md:w-[80%] mx-auto">
        <h2 className="text-xl sm:text-2xl font-semibold mb-5">
          Past Events
        </h2>

        {pastEvents.length === 0 ? (
          <div className="bg-white rounded-xl p-6 text-center text-gray-500 border border-gray-100">
            No past events yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 opacity-80"
              >
                <div className="relative h-40 w-full">
                  <Image
                    unoptimized
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-4">
                  <h3 className="font-medium mb-1">{event.title}</h3>
                  <p className="text-xs text-gray-500 mb-1">{event.date}</p>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
