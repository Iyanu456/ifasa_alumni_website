"use client";

import { useState } from "react";
import { Calendar, MapPin, Image as ImageIcon } from "lucide-react";

export default function EventsTab() {
  const [form, setForm] = useState({
    title: "",
    category: "",
    date: "",
    location: "",
    description: "",
    rsvp: "",
  });

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Event Data:", form);

    alert("Event created successfully (frontend only)");
  };

  return (
    <section className="w-full md:w-[90%]">

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Create Event</h1>
        <p className="text-sm text-gray-500">
          Add a new event for alumni and students.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-100 rounded-xl p-6 space-y-6"
      >
        <div className="grid md:grid-cols-2 gap-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Event Title
          </label>

          <input
            type="text"
            required
            placeholder="Alumni Networking Night"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Event Category
          </label>

          <select
            required
            value={form.category}
            onChange={(e) => updateField("category", e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-4 py-3 bg-white"
          >
            <option value="">Select category</option>
            <option>Networking</option>
            <option>Workshop</option>
            <option>Conference</option>
            <option>Meetup</option>
            <option>Seminar</option>
          </select>
        </div>

        </div>
        

        {/* Date + Location */}
        <div className="grid md:grid-cols-2 gap-4">

          <div>
            <label className="block text-sm font-medium mb-2">
              Event Date
            </label>

            <div className="flex items-center border border-gray-200 rounded-lg px-3">
              <Calendar size={16} className="text-gray-400 mr-2" />

              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => updateField("date", e.target.value)}
                className="w-full py-3 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Location
            </label>

            <div className="flex items-center border border-gray-200 rounded-lg px-3">
              <MapPin size={16} className="text-gray-400 mr-2" />

              <input
                type="text"
                required
                placeholder="Lagos, Nigeria"
                value={form.location}
                onChange={(e) => updateField("location", e.target.value)}
                className="w-full py-3 outline-none"
              />
            </div>
          </div>

        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Event Cover Image
          </label>

          <label className="flex items-center justify-center gap-2 border border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50">
            <ImageIcon size={18} />
            <span className="text-sm text-gray-500">
              Upload event image
            </span>

            <input
              type="file"
              className="hidden"
            />
          </label>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Event Description
          </label>

          <textarea
            rows={4}
            placeholder="Describe the event..."
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* RSVP */}
        <div>
          <label className="block text-sm font-medium mb-2">
            RSVP Link (optional)
          </label>

          <input
            type="url"
            placeholder="https://event-registration-link.com"
            value={form.rsvp}
            onChange={(e) => updateField("rsvp", e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-4 py-3"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">

          <button
            type="button"
            className="border border-gray-200 px-5 py-2 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90"
          >
            Create Event
          </button>

        </div>
      </form>
    </section>
  );
}