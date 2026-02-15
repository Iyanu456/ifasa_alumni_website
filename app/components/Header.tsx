"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <div className="flex flex-col gap-1.5 group">
      <Link
        href={href}
        className={`transition duration-200 ease-in ${
          isActive ? "text-primary font-semibold" : "hover:text-primary"
        }`}
      >
        {label}
      </Link>

      <div
        className={`h-[2.5px] rounded-full transition-all duration-300 bg-primary ${
          isActive ? "w-full" : "w-0 group-hover:w-full"
        }`}
      />
    </div>
  );
}

export default function Header() {
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      setLastScrollY(currentScrollY);

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (window.scrollY > 100) setHidden(true);
      }, 2000);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [lastScrollY]);

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 bg-white border border-b-gray-300 ${
          hidden && !isMenuOpen ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="bg-primary h-3 w-screen"></div>

        <header className="py-8 flex justify-between w-[90vw] md:max-w-[80vw] mx-auto ">
          <div>
            <Image
              unoptimized
              src={"/alumni_logo.png"}
              alt="ife alumni logo"
              height={200}
              width={200}
              className="max-md:w-[150px]"
            />
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex gap-[2.5em] font-medium">
            <NavLink href="/" label="Home" />
            <NavLink href="/community" label="Community" />
            <NavLink href="/gallery" label="Gallery" />
            {/*<NavLink href="/register" label="Register" />*/}
             <NavLink href="/contact" label="Contact us" />
          </div>

          {/* Mobile toggle */}
          <div className="block md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </header>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed right-5 top-[6.5rem] z-50 bg-white shadow-lg rounded-lg border border-gray-100 px-8 py-6 flex flex-col space-y-6 font-medium md:hidden transition-all duration-300">
          <Link href="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link href="/community" onClick={() => setIsMenuOpen(false)}>Community</Link>
          <Link href="/gallery" onClick={() => setIsMenuOpen(false)}>Gallery</Link>
          <Link href="/register" onClick={() => setIsMenuOpen(false)}>Register</Link>
          <Link href="/contact" onClick={() => setIsMenuOpen(false)}>Contact us</Link>
        </div>
      )}
    </>
  );
}
