"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Calendar, MapPin } from "lucide-react";
import { useEventQuery } from "../../apiServices/queries";
import { buildContentFallbackImage, formatDate } from "../../lib/formatters";

export default function EventDetailPage() {
  const params = useParams<{ id: string }>();
  const identifier = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const eventQuery = useEventQuery(identifier);
  const event = eventQuery.data?.data.event;

  return (
    <main className="min-h-screen pb-[4em] pt-[6em]">
      <section className="mx-auto w-[92%] sm:w-[90%] md:w-[70%]">
        {eventQuery.isLoading ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
            Loading event details...
          </div>
        ) : eventQuery.error || !event ? (
          <div className="rounded-2xl border border-dashed border-red-200 bg-red-50 p-10 text-center">
            <h1 className="text-xl font-semibold text-gray-900">Event not found</h1>
            <Link href="/events" className="mt-5 inline-block rounded-full bg-primary px-6 py-3 font-medium text-white">
              Back to events
            </Link>
          </div>
        ) : (
          <>
            <div className="relative mb-6 h-[250px] w-full overflow-hidden rounded-xl sm:h-[320px] md:h-[380px]">
              <Image
                src={event.coverImageUrl || buildContentFallbackImage("event", event.title)}
                alt={event.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <h1 className="text-2xl font-semibold sm:text-3xl">{event.title}</h1>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar size={16} /> {formatDate(event.date)}
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={16} /> {event.location}
              </span>
            </div>
            <article className="mt-8 whitespace-pre-line leading-8 text-gray-700">
              {event.description}
            </article>
            {event.registrationLink ? (
              <a
                href={event.registrationLink}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-block rounded-full bg-primary px-6 py-3 font-medium text-white"
              >
                RSVP
              </a>
            ) : null}
          </>
        )}
      </section>
    </main>
  );
}
