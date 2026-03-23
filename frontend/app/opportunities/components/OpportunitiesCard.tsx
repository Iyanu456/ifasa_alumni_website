import Image from "next/image";
import { MapPin, Calendar } from "lucide-react";
import Link from "next/link";

type OpportunityCardProps = {
  title: string;
  organization: string;
  category: string;
  description: string;
  link: string;
  location?: string;
  deadline?: string;
  image?: string;
  containerClassName?: string;
};

export default function OpportunityCard({
  title,
  organization,
  category,
  description,
  link,
  location,
  deadline,
  image,
  containerClassName = "",
}: OpportunityCardProps) {
  const isExternalLink = /^https?:\/\//i.test(link);

  return (
    <article
      className={`bg-white rounded-xl border border-gray-100 flex flex-col shadow-xl hover:shadow-md transition overflow-hidden ${containerClassName}`}
    >
      {/* Image */}
      {image && (
        <div className="relative w-full h-40 sm:h-44">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      )}

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full self-start mb-3">
          {category}
        </span>

        <Link
          href={link}
          target={isExternalLink ? "_blank" : undefined}
          rel={isExternalLink ? "noopener noreferrer" : undefined}
          className="font-medium text-base mb-1 hover:underline transition duration-200"
        >
          {title}
        </Link>

        <p className="text-sm text-gray-500 mb-3">{organization}</p>

        <div className="text-xs text-gray-500 flex flex-wrap gap-3 mb-3">
          {location && (
            <span className="flex items-center gap-1">
              <MapPin size={14} /> {location}
            </span>
          )}

          {deadline && (
            <span className="flex items-center gap-1">
              <Calendar size={14} /> Deadline: {deadline}
            </span>
          )}
        </div>

        <p className="text-sm text-gray-600 line-clamp-3 mb-4">
          {description}
        </p>

        <Link
          href={link}
          target={isExternalLink ? "_blank" : undefined}
          rel={isExternalLink ? "noopener noreferrer" : undefined}
          className="mt-auto text-primary text-sm font-medium hover:underline"
        >
          View opportunity →
        </Link>
      </div>
    </article>
  );
}
