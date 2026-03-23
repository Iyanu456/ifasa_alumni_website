"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { MoreVertical, Plus, X } from "lucide-react";
import { getApiErrorMessage, useAppMutations } from "../../apiServices/mutations";
import { useAdminGalleryQuery } from "../../apiServices/queries";
import { formatDate } from "../../lib/formatters";
import type { GalleryFormBody, GalleryItem } from "../../types/types";

const initialForm: GalleryFormBody = {
  title: "",
  altText: "",
  category: "Events",
  capturedAt: "",
  isPublished: true,
};

const categories = ["Events", "Reunions", "Campus", "Workshops", "Other"];

const toDateInput = (value?: string | null) =>
  value ? new Date(value).toISOString().slice(0, 10) : "";

export default function GalleryTab() {
  const [showModal, setShowModal] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [form, setForm] = useState<GalleryFormBody>(initialForm);
  const [feedback, setFeedback] = useState("");
  const galleryQuery = useAdminGalleryQuery({ limit: 50 });
  const { createGalleryMutation, updateGalleryMutation, deleteGalleryMutation } =
    useAppMutations();

  const gallery = useMemo(() => galleryQuery.data?.data ?? [], [galleryQuery.data]);

  const openCreate = () => {
    setEditingItem(null);
    setSelectedImage(null);
    setForm(initialForm);
    setShowModal(true);
    setFeedback("");
  };

  const openEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setSelectedImage(null);
    setForm({
      title: item.title,
      altText: item.altText || "",
      category: item.category,
      capturedAt: toDateInput(item.capturedAt),
      isPublished: item.isPublished,
    });
    setShowModal(true);
    setActiveMenu(null);
    setFeedback("");
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setSelectedImage(null);
    setForm(initialForm);
  };

  const handleSave = async () => {
    setFeedback("");

    try {
      if (editingItem) {
        await updateGalleryMutation.mutateAsync({
          id: editingItem._id,
          data: form,
          image: selectedImage,
        });
        setFeedback("Gallery item updated successfully.");
      } else {
        if (!selectedImage) {
          setFeedback("");
          return;
        }

        await createGalleryMutation.mutateAsync({
          data: form,
          image: selectedImage,
        });
        setFeedback("Gallery item uploaded successfully.");
      }

      closeModal();
    } catch {
      setFeedback("");
    }
  };

  const handleDelete = async (id: string) => {
    setActiveMenu(null);

    if (typeof window !== "undefined") {
      const confirmed = window.confirm("Delete this gallery item?");
      if (!confirmed) {
        return;
      }
    }

    await deleteGalleryMutation.mutateAsync(id);
  };

  const mutationError =
    createGalleryMutation.error || updateGalleryMutation.error || deleteGalleryMutation.error;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl">Gallery</h1>
          <p className="max-md:max-w-[85vw] text-sm text-gray-500">
            Upload and manage alumni event photos.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-white hover:opacity-90 max-md:text-sm"
        >
          <Plus size={16} />
          Upload
        </button>
      </div>

      {feedback ? <p className="text-sm text-green-600">{feedback}</p> : null}
      {mutationError ? (
        <p className="text-sm text-red-500">
          {getApiErrorMessage(mutationError, "We could not save this gallery item.")}
        </p>
      ) : null}

      {galleryQuery.isLoading ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
          Loading gallery...
        </div>
      ) : galleryQuery.error ? (
        <div className="rounded-xl border border-dashed border-red-200 bg-red-50 p-10 text-center text-sm text-red-500">
          We could not load gallery items.
        </div>
      ) : gallery.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
          No gallery items uploaded yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {gallery.map((item) => (
            <div
              key={item._id}
              className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white"
            >
              <div className="relative h-48">
                <Image
                  src={item.imageUrl}
                  alt={item.altText || item.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              <div className="p-4">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-gray-500">
                  {formatDate(item.capturedAt || item.createdAt)}
                </p>
                <p className="mt-1 text-xs text-gray-400">{item.category}</p>
              </div>

              <div className="absolute top-2 right-2">
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    setActiveMenu((current) => (current === item._id ? null : item._id));
                  }}
                  className="rounded-lg bg-white p-2 shadow hover:bg-gray-100"
                >
                  <MoreVertical size={16} />
                </button>

                {activeMenu === item._id ? (
                  <div className="absolute right-0 z-20 mt-2 w-32 rounded-lg border border-gray-100 bg-white text-sm shadow-lg">
                    <button
                      onClick={() => openEdit(item)}
                      className="block w-full px-4 py-2 text-left hover:bg-gray-50"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => void handleDelete(item._id)}
                      className="block w-full px-4 py-2 text-left text-red-500 hover:bg-gray-50"
                    >
                      Delete
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold">
                  {editingItem ? "Edit Photo" : "Upload Photo"}
                </h2>
                <p className="text-sm text-gray-500">
                  Add images from alumni events and activities.
                </p>
              </div>

              <button
                onClick={closeModal}
                className="rounded-lg p-2 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5 px-6 py-6">
              <div className="space-y-1">
                <label className="text-sm font-medium">Photo Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, title: event.target.value }))
                  }
                  placeholder="e.g. IFASA Alumni Meetup"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Category</label>
                  <select
                    value={form.category || "Events"}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, category: event.target.value }))
                    }
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Captured Date</label>
                  <input
                    type="date"
                    value={form.capturedAt || ""}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, capturedAt: event.target.value }))
                    }
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Alt Text</label>
                <input
                  type="text"
                  value={form.altText || ""}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, altText: event.target.value }))
                  }
                  placeholder="Describe the image for accessibility"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">
                  {editingItem ? "Replace Image (optional)" : "Upload Image"}
                </label>
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
                  checked={Boolean(form.isPublished)}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      isPublished: event.target.checked,
                    }))
                  }
                />
                Publish immediately
              </label>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">
              <button
                onClick={closeModal}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm hover:bg-white"
              >
                Cancel
              </button>

              <button
                onClick={() => void handleSave()}
                disabled={createGalleryMutation.isPending || updateGalleryMutation.isPending}
                className="rounded-lg bg-primary px-4 py-2 text-sm text-white hover:opacity-90 disabled:opacity-60"
              >
                {createGalleryMutation.isPending || updateGalleryMutation.isPending
                  ? "Saving..."
                  : editingItem
                    ? "Update Photo"
                    : "Upload Photo"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
