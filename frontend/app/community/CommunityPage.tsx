"use client";

import { useMemo, useState } from "react";
import AlumniCard from "./components/AlumniCard";
import CustomSelect from "../components/CustomSelect";
import { usePublicAlumniQuery } from "../apiServices/queries";

function generateGraduationYears(startYear = 1960) {
  const currentYear = new Date().getFullYear();
  const years: string[] = ["All"];
  for (let y = currentYear; y >= startYear; y -= 1) {
    years.push(String(y));
  }
  return years;
}

export default function CommunityPage() {
  const [query, setQuery] = useState("");
  const [yearFilter, setYearFilter] = useState("All");
  const yearOptions = useMemo(() => generateGraduationYears(1960), []);
  const alumniQuery = usePublicAlumniQuery({
    search: query || undefined,
    graduationYear: yearFilter,
    limit: 60,
  });

  const alumni = alumniQuery.data?.data ?? [];
  const totalCount = alumniQuery.data?.meta?.total ?? alumni.length;
  const hasNoData = !alumniQuery.isLoading && !alumni.length && !query && yearFilter === "All";
  const hasNoResults = !alumniQuery.isLoading && !alumni.length && (!!query || yearFilter !== "All");

  return (
    <main className="bg-[#f8f8f8] min-h-screen pt-[3em] md:pt-[6em] pb-[4em]">
      <section className="w-[92%] sm:w-[90%] md:w-[80%] mx-auto mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-2">
          Alumni Community
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Discover and connect with fellow Ife Architecture alumni across the
          world.
        </p>
      </section>

      <section className="w-[92%] sm:w-[90%] md:w-[80%] mx-auto mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input
          type="text"
          placeholder="Search by name, role, or location"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="rounded-lg px-4 py-3 bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 transition "
        />

        <CustomSelect
          className="bg-white"
          placeholder={yearFilter === "All" ? "Graduation Year" : yearFilter}
          options={yearOptions}
          onChange={(val) => setYearFilter(val)}
        />

        <div className="text-sm text-gray-500 self-center">
          {alumniQuery.isLoading ? "Loading alumni..." : `Showing ${alumni.length} of ${totalCount} alumni`}
        </div>
      </section>

      {alumniQuery.isLoading && (
        <section className="w-[92%] sm:w-[90%] md:w-[80%] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-[360px] rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </section>
      )}

      {alumniQuery.isError && (
        <section className="w-[92%] sm:w-[90%] md:w-[80%] mx-auto mt-10 text-center bg-white rounded-2xl p-10 border border-gray-100 text-red-600">
          Unable to load the alumni directory right now.
        </section>
      )}

      {hasNoData && (
        <section className="w-[92%] sm:w-[90%] md:w-[80%] mx-auto mt-10 text-center bg-white rounded-2xl p-10 border border-gray-100">
          <h3 className="text-lg font-medium mb-2">No alumni yet</h3>
          <p className="text-gray-600 mb-4">
            The alumni directory is currently empty. Once alumni register, they
            will appear here.
          </p>
        </section>
      )}

      {hasNoResults && (
        <section className="w-[92%] sm:w-[90%] md:w-[80%] mx-auto mt-10 text-center bg-white rounded-2xl p-10 border border-gray-100">
          <h3 className="text-lg font-medium mb-2">No results found</h3>
          <p className="text-gray-600 mb-4">
            We couldn’t find any alumni matching your search or filters. Try
            adjusting your filters.
          </p>
          <button
            onClick={() => {
              setQuery("");
              setYearFilter("All");
            }}
            className="inline-block bg-primary text-white px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition"
          >
            Clear filters
          </button>
        </section>
      )}

      {!alumniQuery.isLoading && !hasNoData && !hasNoResults && !alumniQuery.isError && (
        <section className="w-[92%] sm:w-[90%] md:w-[80%] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {alumni.map((alumnus) => (
            <AlumniCard key={alumnus._id} alumnus={alumnus} />
          ))}
        </section>
      )}
    </main>
  );
}
