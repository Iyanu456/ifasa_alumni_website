"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import AdminSidebar from "../admin/components/AdminSidebar";
import { useStore } from "../lib/store";

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
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminLogin = pathname === "/admin/login";
  const { user } = useStore();
  

  const mobileNavLinks = [
  { label: "Home", href: "/", type: "public" },
  { label: "Events", href: "/events", type: "public" },
  { label: "Community", href: "/community", type: "public" },
  { label: "Gallery", href: "/gallery", type: "public" },
  { label: "Contact us", href: "/contact", type: "public" },

  // guest-only (hide when logged in)
  { label: "Register", href: "/register", type: "guest" },

  // protected (show only when logged in)
  { label: "Profile", href: "/dashboard", type: "protected" },
];
  

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    if (isAdminRoute) return; // Don't apply scroll behavior on admin routes

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
  }, [isAdminRoute, lastScrollY]);

  return (
    <>
      {/* HEADER */}
      <div
        className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 bg-white border-b border-gray-300 ${
          hidden && !isMenuOpen ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="bg-primary h-3 w-full"></div>

        <header className="py-6 flex justify-between items-center w-[90vw] md:max-w-[90vw] lg:max-w-[80vw] mx-auto">
          {/* Logo */}
          {!isAdminLogin && isAdminRoute && (
            <Link href="/">
              <Image
                unoptimized
                loading="eager"
                src={"/alumni_logo.png"}
                alt="ife alumni logo"
                height={200}
              width={200}
              className="max-md:w-[150px] md:max-w-[150px] md:pt-2 lg:pt-0 lg:max-w-[180px] lg:hidden"
            />
          </Link>)}

          {!isAdminRoute && !isAdminLogin && (
            <Link href="/">
              <Image
                unoptimized
                src={"/alumni_logo.png"}
                alt="ife alumni logo"
                height={200}
              width={200}
              className="max-md:w-[150px] md:max-w-[150px] md:pt-2 lg:pt-0 lg:max-w-[180px]"
            />
          </Link>)}

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-[2em] font-medium">
            {!isAdminRoute && <NavLink href="/" label="Home" />}
            {!isAdminRoute && <NavLink href="/events" label="Events" />}
            {!isAdminRoute && <NavLink href="/community" label="Community" />}
            {!isAdminRoute && <NavLink href="/gallery" label="Gallery" />}
            {!isAdminRoute && user?.role !== "admin" && <NavLink href="/contact" label="Contact us" />}
            {user?.email && <NavLink href="/dashboard" label="profile" />}
            {user?.role==="admin" && <NavLink href="/admin" label="admin" />}
          </div>

          {/* Mobile Toggle */}
          {!isAdminLogin && (
            <div className="block md:hidden max-md:mr-0 max-md:ml-auto">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          )}
        </header>
      </div>

      {/* MOBILE OVERLAY */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* MOBILE MENU */}

      {/* SIDEBAR OVERLAY */}
      {isMenuOpen && (
        <div
          className="md:hidden max-md:block fixed inset-0 bg-black/30 z-50"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
      
      
      {isAdminRoute && (
        <aside
          className={`md:hidden fixed top-0 left-0 h-screen w-[260px] z-50 max-md:flex flex-col transition-transform duration-300 ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Sidebar Header */}
       

          {/*<button onClick={() => setIsSidebarOpen(false)}>
            <X size={18} />
          </button>*/}
    

        {/* Sidebar Nav */}
        <AdminSidebar setSidebarClose={() => setIsMenuOpen(false)}/>

     
      </aside> )}

      {isMenuOpen && !isAdminRoute &&
      
      (
        <div className="fixed right-5 top-[6.5rem] z-50 bg-white shadow-lg rounded-lg border border-gray-100 px-5 py-6 flex flex-col space-y-3 font-medium md:hidden transition-all duration-300 min-w-[10em]">

  {mobileNavLinks
  .filter((link) => {
    if (link.type === "guest") return !user?.email;
    if (link.type === "protected") return user?.email;
    return true; // public
  })
  .map((link) => {
    const isActive = pathname === link.href;

    return (
      <Link
        key={link.href}
        href={link.href}
        onClick={() => setIsMenuOpen(false)}
        className={`p-2.5 rounded-lg transition ${
          isActive
            ? "bg-primary px-3 py-3  text-white"
            : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        {link.label}
      </Link>
    );
  })}
</div>
      ) }

      

      
    </>
  );
}
