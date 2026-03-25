"use client";

import { useState } from "react";
import Image from "next/image";
import type { User } from "../../types/types";
import { buildAvatarFallback } from "../../lib/formatters";

export default function AlumniCard({ alumnus }: { alumnus: User }) {
  const avatarFallback = buildAvatarFallback(alumnus.fullName);

  const [imgSrc, setImgSrc] = useState(
    alumnus.avatarUrl || avatarFallback
  );

  const handleError = () => {
    // Prevent infinite loop if fallback also fails
    if (imgSrc !== avatarFallback) {
      setImgSrc(avatarFallback);
    }
  };

  return (
    <article className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition p-4 flex flex-col">
      <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-3">
        <Image
          unoptimized
          src={imgSrc}
          alt={`${alumnus.fullName} profile`}
          fill
          className="object-cover"
          onError={handleError}
        />
      </div>

      <h3 className="font-medium text-sm sm:text-base leading-tight">
        {alumnus.fullName}
      </h3>

      <p className="text-xs sm:text-sm text-gray-500">
        {alumnus.currentRole || alumnus.associationRoleTitle || "Alumnus"}
      </p>

      <div className="mt-2 text-xs sm:text-sm text-gray-600 space-y-1">
        <p>
          <span className="font-medium">Location: </span>{" "}
          {alumnus.location || "N/A"}
        </p>

        <p>
          <span className="font-medium">Class of: </span>{" "}
          {alumnus.graduationYear || "N/A"}
        </p>

        <p className="break-all">
          <span className="font-medium">Email: </span>{" "}
          {alumnus.email || "N/A"}
        </p>

        {alumnus.specialization && (
          <p className="line-clamp-2">
            <span className="font-medium">Specialization: </span>
            {alumnus.specialization}
          </p>
        )}

        {alumnus.nickname && (
          <p className="line-clamp-2">
            <span className="font-medium">Nickname: </span>
            {alumnus.nickname}
          </p>
        )}
      </div>
    </article>
  );
}