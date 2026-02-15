import Image from "next/image";
import Link from "next/link";
import EventCard from "./components/Homepage/EventCard";
import StatCard from "./components/Homepage/StatsCard";
import AlumniSpotlight from "./components/Homepage/AlumniSpotlight";
import NewsCard from "./components/Homepage/NewsCard";

export default function Home() {
  return (
    <main className="grid bg-[#f7f7f7] overflow-x-hidden">
      {/* Hero Section */}
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

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mx-auto mt-3 sm:mt-4 w-full sm:w-auto max-sm:w-[90%] max-sm:mt[2em]">
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

      {/* Quick Stats */}
      <section className="w-[92%] sm:w-[90%] md:w-[80%] mx-auto -mt-[2.5em] sm:-mt-[3em] relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 bg-white rounded-2xl shadow-lg p-4 sm:p-6">
          <StatCard label="Registered Alumni" value="1,250+" />
          <StatCard label="Countries Represented" value="18" />
          <StatCard label="Mentors Available" value="120+" />
          <StatCard label="Active Events" value="6" />
        </div>
      </section>

      {/* About / Mission */}
      <section className="w-[92%] sm:w-[90%] md:w-[70%] mx-auto pt-[2em] mb-[2em] sm:my-[4em] grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold mb-3">
            Our Mission
          </h2>
          <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
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

      {/* Events Section */}
      <section className="w-full h-max my-[2em] py-[4em] bg-white">
        <h2 className="text-center text-xl sm:text-2xl font-semibold">
          Upcoming Events
        </h2>

        <div className="w-[92%] sm:w-[90%] md:w-[80%] mt-[1.5em] sm:mt-[2em] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[1em]">
          <EventCard />
          <EventCard />
          <EventCard />
          <EventCard />
        </div>

        <div className="mt-6 sm:mt-8 text-center">
          <Link
            href="/events"
            className="text-primary font-medium hover:underline text-sm sm:text-base"
          >
            View all events →
          </Link>
        </div>
      </section>

      {/* Alumni Spotlight */}
      <section className="w-[92%] sm:w-[90%] md:w-[80%] mx-auto my-[3em] sm:my-[4em]">
        <h2 className="text-center text-xl sm:text-2xl font-semibold mb-5 sm:mb-6">
          Alumni Spotlight
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <AlumniSpotlight
            name="Tunde Adebayo"
            role="Senior Architect, Lagos"
            quote="Being part of the Ife Architecture alumni network has opened doors to mentorship and collaborations I never imagined."
          />
          <AlumniSpotlight
            name="Funke Oladipo"
            role="Urban Designer, UK"
            quote="Staying connected to my roots while working abroad has been invaluable to my growth."
          />
          <AlumniSpotlight
            name="Ibrahim Musa"
            role="Project Manager, Abuja"
            quote="The alumni events helped me transition smoothly into professional practice."
          />
        </div>
      </section>

      {/* News / Updates */}
      <section className="w-full bg-white py-[3em] sm:py-[4em]">
        <h2 className="text-center text-xl sm:text-2xl font-semibold mb-5 sm:mb-6">
          Latest News & Updates
        </h2>

        <div className="w-[92%] sm:w-[90%] md:w-[80%] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <NewsCard
            title="New Alumni Executive Council Announced"
            date="Jan 2026"
            excerpt="Meet the newly elected alumni leaders for the 2026–2028 term."
          />
          <NewsCard
            title="Ife Architecture Alumni Donate Studio Equipment"
            date="Dec 2025"
            excerpt="Alumni contribute new drafting tools and computers to the department."
          />
          <NewsCard
            title="Mentorship Program Launches"
            date="Nov 2025"
            excerpt="Alumni mentors now paired with final-year students."
          />
        </div>
      </section>

      {/* Final CTA */}
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
