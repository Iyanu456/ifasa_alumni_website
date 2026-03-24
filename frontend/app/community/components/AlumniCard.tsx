import Image from "next/image";
import Link from "next/link";
import type { User } from "../../types/types";
import { buildAvatarFallback } from "../../lib/formatters";

export default function AlumniCard({ alumnus }: { alumnus: User }) {
  const avatarFallback = buildAvatarFallback(alumnus.fullName);

  return (
    <article className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition p-4 flex flex-col">
      <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-3">
        <Image
          unoptimized
          src={alumnus.avatarUrl || avatarFallback}
          alt={`${alumnus.fullName} profile`}
          fill
          className="object-cover"
        />
      </div>

      <h3 className="font-medium text-sm sm:text-base leading-tight">{alumnus.fullName}</h3>
      <p className="text-xs sm:text-sm text-gray-500">
        {alumnus.currentRole || alumnus.associationRoleTitle || "Alumnus"}
      </p>

      <div className="mt-2 text-xs sm:text-sm text-gray-600 space-y-1">
        <p>
          <span className="font-medium">Location: </span> {alumnus.location || "N/A"}
        </p>
        <p>
          <span className="font-medium">Class of: </span> {alumnus.graduationYear || "N/A"}
        </p>
        <p>
          <span className="font-medium text-wrap">Email: </span> {alumnus.email || "N/A"}
        </p>
        {alumnus.specialization && <p className="line-clamp-2">
          <span className="font-medium">Specialization: </span>
          {alumnus.specialization || "Not specified"}
        </p>}
      </div>

      {/*<Link
        href={`/community/${alumnus._id}`}
        className="mt-auto pt-3 text-primary text-xs sm:text-sm font-medium hover:underline"
      >
        View profile →
      </Link>*/}
    </article>
  );
}
