import Image from "next/image";

type AlumniSpotlightProps = {
  name: string;
  role: string;
  quote: string;
  image?: string; // optional profile image
};

export default function AlumniSpotlight({
  name,
  role,
  quote,
  image,
}: AlumniSpotlightProps) {
  const avatarFallback = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
    name
  )}`;

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 flex flex-col h-full">
      <p className="text-gray-600 text-sm sm:text-base mb-4 leading-relaxed line-clamp-4">
        “{quote}”
      </p>

      <div className="mt-auto flex items-center gap-3">
        <div className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden border border-gray-200 shrink-0">
          <Image
            unoptimized
            src={image || avatarFallback}
            alt={`${name} profile photo`}
            fill
            className="object-cover"
          />
        </div>

        <div>
          <p className="font-medium text-sm sm:text-base leading-tight">
            {name}
          </p>
          <p className="text-xs sm:text-sm text-gray-500">{role}</p>
        </div>
      </div>
    </div>
  );
}
