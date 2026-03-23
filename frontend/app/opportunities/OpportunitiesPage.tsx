"use client";

import { useState } from "react";
import OpportunityCard from "./components/OpportunitiesCard";
import { useOpportunitiesQuery } from "../apiServices/queries";
import { formatDate } from "../lib/formatters";

type Category =
  | "All"
  | "Job"
  | "Scholarship"
  | "Fellowship"
  | "Competition"
  | "Internship"
  | "Grant"
  | "Other";

const CATEGORIES: Category[] = [
  "All",
  "Job",
  "Scholarship",
  "Fellowship",
  "Competition",
  "Internship",
  "Grant",
  "Other",
];

export default function OpportunitiesPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const opportunitiesQuery = useOpportunitiesQuery({
    category: activeCategory,
    limit: 60,
    sort: "deadline",
    order: "asc",
  });

  const opportunities = opportunitiesQuery.data?.data ?? [];

  return (
    <main className="bg-[#f7f7f7] min-h-screen pt-[6em] pb-[4em]">
      <section className="w-[92%] sm:w-[90%] md:w-[80%] mx-auto mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-2">
          Opportunities
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Discover scholarships, job openings, fellowships, and other career
          opportunities shared within the alumni network.
        </p>
      </section>

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

      <section className="w-[92%] sm:w-[90%] md:w-[80%] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {opportunitiesQuery.isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-[340px] rounded-xl bg-gray-100 animate-pulse" />
          ))
        ) : opportunitiesQuery.isError ? (
          <div className="col-span-full text-center bg-white border border-gray-100 rounded-xl p-6 text-red-600">
            Unable to load opportunities right now.
          </div>
        ) : opportunities.length === 0 ? (
          <div className="col-span-full text-center bg-white border border-gray-100 rounded-xl p-6 text-gray-500">
            No opportunities found for this category.
          </div>
        ) : (
          opportunities.map((opp) => (
            <OpportunityCard
              key={opp.id}
              title={opp.title}
              organization={opp.organization}
              category={opp.category}
              location={opp.location || undefined}
              deadline={opp.deadline ? formatDate(opp.deadline) : undefined}
              description={opp.description}
              image={opp.coverImageUrl || "https://picsum.photos/seed/opportunity/800/600"}
              link={`/opportunities/${opp.slug || opp.id}`}
            />
          ))
        )}
      </section>
    </main>
  );
}
