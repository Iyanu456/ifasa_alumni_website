"use client";

import Image from "next/image";
import Link from "next/link";
import EventCard from "./components/Homepage/EventCard";
import StatCard from "./components/Homepage/StatsCard";
import AlumniSpotlight from "./components/Homepage/AlumniSpotlight";
import NewsCard from "./components/Homepage/NewsCard";
import { useHomeDashboardQuery } from "./apiServices/queries";
import { buildContentFallbackImage, formatDate } from "./lib/formatters";

export default function Home() {
  const { data, isLoading, isError } = useHomeDashboardQuery();
  const dashboard = data?.data;

  return (
    <main className="grid bg-[#f7f7f7] overflow-x-hidden mt-[-1em]">
      <section className="relative grid h-max">
        <Image
          unoptimized
          src="/Landscape_of_Obafemi_Awolowo_University.png"
          alt="Landscape of Obafemi Awolowo University campus"
          className="w-full h-[70vh] sm:h-[75vh] md:max-h-[75vh] object-cover"
          width={1600}
          height={900}
          priority
        />
        <div className="absolute inset-0 bg-[#0e000081]" />

        <div className="absolute inset-0 grid place-items-center px-2">
          <div className="w-[95%] sm:w-[90%] md:w-[80%] flex flex-col justify-center">
            <h1 className="text-[1.9em] sm:text-[2.4em] md:text-[3em] lg:text-[3.5em] xl:text-[4.2em] font-semibold text-white leading-[1.2em] font-montserrat text-center mx-auto">
              Ife Architecture <br /> Alumni Association
            </h1>

            <p className="text-gray-100/80 mt-3 sm:mt-4 mb-3 md:leading-7 text-[0.85em] sm:text-base md:text-lg text-center mx-auto max-w-2xl">
              A vibrant community of architects, designers, and builders shaping
              the future. Stay connected, give back, and grow together.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mx-auto mt-3 sm:mt-4 w-full sm:w-auto max-sm:w-[90%]">
              <Link
                href="/register"
                className="text-center bg-primary px-6 sm:px-8 py-3 text-white rounded-full md:text-lg font-medium shadow-2xl transition hover:scale-[1.02] active:scale-[0.98]"
              >
                Join the Alumni Network
              </Link>

              <Link
                href="/community"
                className="text-center border border-white text-white px-6 sm:px-8 py-3 rounded-full md:text-lg font-medium hover:bg-white hover:text-black transition"
              >
                Explore Community
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/*<section className="w-[92%] sm:w-[90%] md:w-[80%] mx-auto -mt-[2.5em] sm:-mt-[3em] relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 bg-white rounded-2xl shadow-lg p-4 sm:p-6">
          <StatCard
            label="Registered Alumni"
            value={isLoading ? "..." : String(dashboard?.stats.registeredAlumni ?? 0)}
          />
          <StatCard
            label="Countries Represented"
            value={isLoading ? "..." : String(dashboard?.stats.countriesRepresented ?? 0)}
          />
          <StatCard
            label="Mentors Available"
            value={isLoading ? "..." : String(dashboard?.stats.mentorsAvailable ?? 0)}
          />
          <StatCard
            label="Active Events"
            value={isLoading ? "..." : String(dashboard?.stats.activeEvents ?? 0)}
          />
        </div>
      </section>*/}

      <section className="w-[92%] sm:w-[90%] md:w-[70%] mx-auto pt-[2em] mb-[2em] sm:my-[4em] grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold mb-3">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed text-[1em] sm:text-base">
            The Ife Architecture Alumni Association exists to foster lifelong
            connections among graduates, support current students through
            mentorship, promote professional growth, and contribute to the
            development of the department and society at large.
          </p>

          <Link
            href="/about"
            className="inline-block mt-4 text-primary font-medium hover:underline text-sm sm:text-base"
          >
            Learn more about us →
          </Link>
        </div>

        <Image
          src="/Landscape_of_Obafemi_Awolowo_University.png"
          alt="Architecture students"
          width={400}
          height={600}
          className="rounded-xl object-cover w-full h-[300px] sm:h-[280px] md:h-auto"
        />
      </section>

      <section className="w-full h-max my-[2em] py-[4em] bg-white">
        <h2 className="text-center text-xl sm:text-2xl font-semibold">Upcoming Events</h2>

        <div className="w-[92%] sm:w-[90%] md:w-[80%] mt-[1.5em] sm:mt-[2em] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[1em]">
          {isLoading && Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-[320px] rounded-xl bg-gray-100 animate-pulse" />
          ))}

          {!isLoading &&
            dashboard?.featuredEvents.slice(0, 4).map((event) => (
              <EventCard
                key={event._id}
                title={event.title}
                date={formatDate(event.date)}
                location={event.location}
                description={event.description}
                image={event.coverImageUrl || buildContentFallbackImage("event", event.title)}
                href={`/events/${event.slug || event._id}`}
              />
            ))}
        </div>

        {!isLoading && !dashboard?.featuredEvents.length && (
          <p className="text-center text-gray-500 mt-6">No upcoming events yet.</p>
        )}

        <div className="mt-6 sm:mt-8 text-center">
          <Link
            href="/events"
            className="text-primary font-medium hover:underline text-sm sm:text-base"
          >
            View all events →
          </Link>
        </div>
      </section>

      <section className="w-[92%] sm:w-[90%] md:w-[80%] mx-auto my-[3em] sm:my-[4em]">
        <h2 className="text-center text-xl sm:text-2xl font-semibold mb-5 sm:mb-6">
          Featured Opportunities
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {isLoading && Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-[320px] rounded-xl bg-gray-100 animate-pulse" />
          ))}

          {!isLoading &&
            dashboard?.featuredOpportunities.slice(0, 3).map((item) => (
              <NewsCard
                key={item._id}
                title={item.title}
                date={item.deadline ? formatDate(item.deadline) : undefined}
                excerpt={item.description}
                containerClassName="bg-white shadow-xl border border-gray-500/30"
                tag={item.category}
                image={item.coverImageUrl || buildContentFallbackImage("scholarship", item.title)}
                organization={item.organization}
                href={`/opportunities/${item.slug || item._id}`}
              />
            ))}
        </div>

        {!isLoading && !dashboard?.featuredOpportunities.length && (
          <p className="text-center text-gray-500 mt-6">No featured opportunities available.</p>
        )}

        <div className="text-center mt-6">
          <Link href="/opportunities" className="text-primary font-medium hover:underline">
            View all opportunities →
          </Link>
        </div>
      </section>

      <section className="w-full bg-white">
        <section className="w-[92%] sm:w-[90%] md:w-[80%] mx-auto my-[3em] sm:my-[4em]">
          <h2 className="text-center text-xl sm:text-2xl font-semibold mb-5 sm:mb-6">
            Alumni Spotlight
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {isLoading && Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-[220px] rounded-xl bg-gray-100 animate-pulse" />
            ))}

            {!isLoading &&
              dashboard?.spotlightAlumni.slice(0, 3).map((alumnus) => (
                <AlumniSpotlight
                  key={alumnus._id}
                  name={alumnus.fullName}
                  role={[alumnus.currentRole, alumnus.location].filter(Boolean).join(", ")}
                  quote={
                    alumnus.spotlightQuote ||
                    alumnus.bio ||
                    "Featured alumni story coming soon."
                  }
                  image={alumnus.avatarUrl || undefined}
                  href={`/community/${alumnus._id}`}
                />
              ))}
          </div>

          {!isLoading && !dashboard?.spotlightAlumni.length && (
            <p className="text-center text-gray-500 mt-6">No spotlight alumni available yet.</p>
          )}
        </section>
      </section>

      <section className="w-full bg-gray-50 py-[3em] sm:py-[4em] mb-[4em]">
        <h2 className="text-center text-xl sm:text-2xl font-semibold mb-5 sm:mb-6">
          Latest News & Updates
        </h2>

        {isError && (
          <p className="text-center text-red-600">Unable to load homepage updates right now.</p>
        )}

        <div className="w-[92%] sm:w-[90%] md:w-[80%] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {isLoading && Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-[260px] rounded-xl bg-gray-100 animate-pulse" />
          ))}

          {!isLoading &&
            dashboard?.latestNews.slice(0, 3).map((news) => (
              <NewsCard
                key={news._id}
                title={news.title}
                date={news.publishedAt ? formatDate(news.publishedAt) : undefined}
                excerpt={news.excerpt || news.content}
                containerClassName="bg-white shadow-xl"
                tag={news.tags}
                image={news.coverImageUrl || buildContentFallbackImage("news", news.title)}
                href={`/news/${news.slug || news._id}`}
              />
            ))}
        </div>
      </section>

      <section className="w-full py-[3em] sm:py-[4em] bg-primary text-white text-center px-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-3">
          Are you an Ife Architecture Alumnus?
        </h2>
        <p className="mb-5 sm:mb-6 text-white/90 text-sm sm:text-base">
          Join the network and stay connected with your classmates and mentors.
        </p>
        <Link
          href="/register"
          className="inline-block bg-white text-primary px-6 sm:px-8 py-3 rounded-full font-medium hover:opacity-90 transition"
        >
          Join Now
        </Link>
      </section>
    </main>
  );
}
