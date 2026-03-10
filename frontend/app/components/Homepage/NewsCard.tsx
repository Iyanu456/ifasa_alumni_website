import Image from "next/image";

export default function NewsCard({
  title,
  date,
  excerpt,
  image,
  containerClassName = "",
  tag,
  organization
}: {
  title: string;
  date?: string;
  excerpt: string;
  image?: string;
  containerClassName?: string;
  tag?: string | string[];
  organization?: string;
}) {
  return (
    <article
      className={`bg-[#FAFAFA] rounded-xl border border-gray-100 hover:shadow-md transition flex flex-col h-full overflow-hidden ${containerClassName}`}
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
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        {tag && (
          <div className="self-start mb-3">
            {Array.isArray(tag) ? (
              tag.map((t) => (
                <span
                  key={t}
                  className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full mr-2"
                >
                  {t}
                </span>
              ))
            ) : (
              <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                {tag}
              </span>
            )}
          </div>
        )}

        {date && (
          <p className="text-[0.65rem] sm:text-xs text-gray-500 mb-2">
            {date}
          </p>
        )}

        <h3 className="font-medium text-sm sm:text-base mb-2 line-clamp-2">
          {title}
        </h3>
        {organization && (
          <p className="text-[0.75rem] sm:text-sm text-gray-500 mb-3">
            {organization}
          </p>
        )}

        <p className="text-[0.75rem] sm:text-sm text-gray-600 line-clamp-3">
          {excerpt}
        </p>

        <span className="mt-auto text-primary text-xs sm:text-sm font-medium pt-3">
          Read more →
        </span>
      </div>
    </article>
  );
}