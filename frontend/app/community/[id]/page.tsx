"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { usePublicAlumnusQuery } from "../../apiServices/queries";
import { buildAvatarFallback } from "../../lib/formatters";

export default function AlumniDetailPage() {
  const params = useParams<{ id: string }>();
  const identifier = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const alumnusQuery = usePublicAlumnusQuery(identifier);
  const alumnus = alumnusQuery.data?.data.alumnus;

  return (
    <main className="min-h-screen bg-[#f8f8f8] pb-[4em] pt-[6em]">
      <section className="mx-auto w-[92%] sm:w-[90%] md:w-[70%]">
        {alumnusQuery.isLoading ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
            Loading alumni profile...
          </div>
        ) : alumnusQuery.error || !alumnus ? (
          <div className="rounded-2xl border border-dashed border-red-200 bg-red-50 p-10 text-center">
            <h1 className="text-xl font-semibold text-gray-900">Alumni profile not found</h1>
            <Link href="/community" className="mt-5 inline-block rounded-full bg-primary px-6 py-3 font-medium text-white">
              Back to community
            </Link>
          </div>
        ) : (
          <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row">
              <Image
                src={alumnus.avatarUrl || buildAvatarFallback(alumnus.fullName)}
                alt={alumnus.fullName}
                width={160}
                height={160}
                className="h-40 w-40 rounded-2xl object-cover"
                unoptimized
              />
              <div className="flex-1">
                <h1 className="text-2xl font-semibold sm:text-3xl">{alumnus.fullName}</h1>
                <p className="mt-2 text-primary">
                  {alumnus.currentRole || alumnus.associationRoleTitle || "Alumnus"}
                </p>
                <div className="mt-4 grid gap-3 text-sm text-gray-600 sm:grid-cols-2">
                  <p><span className="font-medium text-gray-900">Class:</span> {alumnus.graduationYear || "N/A"}</p>
                  <p><span className="font-medium text-gray-900">Degree:</span> {alumnus.degree || "N/A"}</p>
                  <p><span className="font-medium text-gray-900">Location:</span> {alumnus.location || "N/A"}</p>
                  <p><span className="font-medium text-gray-900">Company:</span> {alumnus.company || "N/A"}</p>
                </div>
              </div>
            </div>
            {alumnus.bio ? (
              <div className="mt-8">
                <h2 className="text-lg font-semibold">About</h2>
                <p className="mt-3 whitespace-pre-line leading-8 text-gray-700">{alumnus.bio}</p>
              </div>
            ) : null}
          </div>
        )}
      </section>
    </main>
  );
}
