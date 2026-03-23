"use client";

import { useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { getApiErrorMessage, useAppMutations } from "../../apiServices/mutations";
import { useAdminOpportunitiesQuery } from "../../apiServices/queries";
import { formatDate } from "../../lib/formatters";
import type { Opportunity, OpportunityFormBody } from "../../types/types";

const opportunityTypes = [
  "Job",
  "Internship",
  "Scholarship",
  "Grant",
  "Fellowship",
  "Competition",
  "Other",
];

const initialForm: OpportunityFormBody = {
  title: "",
  organization: "",
  category: "",
  description: "",
  requirements: "",
  location: "",
  deadline: "",
  applicationLink: "",
  status: "open",
  isFeatured: false,
};

const toDateInput = (value?: string | null) =>
  value ? new Date(value).toISOString().slice(0, 10) : "";

const stringifyRequirements = (requirements?: string[] | string) =>
  Array.isArray(requirements) ? requirements.join(", ") : requirements || "";

export default function OpportunitiesTab() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [form, setForm] = useState<OpportunityFormBody>(initialForm);
  const [feedback, setFeedback] = useState("");
  const opportunitiesQuery = useAdminOpportunitiesQuery({ search, limit: 50 });
  const {
    createOpportunityMutation,
    updateOpportunityMutation,
    deleteOpportunityMutation,
  } = useAppMutations();

  const opportunities = useMemo(
    () => opportunitiesQuery.data?.data ?? [],
    [opportunitiesQuery.data],
  );

  const resetForm = () => {
    setForm(initialForm);
    setSelectedImage(null);
    setEditingOpportunity(null);
    setShowModal(false);
  };

  const openCreateModal = () => {
    setEditingOpportunity(null);
    setForm(initialForm);
    setSelectedImage(null);
    setShowModal(true);
    setFeedback("");
  };

  const startEdit = (opportunity: Opportunity) => {
    setEditingOpportunity(opportunity);
    setForm({
      title: opportunity.title,
      organization: opportunity.organization,
      category: opportunity.category,
      description: opportunity.description,
      requirements: stringifyRequirements(opportunity.requirements),
      location: opportunity.location || "",
      deadline: toDateInput(opportunity.deadline),
      applicationLink: opportunity.applicationLink || "",
      status: opportunity.status,
      isFeatured: opportunity.isFeatured,
    });
    setSelectedImage(null);
    setShowModal(true);
    setFeedback("");
  };

  const handleSubmit = async () => {
    setFeedback("");

    try {
      if (editingOpportunity) {
        await updateOpportunityMutation.mutateAsync({
          id: editingOpportunity._id,
          data: form,
          image: selectedImage,
        });
        setFeedback("Opportunity updated successfully.");
      } else {
        await createOpportunityMutation.mutateAsync({
          data: form,
          image: selectedImage,
        });
        setFeedback("Opportunity created successfully.");
      }

      resetForm();
    } catch {
      setFeedback("");
    }
  };

  const handleDelete = async (id: string) => {
    if (typeof window !== "undefined") {
      const confirmed = window.confirm("Delete this opportunity?");
      if (!confirmed) {
        return;
      }
    }

    await deleteOpportunityMutation.mutateAsync(id);
  };

  const mutationError =
    createOpportunityMutation.error ||
    updateOpportunityMutation.error ||
    deleteOpportunityMutation.error;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl">Opportunities</h1>
          <p className="max-md:w-[85%] pt-1 text-sm text-gray-500">
            Manage job, internship, grant, and scholarship opportunities.
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
          {getApiErrorMessage(mutationError, "We could not save this opportunity.")}
        </p>
      ) : null}

      <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search opportunities..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full text-sm outline-none"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
        {opportunitiesQuery.isLoading ? (
          <div className="p-8 text-center text-sm text-gray-500">
            Loading opportunities...
          </div>
        ) : opportunitiesQuery.error ? (
          <div className="p-8 text-center text-sm text-red-500">
            We could not load opportunities.
          </div>
        ) : opportunities.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            No opportunities found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="p-4 text-left font-medium">Opportunity</th>
                  <th className="hidden p-4 text-left font-medium md:table-cell">
                    Organization
                  </th>
                  <th className="hidden p-4 text-left font-medium lg:table-cell">
                    Location
                  </th>
                  <th className="p-4 text-left font-medium">Deadline</th>
                  <th className="p-4 text-left font-medium">Status</th>
                  <th className="p-4 text-right font-medium" />
                </tr>
              </thead>
              <tbody>
                {opportunities.map((opportunity) => (
                  <tr
                    key={opportunity._id}
                    className="border-t border-gray-100 transition hover:bg-gray-50"
                  >
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{opportunity.title}</p>
                        <p className="text-xs text-gray-500 md:hidden">
                          {opportunity.organization}
                        </p>
                        <p className="text-xs text-gray-400 lg:hidden">
                          {opportunity.location || "Remote / Flexible"}
                        </p>
                      </div>
                    </td>
                    <td className="hidden p-4 md:table-cell">
                      {opportunity.organization}
                    </td>
                    <td className="hidden p-4 lg:table-cell">
                      {opportunity.location || "—"}
                    </td>
                    <td className="p-4">
                      {opportunity.deadline ? formatDate(opportunity.deadline) : "Open"}
                    </td>
                    <td className="p-4">
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          opportunity.status === "open"
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {opportunity.status === "open" ? "Open" : "Closed"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => startEdit(opportunity)}
                          className="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => void handleDelete(opportunity._id)}
                          className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-500 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
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
        <div className="fixed inset-0 z-[2500] flex items-center justify-center bg-black/40 p-4">
          <div className="max-md:max-h-[90vh] w-full max-w-xl  overflow-y-scroll max-h-[85vh] rounded-2xl bg-white shadow-xl max-md:overflow-y-scroll">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold">
                  {editingOpportunity ? "Edit Opportunity" : "Add Opportunity"}
                </h2>
                <p className="max-md:max-w-[90%] pt-1 text-sm text-gray-500">
                  Share a job, internship, grant, or scholarship with alumni.
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
              <div className="space-y-2">
                <label className="text-sm font-medium">Opportunity Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, title: event.target.value }))
                  }
                  placeholder="e.g. Junior Architect"
                  className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Organization</label>
                <input
                  type="text"
                  value={form.organization}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      organization: event.target.value,
                    }))
                  }
                  placeholder="Company or studio name"
                  className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Opportunity Type</label>
                  <select
                    value={form.category}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, category: event.target.value }))
                    }
                    className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    <option value="">Select category</option>
                    {opportunityTypes.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Status</label>
                  <select
                    value={form.status || "open"}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        status: event.target.value as OpportunityFormBody["status"],
                      }))
                    }
                    className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Location</label>
                  <input
                    type="text"
                    value={form.location || ""}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, location: event.target.value }))
                    }
                    placeholder="City, Country"
                    className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Deadline</label>
                  <input
                    type="date"
                    value={form.deadline || ""}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, deadline: event.target.value }))
                    }
                    className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Application Link</label>
                <input
                  type="url"
                  value={form.applicationLink || ""}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      applicationLink: event.target.value,
                    }))
                  }
                  placeholder="https://application-url.com"
                  className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Requirements</label>
                <textarea
                  rows={3}
                  value={stringifyRequirements(form.requirements)}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      requirements: event.target.value,
                    }))
                  }
                  placeholder="Separate multiple requirements with commas"
                  className="mt-1.5 w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, description: event.target.value }))
                  }
                  placeholder="Describe the opportunity..."
                  className="mt-1.5 w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                />
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
                onClick={() => void handleSubmit()}
                disabled={
                  createOpportunityMutation.isPending || updateOpportunityMutation.isPending
                }
                className="rounded-lg bg-primary px-4 py-2 text-sm text-white hover:opacity-90 disabled:opacity-60"
              >
                {createOpportunityMutation.isPending || updateOpportunityMutation.isPending
                  ? "Saving..."
                  : editingOpportunity
                    ? "Update Opportunity"
                    : "Publish Opportunity"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
