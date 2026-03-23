"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import { useEventsQuery } from "../apiServices/queries";
import { buildContentFallbackImage, formatDate } from "../lib/formatters";

type EventCategory =
  | "All"
  | "Networking"
  | "Workshop"
  | "Conference"
  | "Meetup"
  | "Seminar"
  | "Talk"
  | "Reunion"
  | "Other";

const CATEGORIES: EventCategory[] = [
  "All",
  "Networking",
  "Workshop",
  "Conference",
  "Meetup",
  "Seminar",
  "Talk",
  "Reunion",
  "Other",
];

export default function EventsPage() {
  const [activeCategory, setActiveCategory] = useState<EventCategory>("All");
  const upcomingQuery = useEventsQuery({
    timeframe: "upcoming",
    category: activeCategory,
    limit: 50,
    sort: "date",
    order: "asc",
  });
  const pastQuery = useEventsQuery({
    timeframe: "past",
    category: activeCategory,
    limit: 50,
    sort: "date",
    order: "desc",
  });

  const upcomingEvents = useMemo(() => upcomingQuery.data?.data ?? [], [upcomingQuery.data]);
  const pastEvents = useMemo(() => pastQuery.data?.data ?? [], [pastQuery.data]);

  return (
    <main className="bg-[#f8f8f8] min-h-screen pt-[6em] pb-[5em]">
      <section className="w-[92%] sm:w-[90%] md:w-[80%] mx-auto mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-2">Events</h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Stay connected through alumni events, workshops, talks, and reunions.
        </p>
      </section>

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

      <section className="w-[92%] sm:w-[90%] md:w-[80%] mx-auto mb-14">
        <h2 className="text-xl sm:text-2xl font-semibold mb-5">Upcoming Events</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition"
            >
              <div className="relative h-44 w-full">
                <Image
                  unoptimized
                  src={event.coverImageUrl || buildContentFallbackImage("event", event.title)}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-4">
                <h3 className="font-semibold mb-1">{event.title}</h3>
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-2 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} /> {formatDate(event.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={14} /> {event.location}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{event.description}</p>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                    {event.category}
                  </span>
                  <Link
                    href={`/events/${event.slug || event._id}`}
                    className="text-primary text-sm font-medium hover:underline"
                  >
                    View →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="w-[92%] sm:w-[90%] md:w-[80%] mx-auto">
        <h2 className="text-xl sm:text-2xl font-semibold mb-5">Past Events</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastEvents.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 opacity-80"
            >
              <div className="relative h-40 w-full">
                <Image
                  unoptimized
                  src={event.coverImageUrl || buildContentFallbackImage("event", event.title)}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-4">
                <h3 className="font-medium mb-1">{event.title}</h3>
                <p className="text-xs text-gray-500 mb-1">{formatDate(event.date)}</p>
                <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                <Link
                  href={`/events/${event.slug || event._id}`}
                  className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
                >
                  View →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
