"use client";

import { FormEvent, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HeartHandshake, Mail, MapPin, Phone } from "lucide-react";
import InputField from "../components/InputField";
import { useAppMutations, getApiErrorMessage } from "../apiServices/mutations";
import { useExecutivesQuery, usePublicSettingsQuery } from "../apiServices/queries";
import { buildAvatarFallback } from "../lib/formatters";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const { createContactMutation } = useAppMutations();
  const settingsQuery = usePublicSettingsQuery();
  const executivesQuery = useExecutivesQuery();

  const settings = settingsQuery.data?.data.settings;
  const executives = executivesQuery.data?.data.executives ?? [];

  const contactError =
    settingsQuery.error || executivesQuery.error
      ? "We could not load all contact details right now."
      : "";

  const executiveCards = useMemo(
    () =>
      executives.slice(0, 8).map((executive) => ({
        id: executive.id,
        name: executive.fullName,
        role: executive.associationRoleTitle || executive.currentRole || "Executive",
        image: executive.avatarUrl || buildAvatarFallback(executive.fullName),
      })),
    [executives],
  );

  const updateField = (field: "name" | "email" | "message", value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(false);

    try {
      await createContactMutation.mutateAsync(form);
      setForm({ name: "", email: "", message: "" });
      setSubmitted(true);
    } catch {
      setSubmitted(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f8f8] pt-[3em] pb-[5em] md:pt-[6em]">
      <section className="mx-auto mb-10 w-[92%] sm:w-[90%] md:w-[80%]">
        <h1 className="mb-2 text-2xl font-semibold sm:text-3xl md:text-4xl">
          Let&apos;s Connect
        </h1>
        <p className="max-w-2xl text-gray-600">
          Reach the association directly, send a message to the team, or connect
          with alumni executives leading the platform.
        </p>
      </section>

      <section className="mx-auto mb-14 grid w-[92%] grid-cols-1 gap-6 sm:w-[90%] md:w-[80%] lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <h3 className="mb-4 font-semibold">Contact details</h3>

          {settingsQuery.isLoading ? (
            <p className="text-sm text-gray-500">Loading contact information...</p>
          ) : (
            <div className="space-y-3 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <Mail size={16} className="text-primary" />
                {settings?.contactEmail || "alumni.ife@oau.edu.ng"}
              </p>
              <p className="flex items-center gap-2">
                <Phone size={16} className="text-primary" />
                {settings?.contactPhone || "+234 800 000 0000"}
              </p>
              <p className="flex items-center gap-2">
                <MapPin size={16} className="text-primary" />
                {settings?.contactAddress || "OAU Campus, Ile-Ife"}
              </p>
            </div>
          )}

          <p className="mt-4 text-xs leading-relaxed text-gray-500">
            For partnerships, sponsorships, and donations, use the support card
            below or head to the donations page.
          </p>

          {contactError ? (
            <p className="mt-4 text-xs text-red-500">{contactError}</p>
          ) : null}
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 lg:col-span-2">
          <h3 className="mb-4 font-semibold md:text-2xl">Send us a message</h3>

          <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputField
              label="Full Name"
              type="text"
              placeholder="Full name"
              value={form.name}
              required
              onChange={(value) => updateField("name", value)}
            />

            <InputField
              label="Email"
              type="email"
              placeholder="Email address"
              value={form.email}
              required
              onChange={(value) => updateField("email", value)}
            />

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold">
                Message
                <span className="ml-1 text-primary">*</span>
              </label>
              <textarea
                rows={5}
                placeholder="Your message"
                value={form.message}
                required
                onChange={(event) => updateField("message", event.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-[#FAFAFA] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={createContactMutation.isPending}
                className="rounded-full bg-primary px-8 py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {createContactMutation.isPending ? "Sending..." : "Send Message"}
              </button>
            </div>

            {submitted ? (
              <p className="sm:col-span-2 text-sm text-green-600">
                Your message has been sent successfully.
              </p>
            ) : null}

            {createContactMutation.error ? (
              <p className="sm:col-span-2 text-sm text-red-500">
                {getApiErrorMessage(
                  createContactMutation.error,
                  "We could not send your message. Please try again.",
                )}
              </p>
            ) : null}
          </form>
        </div>
      </section>

      <section className="mx-auto mb-14 w-[92%] sm:w-[90%] md:w-[80%]">
        <div className="flex flex-col items-start gap-4 rounded-2xl bg-gradient-to-r from-primary to-[#a10f24] p-6 text-white sm:flex-row sm:items-center sm:gap-6 sm:p-10">
          <HeartHandshake size={40} className="shrink-0" />
          <div>
            <h2 className="mb-1 text-xl font-semibold sm:text-2xl">
              Support the Alumni Community
            </h2>
            <p className="max-w-2xl text-white/90">
              Donations and sponsorships help fund mentorship programs, student
              support initiatives, and alumni-led projects.
            </p>
          </div>
          <Link
            href="/donate"
            className="mt-3 rounded-full bg-white px-6 py-2.5 font-medium text-primary transition hover:opacity-90 sm:ml-auto sm:mt-0"
          >
            Donate / Sponsor
          </Link>
        </div>
      </section>

      <section className="mx-auto w-[92%] sm:w-[90%] md:w-[80%]">
        <h2 className="mb-6 text-center text-xl font-semibold sm:text-2xl">
          Alumni Association Executives
        </h2>

        {executivesQuery.isLoading ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
            Loading executives...
          </div>
        ) : executiveCards.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
            Executive profiles will appear here once published.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4">
            {executiveCards.map((executive) => (
              <div
                key={executive.id}
                className="rounded-xl border border-gray-100 bg-white p-4 text-center transition hover:shadow-md"
              >
                <div className="relative mx-auto mb-3 h-20 w-20 overflow-hidden rounded-full sm:h-24 sm:w-24">
                  <Image
                    unoptimized
                    src={executive.image}
                    alt={executive.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <p className="text-sm font-medium sm:text-base">{executive.name}</p>
                <p className="text-xs text-gray-500 sm:text-sm">{executive.role}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
