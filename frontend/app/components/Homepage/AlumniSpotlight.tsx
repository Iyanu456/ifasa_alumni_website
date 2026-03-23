import Image from "next/image";
import Link from "next/link";
import { buildAvatarFallback } from "../../lib/formatters";

type AlumniSpotlightProps = {
  name: string;
  role: string;
  quote: string;
  image?: string;
  href?: string;
};

export default function AlumniSpotlight({
  name,
  role,
  quote,
  image,
  href,
}: AlumniSpotlightProps) {
  const content = (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 flex flex-col h-full">
      <p className="text-gray-600 text-sm sm:text-base mb-4 leading-relaxed line-clamp-4">
        &ldquo;{quote}&rdquo;
      </p>

      <div className="mt-auto flex items-center gap-3">
        <div className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden border border-gray-200 shrink-0">
          <Image
            unoptimized
            src={image || buildAvatarFallback(name)}
            alt={`${name} profile photo`}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex-1">
          <p className="font-medium text-sm sm:text-base leading-tight">{name}</p>
          <p className="text-xs sm:text-sm text-gray-500">{role}</p>
        </div>

        {href ? <span className="text-xs font-medium text-primary">View →</span> : null}
      </div>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
