import Image from "next/image";
import Link from "next/link";

type EventCardProps = {
  title?: string;
  date?: string;
  location?: string;
  description?: string;
  image?: string;
  href?: string;
};

export default function EventCard({
  title = "Alumni Networking Night",
  date = "March 15, 2026",
  location = "OAU Great Hall",
  description = "An evening of connection, conversations, and opportunities with fellow Ife Architecture alumni.",
  image = "https://picsum.photos/seed/alumni-event/800/600",
  href = "/events",
}: EventCardProps) {
  return (
    <article className="bg-white rounded-md overflow-hidden shadow-xl/5 border border-gray-100 hover:shadow-2xl/5 transition">
      {/* Image */}
      <div className="relative w-full aspect-[4/2.5] max-sm:aspect-[2/1]">
        <Image
          unoptimized
          src={image}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover max-sm:h-[200px]"
        />
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4">
        <p className="text-[0.7rem] sm:text-xs text-gray-500 mb-1">{date}</p>
        <h3 className="font-semibold text-sm sm:text-base leading-snug line-clamp-2">
          {title}
        </h3>
        <p className="text-[0.75rem] sm:text-sm text-gray-500 mb-2">
          {location}
        </p>

        <p className="text-[0.75rem] sm:text-sm text-gray-600 line-clamp-3">
          {description}
        </p>

        <Link
          href={href}
          className="inline-block mt-2 text-primary text-xs sm:text-sm font-medium hover:underline"
        >
          View details →
        </Link>
      </div>
    </article>
  );
}
