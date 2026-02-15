"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { HeartHandshake, Building2, GraduationCap, Wrench } from "lucide-react";

export default function DonatePage() {
  const [amount, setAmount] = useState("");
  const [sponsorForm, setSponsorForm] = useState({
    name: "",
    email: "",
    organization: "",
    message: "",
  });

  const handleDonate = () => {
    alert(`Proceed to donate ₦${amount || "0"} (frontend only for now)`);
  };

  const handleSponsorSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(sponsorForm);
    alert("Sponsorship request sent! (frontend only for now)");
  };

  return (
    <main className="bg-[#f8f8f8] min-h-screen pt-[6em] pb-[5em]">
      {/* Hero */}
      <section className="w-[92%] sm:w-[90%] md:w-[80%] mx-auto mb-14 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-3">
          Donate & Sponsor
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Your support helps strengthen the alumni community, empower students,
          and improve learning facilities within the Department of Architecture,
          OAU.
        </p>
      </section>

      {/* What Your Support Does */}
      <section className="w-[92%] sm:w-[90%] md:w-[80%] mx-auto mb-16 grid sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
          <GraduationCap className="mx-auto text-primary mb-3" />
          <h3 className="font-medium mb-1">Student Support</h3>
          <p className="text-sm text-gray-600">
            Scholarships, studio materials, and learning resources.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
          <Building2 className="mx-auto text-primary mb-3" />
          <h3 className="font-medium mb-1">Studio Improvements</h3>
          <p className="text-sm text-gray-600">
            Equipment upgrades and workspace enhancements.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
          <Wrench className="mx-auto text-primary mb-3" />
          <h3 className="font-medium mb-1">Events & Workshops</h3>
          <p className="text-sm text-gray-600">
            Funding alumni events, talks, and professional workshops.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
          <HeartHandshake className="mx-auto text-primary mb-3" />
          <h3 className="font-medium mb-1">Mentorship Programs</h3>
          <p className="text-sm text-gray-600">
            Supporting mentorship initiatives for students and young graduates.
          </p>
        </div>
      </section>

      {/* Donation & Sponsorship */}
<section className="w-[92%] sm:w-[90%] md:w-[80%] mx-auto mb-16 grid md:grid-cols-2 gap-8 items-start h-[max-content]">
  {/* Donation Card */}
  <div className="bg-white rounded-2xl p-6 h-full grid border border-gray-100">
    <h2 className="text-lg font-semibold mb-3">Make a Donation</h2>
    <p className="text-sm text-gray-600 mb-4">
      Your support helps fund mentorship programs, student support initiatives,
      studio improvements, and alumni-led projects. Any amount makes a
      meaningful impact.
    </p>

    <form
      onSubmit={(e) => {
        e.preventDefault();
        alert("Proceed to donation gateway (frontend only for now)");
      }}
      className="flex flex-col gap-3"
    >
      <input
        type="number"
        min={1}
        placeholder="Enter donation amount (₦)"
        required
        className="w-full rounded-lg px-4 py-3 bg-[#FAFAFA] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30"
      />

      <input
        type="text"
        placeholder="Full name (optional)"
        className="w-full rounded-lg px-4 py-3 bg-[#FAFAFA] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30"
      />

      <input
        type="email"
        placeholder="Email address (optional, for receipt)"
        className="w-full rounded-lg px-4 py-3 bg-[#FAFAFA] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30"
      />

      <button
        type="submit"
        className="w-full mb-0 mt-auto bg-primary text-white py-3 rounded-lg font-medium hover:opacity-90 transition"
      >
        Proceed to Donate
      </button>
    </form>

    <p className="text-xs text-gray-500 mt-3">
      Secure payment processing.
    </p>
  </div>

  {/* Sponsorship Card */}
  <div className="bg-white rounded-2xl p-6 border border-gray-100">
    <h2 className="text-lg font-semibold mb-3">
      Become a Sponsor / Partner
    </h2>
    <p className="text-sm text-gray-600 mb-4">
      Organizations and individuals can support specific programs, events, or
      facilities. Tell us how you’d like to partner with us.
    </p>

    <form
      onSubmit={(e) => {
        e.preventDefault();
        alert("Sponsorship request sent! (frontend only for now)");
      }}
      className="space-y-3"
    >
      <input
        type="text"
        placeholder="Your name"
        required
        className="w-full rounded-lg px-4 py-3 bg-[#FAFAFA] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30"
      />

      <input
        type="email"
        placeholder="Email address"
        required
        className="w-full rounded-lg px-4 py-3 bg-[#FAFAFA] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30"
      />

      <textarea
        rows={4}
        placeholder="How would you like to sponsor or partner with us?"
        required
        className="w-full rounded-lg px-4 py-3 bg-[#FAFAFA] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30"
      />

      <button
        type="submit"
        className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:opacity-90 transition"
      >
        Submit Sponsorship Request
      </button>

      <p className="text-xs text-gray-500 mt-3">
      Secure payment processing.
    </p>
    </form>
  </div>
</section>


      {/* Trust Footer */}
      <section className="w-full bg-white py-12 text-center border-t border-gray-100">
        <p className="text-sm text-gray-600">
          All donations and sponsorships go directly towards alumni and
          departmental development initiatives.
        </p>
        <Link
          href="/contact"
          className="inline-block mt-3 text-primary font-medium hover:underline"
        >
          Have questions? Contact us →
        </Link>
      </section>
    </main>
  );
}
