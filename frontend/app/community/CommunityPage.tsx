"use client";

import { useMemo, useState } from "react";
import AlumniCard from "./components/AlumniCard";
import CustomSelect from "../components/CustomSelect";

type Alumni = {
  id: number;
  name: string;
  role: string;
  location: string;
  graduationYear: string;
  specialization: string;
  image?: string;
};

const ALUMNI_DATA: Alumni[] = [
  {
    id: 1,
    name: "Tunde Adebayo",
    role: "Senior Architect",
    location: "Lagos, Nigeria",
    graduationYear: "2015",
    specialization: "Urban Design",
    image: "https://picsum.photos/seed/tunde/300/300",
  },
  {
    id: 2,
    name: "Funke Oladipo",
    role: "Urban Designer",
    location: "London, UK",
    graduationYear: "2017",
    specialization: "Sustainable Architecture",
    image: "https://picsum.photos/seed/funke/300/300",
  },
  {
    id: 3,
    name: "Ibrahim Musa",
    role: "Project Manager",
    location: "Abuja, Nigeria",
    graduationYear: "2012",
    specialization: "Construction Management",
  },
  {
    id: 4,
    name: "Aisha Bello",
    role: "Interior Designer",
    location: "Toronto, Canada",
    graduationYear: "2020",
    specialization: "Interior Architecture",
    image: "https://picsum.photos/seed/aisha/300/300",
  },
  {
    id: 5,
    name: "Kunle Ade",
    role: "Design Lead",
    location: "Berlin, Germany",
    graduationYear: "2014",
    specialization: "Digital Fabrication",
    image: "https://picsum.photos/seed/kunle/300/300",
  },
];

function generateGraduationYears(startYear = 1960) {
  const currentYear = new Date().getFullYear();
  const years: string[] = ["All"];
  for (let y = currentYear; y >= startYear; y--) years.push(String(y));
  return years;
}

export default function CommunityPage() {
  const [query, setQuery] = useState("");
  const [yearFilter, setYearFilter] = useState("All");

  const yearOptions = generateGraduationYears(1960);

  const filteredAlumni = useMemo(() => {
    return ALUMNI_DATA.filter((a) => {
      const matchesQuery =
        a.name.toLowerCase().includes(query.toLowerCase()) ||
        a.role.toLowerCase().includes(query.toLowerCase()) ||
        a.location.toLowerCase().includes(query.toLowerCase());

      const matchesYear =
        yearFilter === "All" ? true : a.graduationYear === yearFilter;

      return matchesQuery && matchesYear;
    });
  }, [query, yearFilter]);

  const hasNoData = ALUMNI_DATA.length === 0;
  const hasNoResults = ALUMNI_DATA.length > 0 && filteredAlumni.length === 0;

  return (
    <main className="bg-[#f8f8f8] min-h-screen pt-[3em] md:pt-[6em] pb-[4em]">
      {/* Header */}
      <section className="w-[92%] sm:w-[90%] md:w-[80%] mx-auto mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-2">
          Alumni Community
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Discover and connect with fellow Ife Architecture alumni across the
          world.
        </p>
      </section>

      {/* Filters */}
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
        placeholder="Graduation Year"
          options={yearOptions}
          onChange={(val) => setYearFilter(val)}
        />

        <div className="text-sm text-gray-500 self-center">
          Showing {filteredAlumni.length} alumni
        </div>
      </section>

      {/* States */}
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

      {/* Alumni Grid */}
      {!hasNoData && !hasNoResults && (
        <section className="w-[92%] sm:w-[90%] md:w-[80%] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredAlumni.map((alumnus) => (
            <AlumniCard key={alumnus.id} alumnus={alumnus} />
          ))}
        </section>
      )}
    </main>
  );
}
