"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Building, Calendar, MapPin } from "lucide-react";
import { useOpportunityQuery } from "../../apiServices/queries";
import { formatDate } from "../../lib/formatters";

export default function OpportunityDetailsPage() {
  const params = useParams<{ id: string }>();
  const identifier = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const opportunityQuery = useOpportunityQuery(identifier);
  const opportunity = opportunityQuery.data?.data.opportunity;

  return (
    <main className="min-h-screen pt-[6em] pb-[4em]">
      <section className="mx-auto w-[92%] sm:w-[90%] md:w-[70%]">
        {opportunityQuery.isLoading ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
            Loading opportunity details...
          </div>
        ) : opportunityQuery.error || !opportunity ? (
          <div className="rounded-2xl border border-dashed border-red-200 bg-red-50 p-10 text-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Opportunity not found
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              The opportunity you&apos;re looking for may have expired or is no
              longer available.
            </p>
            <Link
              href="/opportunities"
              className="mt-5 inline-block rounded-full bg-primary px-6 py-3 font-medium text-white"
            >
              Back to opportunities
            </Link>
          </div>
        ) : (
          <>
            {opportunity.coverImageUrl ? (
              <div className="relative mb-6 h-[250px] w-full overflow-hidden rounded-xl sm:h-[320px] md:h-[380px]">
                <Image
                  src={opportunity.coverImageUrl}
                  alt={opportunity.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : null}

            <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
              {opportunity.category}
            </span>

            <h1 className="mt-2 mb-2 text-2xl font-semibold sm:text-3xl">
              {opportunity.title}
            </h1>

            <div className="mb-4 flex flex-wrap gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Building size={16} /> {opportunity.organization}
              </span>

              {opportunity.location ? (
                <span className="flex items-center gap-1">
                  <MapPin size={16} /> {opportunity.location}
                </span>
              ) : null}

              {opportunity.deadline ? (
                <span className="flex items-center gap-1">
                  <Calendar size={16} /> Deadline: {formatDate(opportunity.deadline)}
                </span>
              ) : null}
            </div>

            <hr className="border-gray-300 md:mt-[4em]" />

            <div className="py-6 mb-6">
              <h2 className="mb-2.5 text-lg font-semibold md:text-xl">Description</h2>
              <p className="whitespace-pre-line leading-relaxed text-gray-600">
                {opportunity.description}
              </p>
            </div>

            {opportunity.requirements?.length ? (
              <>
                <hr className="border-gray-300" />

                <div className="py-6 mb-6">
                  <h2 className="mb-2.5 text-lg font-semibold md:text-xl">
                    Requirements
                  </h2>

                  <ul className="list-inside list-disc space-y-2 text-gray-600">
                    {opportunity.requirements.map((requirement) => (
                      <li key={requirement}>{requirement}</li>
                    ))}
                  </ul>
                </div>
              </>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row">
              {opportunity.applicationLink ? (
                <a
                  href={opportunity.applicationLink}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-primary px-6 py-3 text-center font-medium text-white transition hover:opacity-90"
                >
                  Apply Now
                </a>
              ) : null}

              <Link
                href="/opportunities"
                className="rounded-full border border-gray-300 px-6 py-3 text-center font-medium transition hover:bg-gray-50"
              >
                Back to opportunities
              </Link>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
