"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin, HeartHandshake } from "lucide-react";
import InputField from "../components/InputField";

type Executive = {
  id: number;
  name: string;
  role: string;
  image?: string;
};

const EXECUTIVES: Executive[] = [
  { id: 1, name: "Engr. Tunde Adebayo", role: "President", image: "https://picsum.photos/seed/president/300/300" },
  { id: 2, name: "Arc. Funke Oladipo", role: "Vice President", image: "https://picsum.photos/seed/vicepresident/300/300" },
  { id: 3, name: "Arc. Ibrahim Musa", role: "General Secretary", image: "https://picsum.photos/seed/secretary/300/300" },
  { id: 4, name: "Arc. Aisha Bello", role: "Treasurer", image: "https://picsum.photos/seed/treasurer/300/300" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const updateField = (field: "name" | "email" | "message", value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Message sent! (Frontend only for now)");
  };

  return (
    <main className="bg-[#f8f8f8] min-h-screen pt-[3em] md:pt-[6em] pb-[5em]">
      {/* Hero */}
      <section className="w-[92%] sm:w-[90%] md:w-[80%] mx-auto mb-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-2">
          Let’s Connect
        </h1>
        <p className="text-gray-600 max-w-2xl">
          Whether you have questions, want to support the association, or need to
          reach our executives — we’re here.
        </p>
      </section>

      {/* Contact Blocks */}
      <section className="w-[92%] sm:w-[90%] md:w-[80%] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mb-14">
        {/* Info */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-semibold mb-4">Contact details</h3>

          <div className="space-y-3 text-sm text-gray-600">
            <p className="flex items-center gap-2">
              <Mail size={16} className="text-primary" /> alumni.ife@oau.edu.ng
            </p>
            <p className="flex items-center gap-2">
              <Phone size={16} className="text-primary" /> +234 800 000 0000
            </p>
            <p className="flex items-center gap-2">
              <MapPin size={16} className="text-primary" /> OAU Campus, Ile-Ife
            </p>
          </div>

          <p className="text-xs text-gray-500 mt-4 leading-relaxed">
            For partnerships, sponsorships, or donations, use the support card.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 lg:col-span-2">
          <h3 className="font-semibold mb-4 md:text-2xl">Send us a message</h3>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <InputField
                          label="Full Name"
                          type="text"
                          placeholder="Full name"
                          value={form.name}
                          required
                          onChange={(val) => updateField("name", val)}
                        />

                        <InputField
                          label="Email"
                          type="email"
                          placeholder="Email address"
                          value={form.email}
                          required
                          onChange={(val) => updateField("email", val)}
                        />
            

            

            <textarea
              rows={5}
              placeholder="Your message"
              value={form.message}
              required
              onChange={(e) => updateField("message", e.target.value)}
              className="sm:col-span-2 rounded-lg px-4 py-3 bg-[#FAFAFA] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />

            <div className="sm:col-span-2">
              <button
                type="submit"
                className="bg-primary text-white px-8 py-3 rounded-full font-medium hover:opacity-90 transition"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Support */}
      <section className="w-[92%] sm:w-[90%] md:w-[80%] mx-auto mb-14">
        <div className="bg-gradient-to-r from-primary to-[#a10f24] text-white rounded-2xl p-6 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <HeartHandshake size={40} className="shrink-0" />
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-1">
              Support the Alumni Community
            </h2>
            <p className="text-white/90 max-w-2xl">
              Your donations and sponsorships help fund mentorship programs,
              student support initiatives, and alumni-led projects.
            </p>
          </div>
          <Link href={"/donate"} className="mt-3 sm:mt-0 sm:ml-auto bg-white text-primary px-6 py-2.5 rounded-full font-medium hover:opacity-90 transition">
            Donate / Sponsor
          </Link>
        </div>
      </section>

      {/* Executives */}
      <section className="w-[92%] sm:w-[90%] md:w-[80%] mx-auto">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center">
          Alumni Association Executives
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {EXECUTIVES.map((exco) => (
            <div
              key={exco.id}
              className="bg-white rounded-xl p-4 text-center border border-gray-100 hover:shadow-md transition"
            >
              <div className="relative mx-auto w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-3">
                <Image
                  unoptimized
                  src={
                    exco.image ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                      exco.name
                    )}`
                  }
                  alt={exco.name}
                  fill
                  className="object-cover"
                />
              </div>

              <p className="font-medium text-sm sm:text-base">{exco.name}</p>
              <p className="text-xs sm:text-sm text-gray-500">{exco.role}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
