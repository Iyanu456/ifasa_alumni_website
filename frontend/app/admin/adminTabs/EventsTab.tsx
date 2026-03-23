"use client";

import { useMemo, useState } from "react";
import { Calendar, Image as ImageIcon, MapPin, Pencil, Trash2 } from "lucide-react";
import { getApiErrorMessage, useAppMutations } from "../../apiServices/mutations";
import { useAdminEventsQuery } from "../../apiServices/queries";
import { formatDate } from "../../lib/formatters";
import type { Event, EventFormBody } from "../../types/types";

const initialForm: EventFormBody = {
  title: "",
  category: "",
  date: "",
  location: "",
  description: "",
  registrationLink: "",
  isPublished: true,
  isFeatured: false,
};

const categories = [
  "Networking",
  "Workshop",
  "Conference",
  "Meetup",
  "Seminar",
  "Talk",
  "Reunion",
  "Other",
];

const toDateInput = (value?: string) => (value ? new Date(value).toISOString().slice(0, 10) : "");

export default function EventsTab() {
  const [form, setForm] = useState<EventFormBody>(initialForm);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [feedback, setFeedback] = useState("");
  const eventsQuery = useAdminEventsQuery({ limit: 50, sort: "date", order: "asc" });
  const { createEventMutation, updateEventMutation, deleteEventMutation } = useAppMutations();

  const events = useMemo(() => eventsQuery.data?.data ?? [], [eventsQuery.data]);

  const resetForm = () => {
    setForm(initialForm);
    setSelectedImage(null);
    setEditingEvent(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFeedback("");

    try {
      if (editingEvent) {
        await updateEventMutation.mutateAsync({
          id: editingEvent.id,
          data: form,
          image: selectedImage,
        });
        setFeedback("Event updated successfully.");
      } else {
        await createEventMutation.mutateAsync({
          data: form,
          image: selectedImage,
        });
        setFeedback("Event created successfully.");
      }

      resetForm();
    } catch {
      setFeedback("");
    }
  };

  const startEdit = (eventItem: Event) => {
    setEditingEvent(eventItem);
    setForm({
      title: eventItem.title,
      category: eventItem.category,
      date: toDateInput(eventItem.date),
      location: eventItem.location,
      description: eventItem.description,
      registrationLink: eventItem.registrationLink || "",
      isPublished: eventItem.isPublished,
      isFeatured: eventItem.isFeatured,
    });
    setSelectedImage(null);
    setFeedback("");
  };

  const handleDelete = async (id: string) => {
    if (typeof window !== "undefined") {
      const confirmed = window.confirm("Delete this event?");
      if (!confirmed) {
        return;
      }
    }

    await deleteEventMutation.mutateAsync(id);
  };

  const mutationError =
    createEventMutation.error || updateEventMutation.error || deleteEventMutation.error;

  return (
    <section className="w-full space-y-6 md:w-[90%]">
      <div className="mb-6">
        <h1 className="text-lg font-semibold md:text-2xl">
          {editingEvent ? "Edit Event" : "Create Event"}
        </h1>
        <p className="text-sm text-gray-500">
          Add and manage events for alumni and students.
        </p>
      </div>

      {feedback ? <p className="text-sm text-green-600">{feedback}</p> : null}
      {mutationError ? (
        <p className="text-sm text-red-500">
          {getApiErrorMessage(mutationError, "We could not save this event.")}
        </p>
      ) : null}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border border-gray-100 bg-white p-6"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">Event Title</label>
            <input
              type="text"
              required
              placeholder="Alumni Networking Night"
              value={form.title}
              onChange={(event) =>
                setForm((current) => ({ ...current, title: event.target.value }))
              }
              className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Event Category</label>
            <select
              required
              value={form.category}
              onChange={(event) =>
                setForm((current) => ({ ...current, category: event.target.value }))
              }
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3"
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">Event Date</label>
            <div className="flex items-center rounded-lg border border-gray-200 px-3">
              <Calendar size={16} className="mr-2 text-gray-400" />
              <input
                type="date"
                required
                value={form.date}
                onChange={(event) =>
                  setForm((current) => ({ ...current, date: event.target.value }))
                }
                className="w-full py-3 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Location</label>
            <div className="flex items-center rounded-lg border border-gray-200 px-3">
              <MapPin size={16} className="mr-2 text-gray-400" />
              <input
                type="text"
                required
                placeholder="Lagos, Nigeria"
                value={form.location}
                onChange={(event) =>
                  setForm((current) => ({ ...current, location: event.target.value }))
                }
                className="w-full py-3 outline-none"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Event Cover Image</label>
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 p-6 hover:bg-gray-50">
            <ImageIcon size={18} />
            <span className="text-sm text-gray-500">
              {selectedImage ? selectedImage.name : "Upload event image"}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setSelectedImage(event.target.files?.[0] || null)}
              className="hidden"
            />
          </label>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Event Description</label>
          <textarea
            rows={4}
            placeholder="Describe the event..."
            value={form.description}
            onChange={(event) =>
              setForm((current) => ({ ...current, description: event.target.value }))
            }
            className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            RSVP Link (optional)
          </label>
          <input
            type="url"
            placeholder="https://event-registration-link.com"
            value={form.registrationLink || ""}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                registrationLink: event.target.value,
              }))
            }
            className="w-full rounded-lg border border-gray-200 px-4 py-3"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
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

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={resetForm}
            className="rounded-lg border border-gray-200 px-5 py-2 hover:bg-gray-50"
          >
            {editingEvent ? "Cancel Edit" : "Clear"}
          </button>

          <button
            type="submit"
            disabled={createEventMutation.isPending || updateEventMutation.isPending}
            className="rounded-lg bg-primary px-6 py-2 text-white hover:opacity-90 disabled:opacity-60"
          >
            {createEventMutation.isPending || updateEventMutation.isPending
              ? "Saving..."
              : editingEvent
                ? "Update Event"
                : "Create Event"}
          </button>
        </div>
      </form>

      <div className="rounded-xl border border-gray-100 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">Manage Events</h2>
          <span className="text-sm text-gray-500">{events.length} total</span>
        </div>

        {eventsQuery.isLoading ? (
          <p className="text-sm text-gray-500">Loading events...</p>
        ) : eventsQuery.error ? (
          <p className="text-sm text-red-500">We could not load events.</p>
        ) : events.length === 0 ? (
          <p className="text-sm text-gray-500">No events created yet.</p>
        ) : (
          <div className="space-y-4">
            {events.map((eventItem) => (
              <div
                key={eventItem.id}
                className="flex flex-col gap-3 rounded-xl border border-gray-100 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-medium">{eventItem.title}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(eventItem.date)} · {eventItem.location}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-gray-100 px-2 py-1">
                      {eventItem.category}
                    </span>
                    <span
                      className={`rounded-full px-2 py-1 ${
                        eventItem.isPublished
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {eventItem.isPublished ? "Published" : "Draft"}
                    </span>
                    {eventItem.isFeatured ? (
                      <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">
                        Featured
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(eventItem)}
                    className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => void handleDelete(eventItem.id)}
                    disabled={deleteEventMutation.isPending}
                    className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm text-red-500 hover:bg-red-50 disabled:opacity-60"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
