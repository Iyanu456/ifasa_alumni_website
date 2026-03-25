"use client";

import { useEffect } from "react";
import type { ComponentType } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdminSidebar from "./components/AdminSidebar";
import AlumniTab from "./adminTabs/AlumniTab";
import DashboardTab from "./adminTabs/DashboardTab";
import DonationsTab from "./adminTabs/DonationsTab";
import ExecutivesTab from "./adminTabs/ExecutivesTab";
import EventsTab from "./adminTabs/EventsTab";
import GalleryTab from "./adminTabs/GalleryTab";
import NewsTab from "./adminTabs/NewsTab";
import OpportunitiesTab from "./adminTabs/OpportunitiesTab";
import SettingsTab from "./adminTabs/SettingsTab";
import { TokenService } from "../apiServices/token-service";
import { useOwnProfileQuery } from "../apiServices/queries";
import { useStore } from "../lib/store";

const tabComponents: Record<string, ComponentType> = {
  dashboard: DashboardTab,
  alumni: AlumniTab,
  events: EventsTab,
  executives: ExecutivesTab,
  opportunities: OpportunitiesTab,
  news: NewsTab,
  gallery: GalleryTab,
  //donations: DonationsTab,
  settings: SettingsTab,
};

export default function AdminPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = TokenService.getCookie();
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const logout = useStore((state) => state.logout);
  const tab = searchParams.get("tab") || "dashboard";
  const profileQuery = useOwnProfileQuery(Boolean(token));
  const ActiveTab = tabComponents[tab] || DashboardTab;
  const closeSidebar = () => undefined;

  useEffect(() => {
    if (!token) {
      router.replace("/admin/login");
    }
  }, [router, token]);

  useEffect(() => {
    const fetchedUser = profileQuery.data?.data.user;

    if (fetchedUser) {
      setUser(fetchedUser);

      if (fetchedUser.role !== "admin") {
        logout();
        router.replace("/admin/login");
      }
    }
  }, [logout, profileQuery.data, router, setUser]);

  useEffect(() => {
    if (profileQuery.error) {
      logout();
      router.replace("/admin/login");
    }
  }, [logout, profileQuery.error, router]);

  if (!token || profileQuery.isLoading || (user && user.role !== "admin")) {
    return (
      <div className="grid min-h-[70vh] place-items-center bg-[#f8f8f8]">
        <p className="text-sm text-gray-500">Loading admin workspace...</p>
      </div>
    );
  }

  return (
    <div className="h-[89vh] md:mt-[-2em]">
      <div className="fixed top-[-1em] z-[2000] block transition duration-100 ease-in max-md:-translate-x-full">
        <AdminSidebar setSidebarClose={closeSidebar} />
      </div>

      <div className="grid pb-[2em] pt-[3em] pr-5 max-md:p-4 md:pl-[16em]">
        <ActiveTab />
      </div>
    </div>
  );
}
