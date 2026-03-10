"use client";

import { useMemo, useState } from "react";
import { Calendar, MapPin, Briefcase, GraduationCap } from "lucide-react";
import OpportunityCard from "./components/OpportunitiesCard";

type Category =
  | "All"
  | "Job"
  | "Scholarship"
  | "Fellowship"
  | "Competition"
  | "Internship";

type Opportunity = {
  id: number;
  title: string;
  organization: string;
  location?: string;
  deadline?: string;
  category: Exclude<Category, "All">;
  description: string;
  image?: string;
  link: string;
};

const OPPORTUNITIES: Opportunity[] = [
  {
    id: 1,
    title: "Junior Architect",
    organization: "Studio Nexus",
    location: "Lagos, Nigeria",
    deadline: "Dec 20, 2026",
    category: "Job",
    description:
      "Architecture firm seeking a junior architect with strong Revit and visualization skills.",
      image: "https://picsum.photos/seed/job/800/600",
    link: "#",
  },
  {
    id: 2,
    title: "Sustainable Design Scholarship",
    organization: "Global Architecture Foundation",
    deadline: "Jan 10, 2027",
    category: "Scholarship",
    description:
      "Scholarship for graduates pursuing postgraduate studies in sustainable architecture.",
    image: "https://picsum.photos/seed/scholarship/800/600",
    link: "#",
  },
  {
    id: 3,
    title: "Urban Futures Fellowship",
    organization: "Urban Innovation Lab",
    deadline: "Feb 5, 2027",
    category: "Fellowship",
    description:
      "International fellowship supporting young professionals researching future cities.",
    image: "https://picsum.photos/seed/fellowship/800/600",
    link: "#",
  },
  {
    id: 4,
    title: "International Architecture Competition",
    organization: "ArchVision",
    deadline: "Mar 15, 2027",
    category: "Competition",
    description:
      "Design competition exploring innovative solutions for resilient coastal cities.",
    image: "https://picsum.photos/seed/competition/800/600",
    link: "#",
  },
  {
    id: 5,
    title: "Architecture Internship",
    organization: "DesignWorks Studio",
    location: "Abuja, Nigeria",
    category: "Internship",
    description:
      "6-month internship opportunity for architecture graduates interested in urban design.",
    image: "https://picsum.photos/seed/internship/800/600",
    link: "#",
  },
];

const CATEGORIES: Category[] = [
  "All",
  "Job",
  "Scholarship",
  "Fellowship",
  "Competition",
  "Internship",
];

export default function OpportunitiesPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const filtered = useMemo(() => {
    if (activeCategory === "All") return OPPORTUNITIES;
    return OPPORTUNITIES.filter((o) => o.category === activeCategory);
  }, [activeCategory]);

  return (
    <main className="bg-[#f7f7f7] min-h-screen pt-[6em] pb-[4em]">
      {/* Header */}
      <section className="w-[92%] sm:w-[90%] md:w-[80%] mx-auto mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-2">
          Opportunities
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Discover scholarships, job openings, fellowships, and other career
          opportunities shared within the alumni network.
        </p>
      </section>

      {/* Filters */}
      <section className="w-[92%] sm:w-[90%] md:w-[80%] mx-auto mb-6 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              activeCategory === cat
                ? "bg-primary text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* Grid */}
      <section className="w-[92%] sm:w-[90%] md:w-[80%] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center bg-white border border-gray-100 rounded-xl p-6 text-gray-500">
            No opportunities found for this category.
          </div>
        ) : (
          filtered.map((opp) => (

    

            <OpportunityCard
    key={opp.id}
    title={opp.title}
    organization={opp.organization}
    category={opp.category}
    location={opp.location}
    deadline={opp.deadline}
    description={opp.description}
    image={opp.image}
    link={`/opportunities/${opp.id}`}
  />
          ))
        )}
      </section>
    </main>
  );
}