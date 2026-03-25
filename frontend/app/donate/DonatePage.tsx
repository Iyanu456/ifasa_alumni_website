"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Building2,
  GraduationCap,
  HeartHandshake,
  Wrench,
  Copy,
  Check,
  Mail,
  Phone,
} from "lucide-react";
import { useDonationSummaryQuery, usePublicSettingsQuery } from "../apiServices/queries";

const impactCards = [
  {
    title: "Student Support",
    description: "Scholarships, studio materials, and learning resources.",
    icon: GraduationCap,
  },
  {
    title: "Studio Improvements",
    description: "Equipment upgrades and workspace enhancements.",
    icon: Building2,
  },
  {
    title: "Events & Workshops",
    description: "Funding alumni events, talks, and professional workshops.",
    icon: Wrench,
  },
  {
    title: "Mentorship Programs",
    description: "Supporting mentorship initiatives for students and young graduates.",
    icon: HeartHandshake,
  },
];

export default function DonatePage() {
  const settingsQuery = usePublicSettingsQuery();
  const summaryQuery = useDonationSummaryQuery();

  const settings = settingsQuery.data?.data.settings;

  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = async (value: string, field: string) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const renderCopyButton = (value: string, field: string) => (
    <button
      onClick={() => handleCopy(value, field)}
      className="ml-2 inline-flex items-center gap-1 text-xs text-primary hover:underline"
    >
      {copiedField === field ? <Check size={14} /> : <Copy size={14} />}
      {copiedField === field ? "Copied" : "Copy"}
    </button>
  );

  return (
    <main className="min-h-screen bg-[#f8f8f8] pt-[6em] pb-[5em]">
      {/* Header */}
      <section className="mx-auto mb-14 w-[92%] text-center sm:w-[90%] md:w-[80%]">
        <h1 className="mb-3 text-2xl font-semibold sm:text-3xl md:text-4xl">
          Support the Alumni Community
        </h1>
        <p className="mx-auto max-w-2xl text-gray-600">
          Your contribution helps empower students, improve facilities, and strengthen
          the Ife Architecture Alumni network.
        </p>
      </section>

      {/* Impact */}
      <section className="mx-auto mb-16 grid w-[92%] gap-6 sm:w-[90%] md:w-[80%] sm:grid-cols-2 md:grid-cols-4">
        {impactCards.map(({ title, description, icon: Icon }) => (
          <div
            key={title}
            className="rounded-2xl border border-gray-100 bg-white p-6 text-center"
          >
            <Icon className="mx-auto mb-3 text-primary" />
            <h3 className="mb-1 font-medium">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        ))}
      </section>

      {/* Bank Details */}
      <section className="mx-auto mb-12 w-[92%] rounded-2xl border border-gray-100 bg-white p-6 sm:w-[90%] md:w-[80%]">
        <h2 className="text-lg font-semibold">Direct Bank Donation</h2>
        <p className="mt-2 text-sm text-gray-600">
          Make a direct transfer using the details below. Kindly include your name as reference.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs uppercase text-gray-500">Account Number</p>
            <div className="mt-1 flex items-center justify-between">
              <p className="text-lg font-semibold">
                {settings?.donationAccountNumber || "Not configured"}
              </p>
              {settings?.donationAccountNumber &&
                renderCopyButton(settings.donationAccountNumber, "account")}
            </div>
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs uppercase text-gray-500">Bank Name</p>
            <div className="mt-1 flex items-center justify-between">
              <p className="text-lg font-semibold">
                {settings?.donationBankName || "Not configured"}
              </p>
              {settings?.donationBankName &&
                renderCopyButton(settings.donationBankName, "bank")}
            </div>
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs uppercase text-gray-500">Account Name</p>
            <div className="mt-1 flex items-center justify-between">
              <p className="text-lg font-semibold">
                {settings?.accountName || "Not configured"}
              </p>
              {settings?.accountName &&
                renderCopyButton(settings.accountName, "name")}
            </div>
          </div>
        </div>
      </section>

      {/* Sponsorship CTA */}
      {/* Sponsorship CTA */}
<section className="mx-auto mb-16 w-[92%] rounded-2xl border border-gray-100 bg-white p-6 sm:w-[90%] md:w-[80%]">
  <h2 className="text-lg font-semibold">Become a Sponsor / Partner</h2>
  <p className="mt-2 text-sm text-gray-600 max-w-2xl">
    Interested in sponsoring programs, events, or infrastructure? Reach out to the alumni
    team directly to discuss partnership opportunities.
  </p>

  {/* Contact Cards */}
  <div className="mt-5 grid gap-4 sm:grid-cols-2">
    {/* Email */}
    {settings?.contactEmail && (
      <div className="rounded-xl bg-gray-50 p-4">
        <p className="text-xs uppercase tracking-wide text-gray-500">Email</p>
        <div className="mt-1 flex items-center justify-between">
          <p className="text-sm font-medium break-all">
            {settings.contactEmail}
          </p>
          <button
            onClick={() => handleCopy(settings.contactEmail, "email")}
            className="ml-2 inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            {copiedField === "email" ? <Check size={14} /> : <Copy size={14} />}
            {copiedField === "email" ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
    )}

    {/* Phone */}
    {settings?.contactPhone && (
      <div className="rounded-xl bg-gray-50 p-4">
        <p className="text-xs uppercase tracking-wide text-gray-500">Phone</p>
        <div className="mt-1 flex items-center justify-between">
          <p className="text-sm font-medium">
            {settings.contactPhone}
          </p>
          <button
            onClick={() => handleCopy(settings.contactPhone, "phone")}
            className="ml-2 inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            {copiedField === "phone" ? <Check size={14} /> : <Copy size={14} />}
            {copiedField === "phone" ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
    )}
  </div>

  {/* Action Buttons */}
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
</section>

      {/* Footer CTA */}
      <section className="w-full border-t border-gray-100 bg-white py-12 text-center">
        <p className="text-sm text-gray-600">
          Every contribution makes a lasting impact on the next generation of architects.
        </p>
        <Link
          href="/contact"
          className="mt-3 inline-block font-medium text-primary hover:underline"
        >
          Have questions? Contact us →
        </Link>
      </section>
    </main>
  );
}