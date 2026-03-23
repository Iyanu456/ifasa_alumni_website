"use client";

import Link from "next/link";
import {
  Briefcase,
  Calendar,
  DollarSign,
  Newspaper,
  Plus,
  Users,
} from "lucide-react";
import { useAdminDashboardQuery } from "../../apiServices/queries";
import { formatCurrency, formatDate, formatRelativeTime } from "../../lib/formatters";

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-5 transition hover:shadow-sm">
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <h2 className="text-xl font-semibold">{value}</h2>
      </div>

      <div className="rounded-lg bg-primary/10 p-3 text-primary">
        <Icon size={20} />
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const dashboardQuery = useAdminDashboardQuery();
  const dashboard = dashboardQuery.data?.data;

  if (dashboardQuery.isLoading) {
    return (
      <section className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
        Loading dashboard data...
      </section>
    );
  }

  if (dashboardQuery.error || !dashboard) {
    return (
      <section className="rounded-2xl border border-dashed border-red-200 bg-red-50 p-10 text-center text-sm text-red-600">
        We could not load the admin dashboard right now.
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">
            Manage alumni, events, donations, and opportunities from one place.
          </p>
        </div>

        <div className="mt-4 flex gap-3 md:mt-0">
          <Link
            href="/admin?tab=events"
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-white hover:opacity-90"
          >
            <Plus size={16} />
            Add Event
          </Link>

          <Link
            href="/admin?tab=opportunities"
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50"
          >
            <Plus size={16} />
            Add Opportunity
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Registered Alumni"
          value={dashboard.metrics.registeredAlumni.toLocaleString()}
          icon={Users}
        />
        <StatCard
          label="Upcoming Events"
          value={dashboard.metrics.upcomingEvents.toLocaleString()}
          icon={Calendar}
        />
        <StatCard
          label="Active Opportunities"
          value={dashboard.metrics.activeOpportunities.toLocaleString()}
          icon={Briefcase}
        />
        <StatCard
          label="Donations Received"
          value={formatCurrency(dashboard.metrics.donationsReceived)}
          icon={DollarSign}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-100 bg-white p-6">
          <h2 className="mb-4 font-semibold">Recent Activity</h2>

          {dashboard.recentActivities.length === 0 ? (
            <p className="text-sm text-gray-500">No activity logged yet.</p>
          ) : (
            <div className="space-y-4 text-sm">
              {dashboard.recentActivities.map((activity, index) => (
                <div key={`${activity.action}-${activity.createdAt || index}`} className="flex justify-between gap-4">
                  <p>
                    <span className="font-medium">
                      {activity.targetName || activity.entityType}
                    </span>
                    {activity.description ? ` - ${activity.description}` : ""}
                  </p>
                  <span className="shrink-0 text-gray-400">
                    {formatRelativeTime(activity.createdAt) || "recently"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-6">
          <h2 className="mb-4 font-semibold">Quick Actions</h2>

          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/admin?tab=events"
              className="rounded-lg border border-gray-100 p-4 transition hover:bg-gray-50"
            >
              <Calendar size={20} className="mb-2 text-primary" />
              <p className="text-sm font-medium">Create Event</p>
            </Link>

            <Link
              href="/admin?tab=opportunities"
              className="rounded-lg border border-gray-100 p-4 transition hover:bg-gray-50"
            >
              <Briefcase size={20} className="mb-2 text-primary" />
              <p className="text-sm font-medium">Post Opportunity</p>
            </Link>

            <Link
              href="/admin?tab=news"
              className="rounded-lg border border-gray-100 p-4 transition hover:bg-gray-50"
            >
              <Newspaper size={20} className="mb-2 text-primary" />
              <p className="text-sm font-medium">Publish News</p>
            </Link>

            <Link
              href="/admin?tab=gallery"
              className="rounded-lg border border-gray-100 p-4 transition hover:bg-gray-50"
            >
              <Users size={20} className="mb-2 text-primary" />
              <p className="text-sm font-medium">Upload Gallery</p>
            </Link>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">Latest Opportunities</h2>

          <Link
            href="/admin?tab=opportunities"
            className="text-sm text-primary hover:underline"
          >
            View all
          </Link>
        </div>

        {dashboard.latestOpportunities.length === 0 ? (
          <p className="text-sm text-gray-500">No opportunities yet.</p>
        ) : (
          <div className="space-y-3 text-sm">
            {dashboard.latestOpportunities.map((opportunity, index) => (
              <div
                key={`${opportunity._id || opportunity.title}-${index}`}
                className="flex justify-between border-b border-gray-100 pb-2 last:border-b-0"
              >
                <p>
                  {opportunity.title}
                  {opportunity.organization ? ` - ${opportunity.organization}` : ""}
                </p>
                <span className="text-gray-400">
                  {opportunity.deadline ? formatDate(opportunity.deadline) : "Open"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
