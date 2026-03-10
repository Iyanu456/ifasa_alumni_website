"use client";

import AdminSidebar from "./components/AdminSidebar";
import AlumniTab from "./adminTabs/AlumniTab";
import DashboardTab from "./adminTabs/DashboardTab";
import EventsTab from "./adminTabs/EventsTab";
import GalleryTab from "./adminTabs/GalleryTab";
import NewsTab from "./adminTabs/NewsTab";
import OpportunitiesTab from "./adminTabs/OpportunitiesTab";
import DonationsTab from "./adminTabs/DonationsTab";
import SettingsTab from "./adminTabs/SettingsTab";

import { useSearchParams } from "next/navigation";

export default function AdminPage() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "dashboard";

  switch (tab) {
    case "alumni":
      return (
      <div className="h-[89vh] md:mt-[-2em]">
        <div className="max-md:-translate-x-full duration-100 transition ease-in block fixed top-[-1em] z-[2000]">
          <AdminSidebar />  
        </div>
        <div className="grid md:pl-[16em] pr-5 pb-[2em] max-md:p-3.5 ">
          <AlumniTab />
        </div>
        
      </div>);

    case "events":
      return (
      <div className="h-[89vh] md:mt-[-2em]">
        <div className="max-md:-translate-x-full duration-100 transition ease-in  block fixed top-[-1em] z-[2000]">
          <AdminSidebar />  
        </div>
        <div className="grid md:pl-[16em] pr-5 pb-[2em] max-md:p-3.5 "><EventsTab /></div>
      
      </div>);

    case "opportunities":
      return (
      <div className="h-[89vh] md:mt-[-2em]">
        <div className="max-md:-translate-x-full duration-100 transition ease-in  block fixed top-[-1em] z-[2000]">
          <AdminSidebar />  
        </div>
        <div className="grid md:pl-[16em] pr-5 pb-[2em] max-md:p-3.5 "><OpportunitiesTab /></div>
      </div>);

    case "news":
      return (
      <div className="h-[89vh] md:mt-[-2em] overflow-y-hidden">
        <div className="max-md:-translate-x-full duration-100 transition ease-in  fixed top-[-1em] z-[2000]">
          <AdminSidebar />  
        </div>
        <div className="grid md:pl-[16em] pr-5 pb-[2em] max-md:p-3.5 ">
          <NewsTab />
        </div>
        
      </div>);

    case "gallery":
      return (
      <div className="h-[89vh] md:mt-[-2em] overflow-y-hidden">
        <div className="max-md:-translate-x-full duration-100 transition ease-in  block fixed top-[-1em] z-[2000]">
          <AdminSidebar />  
        </div>
        <div className="grid md:pl-[16em] pr-5 pb-[2em] max-md:p-3.5 ">
          <GalleryTab />
        </div>
        
      </div>);

    case "donations":
      return (
      <div className="h-[89vh] md:mt-[-2em]">
        <div className="max-md:-translate-x-full duration-100 transition ease-in block fixed top-[-1em] z-[2000]">
          <AdminSidebar />  
        </div>
        <div className="grid md:pl-[16em] pr-5 pb-[2em] max-md:p-3.5 ">
          <DonationsTab />
        </div>
        
      </div>);


    case "settings":
      return (
      <div className="h-[89vh] md:mt-[-2em]">
        <div className="max-md:-translate-x-full duration-100 transition ease-in block fixed top-[-1em] z-[2000]">
          <AdminSidebar />  
        </div>
        <div className="grid md:pl-[16em] pr-5 pb-[2em] max-md:p-3.5  ">
          <SettingsTab />
        </div>
      </div>);






    default:
      return (
      <div className="h-[89vh] md:mt-[-2em]">
        <div className="max-md:-translate-x-full duration-100 transition ease-in block fixed top-[-1em] z-[2000] ">
          <AdminSidebar />  
        </div>
        
        <div className="grid md:pl-[16em] pr-5 pb-[2em] max-md:p-4 ">
          <DashboardTab />
        </div>
        
      </div>);
  }
}