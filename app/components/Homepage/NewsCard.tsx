export default function NewsCard({
  title,
  date,
  excerpt,
}: {
  title: string;
  date: string;
  excerpt: string;
}) {
  return (
    <article className="bg-[#FAFAFA] rounded-xl p-4 sm:p-5 border border-gray-100 hover:shadow-md transition flex flex-col h-full">
      <p className="text-[0.65rem] sm:text-xs text-gray-500 mb-2">{date}</p>
      <h3 className="font-medium text-sm sm:text-base mb-2 line-clamp-2">
        {title}
      </h3>
      <p className="text-[0.75rem] sm:text-sm text-gray-600 line-clamp-3">
        {excerpt}
      </p>
      <span className="mt-auto text-primary text-xs sm:text-sm font-medium">
        Read more →
      </span>
    </article>
  );
}
