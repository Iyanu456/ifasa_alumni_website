import Image from "next/image";
import Link from "next/link";
import { Users, Handshake, GraduationCap, Building2 } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="bg-[#f8f8f8] min-h-screen pt-[3em] md:pt-[6em]">
      {/* Hero */}
      <section className="w-[92%] sm:w-[90%] md:w-[80%] mx-auto mb-14 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4">
            About the Ife Architecture Alumni Association
          </h1>
          <p className="text-gray-600 leading-relaxed mb-4">
            The Ife Architecture Alumni Association (IAAA) is a network of
            graduates of the Department of Architecture, Obafemi Awolowo
            University, united by a shared commitment to excellence in design,
            practice, and community development.
          </p>
          <p className="text-gray-600 leading-relaxed">
            We exist to foster lifelong connections, support current students,
            promote professional growth, and contribute meaningfully to the
            development of our department and society at large.
          </p>

          <Link
            href="/register"
            className="inline-block mt-5 bg-primary text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition max-md:mt-[2em]"
          >
            Join the Alumni Network
          </Link>
        </div>

        <Image
          unoptimized
          src="/Landscape_of_Obafemi_Awolowo_University.png"
          alt="Ife Architecture students"
          width={800}
          height={600}
          className="rounded-2xl object-cover shadow-sm"
        />
      </section>

      {/* Mission, Vision, Values */}
      <section className="bg-white w-full py-[4em]">
      <div className="w-[92%] sm:w-[90%] md:w-[80%] mx-auto mb-16 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border-2 border-primary/50">
          <h3 className="font-semibold mb-2">Our Mission</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            To connect alumni, support students, and promote professional growth
            through mentorship, collaboration, and community-driven initiatives.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border-2 border-primary/50">
          <h3 className="font-semibold mb-2">Our Vision</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            To build a globally connected alumni network that positively impacts
            architectural practice, education, and societal development.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border-2 border-primary/50">
          <h3 className="font-semibold mb-2">Our Values</h3>
          <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
            <li>Community & Collaboration</li>
            <li>Excellence in Practice</li>
            <li>Mentorship & Growth</li>
            <li>Integrity & Service</li>
          </ul>
        </div>
      </div>
      </section>

      {/* What We Do */}
      <section className="w-[92%] sm:w-[90%] md:w-[80%] mx-auto mb-16 pt-[3.5em]">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center">
          What We Do
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-5 border border-gray-100 text-center">
            <Users className="mx-auto text-primary mb-3" />
            <h4 className="font-medium mb-1">Alumni Networking</h4>
            <p className="text-sm text-gray-600">
              Connecting graduates across industries and regions.
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-100 text-center">
            <GraduationCap className="mx-auto text-primary mb-3" />
            <h4 className="font-medium mb-1">Student Mentorship</h4>
            <p className="text-sm text-gray-600">
              Guiding students through mentorship and career advice.
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-100 text-center">
            <Building2 className="mx-auto text-primary mb-3" />
            <h4 className="font-medium mb-1">Professional Development</h4>
            <p className="text-sm text-gray-600">
              Workshops, talks, and career-building opportunities.
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-100 text-center">
            <Handshake className="mx-auto text-primary mb-3" />
            <h4 className="font-medium mb-1">Giving Back</h4>
            <p className="text-sm text-gray-600">
              Supporting the department and community projects.
            </p>
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="w-[92%] sm:w-[90%] md:w-[80%] mx-auto mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white rounded-2xl p-6 border border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-semibold text-primary">1,200+</p>
            <p className="text-sm text-gray-500">Registered Alumni</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-primary">20+</p>
            <p className="text-sm text-gray-500">Countries Represented</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-primary">100+</p>
            <p className="text-sm text-gray-500">Mentors</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-primary">30+</p>
            <p className="text-sm text-gray-500">Annual Events</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full bg-primary text-white py-14 text-center">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2">
          Be Part of the Legacy
        </h2>
        <p className="mb-5 text-white/90 max-md:w-[80%] max-md:mx-auto">
          Join the Ife Architecture Alumni Association and help shape the future.
        </p>
        <Link
          href="/register"
          className="inline-block bg-white text-primary px-8 py-3 rounded-full font-medium hover:opacity-90 transition"
        >
          Join the Network
        </Link>
      </section>
    </main>
  );
}
