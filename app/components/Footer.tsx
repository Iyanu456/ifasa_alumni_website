import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0f0f0f] text-gray-300 mb-0 mt-auto">
      <div className="w-[92%] sm:w-[90%] md:w-[80%] mx-auto py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-3">
            Ife Architecture Alumni
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Connecting alumni of the Department of Architecture, Obafemi Awolowo
            University. Stay connected, give back, and grow together.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-medium mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-white transition">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white transition">
                About
              </Link>
            </li>
            <li>
              <Link href="/events" className="hover:text-white transition">
                Events
              </Link>
            </li>
            <li>
              <Link href="/community" className="hover:text-white transition">
                Community
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-white transition">
                Join Alumni
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-medium mb-3">Contact</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-center gap-2">
              <Mail size={16} /> alumni.ife@oau.edu.ng
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} /> +234 800 000 0000
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={16} /> OAU Campus, Ile-Ife, Nigeria
            </li>
          </ul>
        </div>

        {/* CTA */}
        <div>
          <h4 className="text-white font-medium mb-3">Get Involved</h4>
          <p className="text-sm text-gray-400 mb-4">
            Join the alumni network to receive updates about events, mentorship
            opportunities, and initiatives.
          </p>
          <Link
            href="/register"
            className="inline-block bg-primary text-white px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition"
          >
            Join Now
          </Link>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="w-[92%] sm:w-[90%] md:w-[80%] mx-auto py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <p>
            © {new Date().getFullYear()} Ife Architecture Alumni Association. All
            rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white transition">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white transition">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
