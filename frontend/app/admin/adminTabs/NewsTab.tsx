"use client";

import { useMemo, useState } from "react";
import { MoreVertical, Plus, Search, X } from "lucide-react";
import { getApiErrorMessage, useAppMutations } from "../../apiServices/mutations";
import { useAdminNewsQuery } from "../../apiServices/queries";
import { formatDate } from "../../lib/formatters";
import type { NewsFormBody, NewsItem } from "../../types/types";

const initialForm: NewsFormBody = {
  title: "",
  excerpt: "",
  content: "",
  tags: "",
  status: "draft",
  isFeatured: false,
};

const stringifyTags = (tags?: string[] | string) =>
  Array.isArray(tags) ? tags.join(", ") : tags || "";

export default function NewsTab() {
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [form, setForm] = useState<NewsFormBody>(initialForm);
  const [feedback, setFeedback] = useState("");
  const newsQuery = useAdminNewsQuery({ search: query, limit: 50 });
  const { createNewsMutation, updateNewsMutation, deleteNewsMutation } = useAppMutations();

  const newsItems = useMemo(() => newsQuery.data?.data ?? [], [newsQuery.data]);

  const resetForm = () => {
    setForm(initialForm);
    setSelectedImage(null);
    setEditingNews(null);
    setShowModal(false);
  };

  const openCreateModal = () => {
    setForm(initialForm);
    setEditingNews(null);
    setSelectedImage(null);
    setShowModal(true);
    setFeedback("");
  };

  const openEditModal = (news: NewsItem) => {
    setEditingNews(news);
    setForm({
      title: news.title,
      excerpt: news.excerpt || "",
      content: news.content,
      tags: stringifyTags(news.tags),
      status: news.status,
      isFeatured: news.isFeatured,
    });
    setSelectedImage(null);
    setShowModal(true);
    setFeedback("");
  };

  const handleSave = async () => {
    setFeedback("");

    try {
      if (editingNews) {
        await updateNewsMutation.mutateAsync({
          id: editingNews._id,
          data: form,
          image: selectedImage,
        });
        setFeedback("News item updated successfully.");
      } else {
        await createNewsMutation.mutateAsync({ data: form, image: selectedImage });
        setFeedback("News item created successfully.");
      }

      resetForm();
    } catch {
      setFeedback("");
    }
  };

  const handleDelete = async (id: string) => {
    if (typeof window !== "undefined") {
      const confirmed = window.confirm("Delete this news post?");
      if (!confirmed) {
        return;
      }
    }

    await deleteNewsMutation.mutateAsync(id);
  };

  const mutationError =
    createNewsMutation.error || updateNewsMutation.error || deleteNewsMutation.error;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl">News</h1>
          <p className="max-md:w-[85%] pt-1 text-sm text-gray-500">
            Publish announcements and updates for alumni.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-white hover:opacity-90 max-md:text-sm"
        >
          <Plus size={16} />
          New
        </button>
      </div>

      {feedback ? <p className="text-sm text-green-600">{feedback}</p> : null}
      {mutationError ? (
        <p className="text-sm text-red-500">
          {getApiErrorMessage(mutationError, "We could not save this news post.")}
        </p>
      ) : null}

      <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search news..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full text-sm outline-none"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
        {newsQuery.isLoading ? (
          <div className="p-8 text-center text-sm text-gray-500">Loading news...</div>
        ) : newsQuery.error ? (
          <div className="p-8 text-center text-sm text-red-500">
            We could not load news.
          </div>
        ) : newsItems.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            No news posts found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="p-4 text-left font-medium">Title</th>
                  <th className="hidden p-4 text-left font-medium md:table-cell">Author</th>
                  <th className="p-4 text-left font-medium max-md:hidden">Tags</th>
                  <th className="p-4 text-left font-medium">Date</th>
                  <th className="p-4 text-left font-medium">Status</th>
                  <th className="p-4 text-right font-medium" />
                </tr>
              </thead>
              <tbody>
                {newsItems.map((news) => (
                  <tr
                    key={news._id}
                    className="border-t border-gray-100 transition hover:bg-gray-50"
                  >
                    <td className="p-4 font-medium">{news.title}</td>
                    <td className="hidden p-4 md:table-cell">
                      {news.authorName || "Admin"}
                    </td>
                    <td className="p-4 max-md:hidden">
                      <div className="flex flex-wrap gap-2">
                        {news.tags.length ? (
                          news.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-gray-100 px-2 py-1 text-xs"
                            >
                              {tag}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">No tags</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      {formatDate(news.publishedAt || news.createdAt)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          news.status === "published"
                            ? "bg-green-100 text-green-600"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {news.status === "published" ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(news)}
                          className="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
                        >
                          <MoreVertical size={18} />
                        </button>
                        <button
                          onClick={() => void handleDelete(news._id)}
                          className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-500 hover:bg-red-50"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl overflow-y-scroll max-h-[85vh] rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold">
                  {editingNews ? "Edit News Post" : "Create News Post"}
                </h2>
                <p className="text-sm text-gray-500">
                  Share updates, announcements, and achievements.
                </p>
              </div>

              <button
                onClick={resetForm}
                className="rounded-lg p-2 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5 px-6 py-6">
              <div className="space-y-1">
                <label className="text-sm font-medium">News Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, title: event.target.value }))
                  }
                  placeholder="Enter news title..."
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Excerpt</label>
                <textarea
                  rows={2}
                  value={form.excerpt || ""}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, excerpt: event.target.value }))
                  }
                  placeholder="Short summary for previews..."
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">News Content</label>
                <textarea
                  rows={5}
                  value={form.content}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, content: event.target.value }))
                  }
                  placeholder="Write the news content..."
                  className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Tags</label>
                <input
                  type="text"
                  value={stringifyTags(form.tags)}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, tags: event.target.value }))
                  }
                  placeholder="Announcement, Event, Award"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Status</label>
                <select
                  value={form.status || "draft"}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      status: event.target.value as NewsFormBody["status"],
                    }))
                  }
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="draft">Save as Draft</option>
                  <option value="published">Publish Now</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Cover Image (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => setSelectedImage(event.target.files?.[0] || null)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={Boolean(form.isFeatured)}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      isFeatured: event.target.checked,
                    }))
                  }
                />
                Feature on homepage
              </label>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">
              <button
                onClick={resetForm}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm hover:bg-white"
              >
                Cancel
              </button>

              <button
                onClick={() => void handleSave()}
                disabled={createNewsMutation.isPending || updateNewsMutation.isPending}
                className="rounded-lg bg-primary px-4 py-2 text-sm text-white hover:opacity-90 disabled:opacity-60"
              >
                {createNewsMutation.isPending || updateNewsMutation.isPending
                  ? "Saving..."
                  : editingNews
                    ? "Update News"
                    : "Publish News"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
