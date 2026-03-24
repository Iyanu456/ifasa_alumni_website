"use client";

import { ChangeEvent, useMemo, useState } from "react";
import Image from "next/image";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { getApiErrorMessage, useAppMutations } from "../../apiServices/mutations";
import { useAdminExecutivesQuery } from "../../apiServices/queries";
import { buildAvatarFallback } from "../../lib/formatters";
import type { Executive, ExecutiveFormBody } from "../../types/types";

const initialForm: ExecutiveFormBody = {
  name: "",
  email: "",
  role: "",
  position: "",
  title: "",
  sortOrder: 0,
  isPublished: true,
};

export default function ExecutivesTab() {
  const executivesQuery = useAdminExecutivesQuery({ limit: 50, sort: "sortOrder", order: "asc" });
  const { createExecutiveMutation, updateExecutiveMutation, deleteExecutiveMutation } =
    useAppMutations();
  const [isOpen, setIsOpen] = useState(false);
  const [editingExecutive, setEditingExecutive] = useState<Executive | null>(null);
  const [form, setForm] = useState<ExecutiveFormBody>(initialForm);
  const [image, setImage] = useState<File | null>(null);

  const executives = useMemo(() => executivesQuery.data?.data ?? [], [executivesQuery.data]);
  const mutationError =
    createExecutiveMutation.error ||
    updateExecutiveMutation.error ||
    deleteExecutiveMutation.error;

  const openCreate = () => {
    setEditingExecutive(null);
    setForm(initialForm);
    setImage(null);
    setIsOpen(true);
  };

  const openEdit = (executive: Executive) => {
    setEditingExecutive(executive);
    setForm({
      name: executive.name,
      email: executive.email,
      role: executive.role,
      position: executive.position,
      title: executive.title,
      sortOrder: executive.sortOrder || 0,
      isPublished: executive.isPublished,
    });
    setImage(null);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditingExecutive(null);
    setForm(initialForm);
    setImage(null);
  };

  const handleSubmit = async () => {
    if (editingExecutive) {
      await updateExecutiveMutation.mutateAsync({
        id: editingExecutive._id,
        data: form,
        image,
      });
    } else {
      await createExecutiveMutation.mutateAsync({ data: form, image });
    }

    closeModal();
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl">Executives</h1>
          <p className="text-sm text-gray-500">
            Manage the leadership profiles displayed on the public site.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-white"
        >
          <Plus size={16} />
          Add Executive
        </button>
      </div>

      {mutationError ? (
        <p className="text-sm text-red-500">
          {getApiErrorMessage(mutationError, "We could not save this executive right now.")}
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {executives.map((executive) => (
          <article key={executive._id} className="rounded-2xl border border-gray-100 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <Image
                  src={executive.profilePicture || buildAvatarFallback(executive.name)}
                  alt={executive.name}
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-full object-cover"
                  unoptimized
                />
                <div>
                  <p className="font-semibold">{executive.name}</p>
                  <p className="text-sm text-gray-500">{executive.position}</p>
                </div>
              </div>
              <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                #{executive.sortOrder || 0}
              </span>
            </div>

            <p className="mt-4 text-sm font-medium text-primary">{executive.role}</p>
            <p className="mt-1 text-sm text-gray-600">{executive.title}</p>
            <p className="mt-2 text-xs text-gray-500">{executive.email}</p>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => openEdit(executive)}
                className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
              >
                <Pencil size={14} />
                Edit
              </button>
              <button
                onClick={() => void deleteExecutiveMutation.mutateAsync(executive._id)}
                className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>

      {isOpen ? (
        <div className="fixed inset-0 z-[2600] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-semibold">
                {editingExecutive ? "Edit Executive" : "Add Executive"}
              </h2>
              <button onClick={closeModal} className="rounded-lg p-2 hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>

            <div className="grid gap-4 px-6 py-6 md:grid-cols-2">
              {(["name", "email", "position" ] as const).map((field) => (
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold">{field}</label>
                  <input
                  key={field}
                  value={String(form[field] ?? "")}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, [field]: event.target.value }))
                  }
                  placeholder={field}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                />
                </div>
                
              ))}

              {/*<input
                type="number"
                value={form.sortOrder ?? 0}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    sortOrder: Number.parseInt(event.target.value || "0", 10),
                  }))
                }
                placeholder="Sort order"
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              />*/}

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold">profile picture</label>
                  <input
                type="file"
                accept="image/*"
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setImage(event.target.files?.[0] || null)
                }
                className="rounded-lg border border-gray-200 px-3 py-2 h-fit mb-0 mt-auto text-sm"
              />
                </div>
              

              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={Boolean(form.isPublished)}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, isPublished: event.target.checked }))
                  }
                />
                Publish on public pages
              </label>

              
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">
              <button onClick={closeModal} className="rounded-lg border border-gray-200 px-4 py-2 text-sm">
                Cancel
              </button>
              <button
                onClick={() => void handleSubmit()}
                disabled={createExecutiveMutation.isPending || updateExecutiveMutation.isPending}
                className="rounded-lg bg-primary px-4 py-2 text-sm text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
