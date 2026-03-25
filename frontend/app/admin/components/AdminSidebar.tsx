"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Calendar,
  ChevronLeft,
  Contact,
  DollarSign,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Briefcase,
  Newspaper,
  Settings,
  Users,
} from "lucide-react";
import { useStore } from "@/app/lib/store";

const menu = [
  { label: "Dashboard", icon: LayoutDashboard, tab: "dashboard" },
  { label: "Alumni", icon: Users, tab: "alumni" },
  { label: "Events", icon: Calendar, tab: "events" },
  { label: "Executives", icon: Contact, tab: "executives" },
  { label: "Opportunities", icon: Briefcase, tab: "opportunities" },
  { label: "News", icon: Newspaper, tab: "news" },
  { label: "Gallery", icon: ImageIcon, tab: "gallery" },
  //{ label: "Donations", icon: DollarSign, tab: "donations" },
];

export default function AdminSidebar({
  setSidebarClose,
}: {
  setSidebarClose: () => void;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") || "dashboard";
  const logout = useStore((state) => state.logout);

  const handleLogout = () => {
    setSidebarClose();
    logout();
    router.push("/admin/login");
  };

  return (
    <aside className="flex h-[105vh] w-[240px] flex-col border-r border-gray-200 bg-white transition-all duration-300">
      <div className="mt-4 flex items-center justify-between p-4">
        <Image
          unoptimized
          src="/alumni_logo.png"
          alt="ife alumni logo"
          height={200}
          width={200}
          className="max-md:mt-[0.5em] max-md:w-[120px] md:mt-[1.5em] md:max-w-[120px] md:pt-2 lg:max-w-[150px] lg:pt-0"
        />

        <button
          onClick={setSidebarClose}
          className="grid place-items-center rounded-md bg-gray-100 p-2 hover:bg-gray-100 md:hidden"
        >
          <ChevronLeft size={18} />
        </button>
      </div>

      <nav className="mt-[4em] flex h-[fit-content] flex-col space-y-1 px-2">
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.tab;

          return (
            <Link
              key={item.label}
              href={`/admin?tab=${item.tab}`}
              onClick={setSidebarClose}
              className={`flex items-center gap-3 rounded-lg p-3 transition ${
                isActive
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon size={18} />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto mb-[2em] space-y-2 border-t border-gray-100 p-3 max-md:mb-[4em]">
        <Link
          onClick={setSidebarClose}
          href="/admin?tab=settings"
          className={`flex items-center gap-3 rounded-lg p-3 transition ${
            activeTab === "settings"
              ? "bg-primary text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <Settings size={18} />
          <span className="text-sm">Settings</span>
        </Link>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg p-3 text-red-500 hover:bg-gray-100"
        >
          <LogOut size={18} />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}
