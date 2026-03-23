"use client";

import { useNewsQuery } from "../apiServices/queries";
import NewsCard from "../components/Homepage/NewsCard";
import { buildContentFallbackImage, formatDate } from "../lib/formatters";

export default function NewsPage() {
  const newsQuery = useNewsQuery({ limit: 24, sort: "publishedAt", order: "desc" });
  const news = newsQuery.data?.data ?? [];

  return (
    <main className="min-h-screen bg-[#f8f8f8] pb-[5em] pt-[6em]">
      <section className="mx-auto mb-8 w-[92%] sm:w-[90%] md:w-[80%]">
        <h1 className="text-2xl font-semibold sm:text-3xl">News & Updates</h1>
        <p className="mt-2 text-sm text-gray-600">
          Latest stories, announcements, and highlights from the alumni community.
        </p>
      </section>

      <section className="mx-auto grid w-[92%] gap-6 sm:w-[90%] md:w-[80%] md:grid-cols-2 xl:grid-cols-3">
        {news.map((item) => (
          <NewsCard
            key={item._id}
            title={item.title}
            date={formatDate(item.publishedAt)}
            excerpt={item.excerpt || item.content}
            image={item.coverImageUrl || buildContentFallbackImage("news", item.title)}
            tag={item.tags}
            href={`/news/${item.slug || item._id}`}
            containerClassName="bg-white"
          />
        ))}
      </section>
    </main>
  );
}
