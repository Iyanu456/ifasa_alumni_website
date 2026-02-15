import Image from "next/image";

type Alumni = {
  name: string;
  role: string;
  location: string;
  graduationYear: string;
  specialization: string;
  image?: string;
};

export default function AlumniCard({ alumnus }: { alumnus: Alumni }) {
  const avatarFallback = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
    alumnus.name
  )}`;

  return (
    <article className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition p-4 flex flex-col">
      <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-3">
        <Image
          unoptimized
          src={alumnus.image || avatarFallback}
          alt={`${alumnus.name} profile`}
          fill
          className="object-cover"
        />
      </div>

      <h3 className="font-medium text-sm sm:text-base leading-tight">
        {alumnus.name}
      </h3>
      <p className="text-xs sm:text-sm text-gray-500">{alumnus.role}</p>

      <div className="mt-2 text-xs sm:text-sm text-gray-600 space-y-1">
        <p>
          <span className="font-medium">Location:</span> {alumnus.location}
        </p>
        <p>
          <span className="font-medium">Class of:</span> {alumnus.graduationYear}
        </p>
        <p className="line-clamp-2">
          <span className="font-medium">Specialization:</span>{" "}
          {alumnus.specialization}
        </p>
      </div>

      <button className="mt-auto pt-3 text-primary text-xs sm:text-sm font-medium hover:underline">
        View profile →
      </button>
    </article>
  );
}
