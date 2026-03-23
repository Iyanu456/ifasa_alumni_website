"use client";

import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { usePathname } from "next/navigation";
import { usePublicSettingsQuery } from "../apiServices/queries";

export default function Footer() {
  const pathname = usePathname();
  const settingsQuery = usePublicSettingsQuery();
  const settings = settingsQuery.data?.data.settings;
  const exactHiddenRoutes = ["/login", "/register", "/email-sent", "/dashboard"];
  const prefixHiddenRoutes = ["/admin", "/verify-email", "/oauth"];

  const shouldHideFooter =
    exactHiddenRoutes.includes(pathname) ||
    prefixHiddenRoutes.some((route) => pathname.startsWith(route));

  if (shouldHideFooter) {
    return null;
  }

  const socialEntries = Object.entries(settings?.socialLinks || {}).filter(
    ([, value]) => Boolean(value),
  );

  return (
    <footer className="bg-[#0f0f0f] text-gray-300 mt-auto">
      <div className="w-[92%] sm:w-[90%] md:w-[80%] mx-auto py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white font-semibold text-lg mb-3">
            {settings?.siteName || "Ife Architecture Alumni"}
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            {settings?.footerText ||
              "Connecting alumni of the Department of Architecture, Obafemi Awolowo University."}
          </p>
        </div>

        <div>
          <h4 className="text-white font-medium mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-white transition">Home</Link></li>
            <li><Link href="/about" className="hover:text-white transition">About</Link></li>
            <li><Link href="/events" className="hover:text-white transition">Events</Link></li>
            <li><Link href="/community" className="hover:text-white transition">Community</Link></li>
            <li><Link href="/news" className="hover:text-white transition">News</Link></li>
            <li><Link href="/donate" className="hover:text-white transition">Donate</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-medium mb-3">Contact</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-center gap-2">
              <Mail size={16} /> {settings?.contactEmail || "alumni.ife@oau.edu.ng"}
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} /> {settings?.contactPhone || "+234 800 000 0000"}
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={16} /> {settings?.contactAddress || "OAU Campus, Ile-Ife, Nigeria"}
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-medium mb-3">Get Involved</h4>
          <p className="text-sm text-gray-400 mb-4">
            Join the alumni network to receive updates about events, mentorship
            opportunities, and initiatives.
          </p>
          {socialEntries.length ? (
            <div className="mb-4 flex flex-wrap gap-3 text-sm">
              {socialEntries.map(([platform, value]) => (
                <a
                  key={platform}
                  href={String(value)}
                  target="_blank"
                  rel="noreferrer"
                  className="capitalize text-gray-300 transition hover:text-white"
                >
                  {platform}
                </a>
              ))}
            </div>
          ) : null}
          <Link
            href="/register"
            className="inline-block bg-primary text-white px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition"
          >
            Join Now
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="w-[92%] sm:w-[90%] md:w-[80%] mx-auto py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <p>
            © {new Date().getFullYear()} {settings?.siteName || "Ife Architecture Alumni Association"}. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
