"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useNewsItemQuery } from "../../apiServices/queries";
import { buildContentFallbackImage, formatDate } from "../../lib/formatters";

export default function NewsDetailPage() {
  const params = useParams<{ id: string }>();
  const identifier = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const newsQuery = useNewsItemQuery(identifier);
  const news = newsQuery.data?.data.news;

  return (
    <main className="min-h-screen pb-[4em] pt-[6em]">
      <section className="mx-auto w-[92%] sm:w-[90%] md:w-[70%]">
        {newsQuery.isLoading ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
            Loading news details...
          </div>
        ) : newsQuery.error || !news ? (
          <div className="rounded-2xl border border-dashed border-red-200 bg-red-50 p-10 text-center">
            <h1 className="text-xl font-semibold text-gray-900">News item not found</h1>
            <Link href="/news" className="mt-5 inline-block rounded-full bg-primary px-6 py-3 font-medium text-white">
              Back to news
            </Link>
          </div>
        ) : (
          <>
            <div className="relative mb-6 h-[250px] w-full overflow-hidden rounded-xl sm:h-[320px] md:h-[380px]">
              <Image
                src={news.coverImageUrl || buildContentFallbackImage("news", news.title)}
                alt={news.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <p className="text-sm text-gray-500">{formatDate(news.publishedAt || news.createdAt)}</p>
            <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">{news.title}</h1>
            <div className="mt-3 flex flex-wrap gap-2">
              {news.tags?.map((tag) => (
                <span key={tag} className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                  {tag}
                </span>
              ))}
            </div>
            <article className="mt-8 whitespace-pre-line leading-8 text-gray-700">
              {news.content}
            </article>
          </>
        )}
      </section>
    </main>
  );
}
