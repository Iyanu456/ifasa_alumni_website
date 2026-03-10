"use client";

import {
  Users,
  Calendar,
  Briefcase,
  DollarSign,
  Plus,
  Newspaper,
} from "lucide-react";
import Link from "next/link";

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: any;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 flex items-center justify-between hover:shadow-sm transition">
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <h2 className="text-xl font-semibold">{value}</h2>
      </div>

      <div className="bg-primary/10 p-3 rounded-lg text-primary">
        <Icon size={20} />
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <section className="space-y-8">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-lg md:text-2xl font-semibold">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">
            Manage alumni, events, and opportunities from here.
          </p>
        </div>

        <div className="flex gap-3 mt-4 md:mt-0">
          <Link
            href="/admin?tab=events"
            className="flex items-center gap-2 text-sm bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90"
          >
            <Plus size={16} />
            Add Event
          </Link>

          <Link
            href="/admin?tab=opportunities"
            className="flex items-center gap-2 text-sm border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50"
          >
            <Plus size={16} />
            Add Opportunity
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Registered Alumni" value="1,250" icon={Users} />
        <StatCard label="Upcoming Events" value="6" icon={Calendar} />
        <StatCard label="Active Opportunities" value="14" icon={Briefcase} />
        <StatCard label="Donations Received" value="₦3.4M" icon={DollarSign} />
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Recent Activity */}
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <h2 className="font-semibold mb-4">Recent Activity</h2>

          <div className="space-y-4 text-sm">

            <div className="flex justify-between">
              <p>
                <span className="font-medium">New alumni registration</span> —
                John Adebayo
              </p>
              <span className="text-gray-400">2h ago</span>
            </div>

            <div className="flex justify-between">
              <p>
                <span className="font-medium">New opportunity posted</span> —
                Junior Architect
              </p>
              <span className="text-gray-400">5h ago</span>
            </div>

            <div className="flex justify-between">
              <p>
                <span className="font-medium">Gallery updated</span> — Alumni
                Meetup Photos
              </p>
              <span className="text-gray-400">1d ago</span>
            </div>

          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <h2 className="font-semibold mb-4">Quick Actions</h2>

          <div className="grid grid-cols-2 gap-4">

            <Link
              href="/admin?tab=events"
              className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition"
            >
              <Calendar size={20} className="text-primary mb-2" />
              <p className="text-sm font-medium">Create Event</p>
            </Link>

            <Link
              href="/admin?tab=opportunities"
              className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition"
            >
              <Briefcase size={20} className="text-primary mb-2" />
              <p className="text-sm font-medium">Post Opportunity</p>
            </Link>

            <Link
              href="/admin?tab=news"
              className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition"
            >
              <Newspaper size={20} className="text-primary mb-2" />
              <p className="text-sm font-medium">Publish News</p>
            </Link>

            <Link
              href="/admin?tab=gallery"
              className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition"
            >
              <Users size={20} className="text-primary mb-2" />
              <p className="text-sm font-medium">Upload Gallery</p>
            </Link>

          </div>
        </div>
      </div>

      {/* Recent Opportunities */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold">Latest Opportunities</h2>

          <Link
            href="/admin?tab=opportunities"
            className="text-sm text-primary hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="space-y-3 text-sm">

          <div className="flex justify-between border-b border-gray-100 pb-2">
            <p>Junior Architect — Studio Nexus</p>
            <span className="text-gray-400">Dec 20</span>
          </div>

          <div className="flex justify-between border-b border-gray-100 pb-2">
            <p>Urban Design Fellowship</p>
            <span className="text-gray-400">Jan 10</span>
          </div>

          <div className="flex justify-between">
            <p>Architecture Internship — Abuja</p>
            <span className="text-gray-400">Feb 1</span>
          </div>

        </div>
      </div>
    </section>
  );
}