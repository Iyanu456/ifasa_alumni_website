"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";

import {
  LayoutDashboard,
  Users,
  Calendar,
  Briefcase,
  Newspaper,
    Image as ImageIcon,
  DollarSign,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const menu = [
  { label: "Dashboard", icon: LayoutDashboard, tab: "dashboard" },
  { label: "Alumni", icon: Users, tab: "alumni" },
  { label: "Events", icon: Calendar, tab: "events" },
  { label: "Opportunities", icon: Briefcase, tab: "opportunities" },
  { label: "News", icon: Newspaper, tab: "news" },
  { label: "Gallery", icon: ImageIcon, tab: "gallery" },
  { label: "Donations", icon: DollarSign, tab: "donations" },
];

export default function AdminSidebar({ setSidebarClose }: { setSidebarClose?: () => void }) {

  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") || "dashboard";

  return (
    <aside
      className={`h-[105vh] bg-white border-r border-gray-200 flex flex-col transition-all duration-300 w-[240px]`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 mt-4">
        {/*<h2 className="font-semibold text-lg">Admin Panel</h2>*/}

        <Image
                      unoptimized
                      src={"/alumni_logo.png"}
                      alt="ife alumni logo"
                      height={200}
                      width={200}
                      className="max-md:w-[120px] max-md:mt-[0.5em] md:max-w-[120px] md:pt-2 lg:pt-0 lg:max-w-[150px] md:mt-[1.5em]"
                    />

        <button
          onClick={setSidebarClose}
          className="md:hidden block p-2 bg-gray-100 grid place-items-center rounded-md hover:bg-gray-100"
        >
          {<ChevronLeft size={18} />}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex flex-col space-y-1 px-2 mt-[4em] h-[fit-content]">
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.tab;

          return (
            <Link
              key={item.label}
              href={`/admin?tab=${item.tab}`}
              onClick={setSidebarClose}
              className={`flex items-center gap-3 p-3 rounded-lg transition
                ${
                  isActive
                    ? "bg-primary text-white"
                    : "hover:bg-gray-100 text-gray-700"
                }
              `}
            >
              <Icon size={18} />

              
                <span className="text-sm">{item.label}</span>
              
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-gray-100 space-y-2 max-md:mb-[4em] mb-[2em] mt-auto">
        <Link onClick={setSidebarClose} href={`/admin?tab=settings`} className={`flex items-center gap-3 p-3 rounded-lg transition
                ${
                  activeTab === "settings"
                    ? "bg-primary text-white"
                    : "hover:bg-gray-100 text-gray-700"
                }
              `} >
      
          <Settings size={18} />
          <span className="text-sm">Settings</span>
        </Link>

        <button onClick={() => router.push("/")} className="flex items-center gap-3 p-3 w-full rounded-lg hover:bg-gray-100 text-red-500">
          <LogOut size={18} />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}