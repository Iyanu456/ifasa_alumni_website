"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HeartHandshake, Mail, Phone } from "lucide-react";
import { useExecutivesQuery, usePublicSettingsQuery } from "../apiServices/queries";
import { buildAvatarFallback } from "../lib/formatters";

export default function ContactPage() {
  const settingsQuery = usePublicSettingsQuery();
  const executivesQuery = useExecutivesQuery();

  const settings = settingsQuery.data?.data.settings;

  const contactError =
    settingsQuery.error || executivesQuery.error
      ? "We could not load all contact details right now."
      : "";

  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = async (value: string, field: string) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const executiveCards = useMemo(
    () =>
      (executivesQuery.data?.data.executives ?? []).slice(0, 8).map((executive) => ({
        id: executive._id,
        name: executive.name,
        role: executive.position || executive.role || "Executive",
        image: executive.profilePicture || buildAvatarFallback(executive.name),
      })),
    [executivesQuery.data],
  );

  return (
    <main className="min-h-screen bg-[#f8f8f8] pt-[3em] pb-[5em] md:pt-[2em]">
      {/* Header */}
      <section className="mx-auto mb-10 w-[92%] sm:w-[90%] md:w-[80%]">
        <h1 className="mb-2 text-2xl font-semibold sm:text-3xl md:text-4xl">
          Let&apos;s Connect
        </h1>
        <p className="max-w-2xl text-gray-600">
          Reach the association directly or connect with alumni executives leading the platform.
        </p>
      </section>

      {/* Contact Card */}
      <section className="mx-auto mb-14 w-[92%] sm:w-[90%] md:w-[80%]">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 md:p-8">
          <h3 className="mb-2 text-lg font-semibold md:text-xl">
            Contact the Alumni Association
          </h3>
          <p className="mb-6 max-w-2xl text-sm text-gray-600">
            Reach out for inquiries, collaborations, or support. You can copy the details
            below or contact us directly.
          </p>

          {settingsQuery.isLoading ? (
            <p className="text-sm text-gray-500">Loading contact information...</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2">
              {/* Email */}
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Email</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <p className="text-sm font-medium break-all">
                    {settings?.contactEmail || ""}
                  </p>
                  <button
                    onClick={() => handleCopy(settings?.contactEmail || "", "email")}
                    className="text-xs text-primary hover:underline"
                  >
                    {copiedField === "email" ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>

              {/* Phone */}
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Phone</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">
                    {settings?.contactPhone || ""}
                  </p>
                  <button
                    onClick={() => handleCopy(settings?.contactPhone || "", "phone")}
                    className="text-xs text-primary hover:underline"
                  >
                    {copiedField === "phone" ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>

              {/* Address */}
              {/*<div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Address</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">
                    {settings?.contactAddress || "OAU Campus, Ile-Ife"}
                  </p>
                  <button
                    onClick={() => handleCopy(settings?.contactAddress || "", "address")}
                    className="text-xs text-primary hover:underline"
                  >
                    {copiedField === "address" ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>*/}
            </div>
          )}

          {/* Quick Actions */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            {settings?.contactEmail && (
              <a
                href={`mailto:${settings.contactEmail}`}
                className="flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm text-white hover:opacity-90"
              >
                <Mail size={16} />
                Send Email
              </a>
            )}

            {settings?.contactPhone && (
              <a
                href={`tel:${settings.contactPhone}`}
                className="flex items-center justify-center gap-2 rounded-full border border-gray-300 px-5 py-2.5 text-sm hover:bg-gray-50"
              >
                <Phone size={16} />
                Call Now
              </a>
            )}
          </div>

          {contactError ? (
            <p className="mt-4 text-xs text-red-500">{contactError}</p>
          ) : null}
        </div>
      </section>

      {/* CTA */}
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

      {/* Executives */}
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

                <p className="text-sm font-medium sm:text-base">
                  {executive.name}
                </p>
                <p className="text-xs text-gray-500 sm:text-sm">
                  {executive.role}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}