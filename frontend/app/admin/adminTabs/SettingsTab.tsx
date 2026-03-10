"use client";

import { useState } from "react";
import { Save } from "lucide-react";

export default function SettingsTab() {

const [settings, setSettings] = useState({
siteName: "IFASA Architecture Alumni",
siteDescription: "A community of architects shaping the future.",
contactEmail: "[admin@ifasaalumni.org](mailto:admin@ifasaalumni.org)",
instagram: "",
linkedin: "",
twitter: "",
donationLink: "",
allowRegistrations: true,
enableDonations: true,
});

const handleChange = (e: any) => {
setSettings({
...settings,
[e.target.name]: e.target.value,
});
};

const handleToggle = (name: string) => {
setSettings({
...settings,
[name]: !settings[name as keyof typeof settings],
});
};

return ( 



  
  <>
  {/* Header */}
  <div className="">
    <h1 className="text-2xl font-semibold">
      Settings
    </h1>

    <p className="text-sm text-gray-500 mb-4">
      Manage platform settings and configuration.
    </p>
  </div>

  {/* Site Info */}
  <section className="flex flex-col lg:grid grid-cols-2 gap-3 h-[fit-content]">
  <section className="space-y-6">
  <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-4">

    <h2 className="font-semibold">
      Site Information
    </h2>

    <div className="grid md:grid-cols-2 gap-4">

      <div className="space-y-1">
        <label className="text-sm font-medium">
          Site Name
        </label>

        <input
          name="siteName"
          value={settings.siteName}
          onChange={handleChange}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 mt-1.5"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">
          Contact Email
        </label>

        <input
          name="contactEmail"
          value={settings.contactEmail}
          onChange={handleChange}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 mt-1.5"
        />
      </div>

    </div>

    <div className="space-y-1">

      <label className="text-sm font-medium">
        Site Description
      </label>

      <textarea
        name="siteDescription"
        rows={3}
        value={settings.siteDescription}
        onChange={handleChange}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 mt-1.5"
      />

    </div>

  </div>

  {/* Social Links */}
  <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-4">

    <h2 className="font-semibold">
      Social Links
    </h2>

    <div className="grid md:grid-cols-3 gap-4">

      <input
        name="instagram"
        value={settings.instagram}
        onChange={handleChange}
        placeholder="Instagram URL"
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 mt-1.5"
      />

      <input
        name="linkedin"
        value={settings.linkedin}
        onChange={handleChange}
        placeholder="LinkedIn URL"
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 mt-1.5"
      />

      <input
        name="twitter"
        value={settings.twitter}
        onChange={handleChange}
        placeholder="Twitter URL"
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 mt-1.5"
      />

    </div>

  </div>
  <div className="hidden lg:flex justify-start w-full">

    <button className="flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-lg text-sm hover:opacity-90">
      <Save size={16} />
      Save Changes
    </button>

  </div>


  

  </section>

  <section className="flex flex-col md:grid h-[88%]">

    {/* Donations */}
  <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-4">

    <h2 className="font-semibold">
      Donation Settings
    </h2>

    <div className="space-y-1">

      <label className="text-sm font-medium">
        Donation Payment Link
      </label>

      <input
        name="donationLink"
        value={settings.donationLink}
        onChange={handleChange}
        placeholder="Paystack / Flutterwave link"
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 mt-1.5"
      />

    </div>

  </div>

  {/* Platform Controls */}
  <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-4 mt-1.5 ">

    <h2 className="font-semibold">
      Platform Controls
    </h2>

    <div className="flex items-center justify-between">

      <div>
        <p className="font-medium text-sm">
          Allow Alumni Registration
        </p>

        <p className="text-xs text-gray-500">
          Enable new alumni to sign up.
        </p>
      </div>

      <button
        onClick={() => handleToggle("allowRegistrations")}
        className={`w-12 h-6 rounded-full relative transition
          ${
            settings.allowRegistrations
              ? "bg-primary"
              : "bg-gray-300"
          }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition
            ${
              settings.allowRegistrations
                ? "left-7"
                : "left-1"
            }`}
        />
      </button>

    </div>

    <div className="flex items-center justify-between">

      <div>
        <p className="font-medium text-sm">
          Enable Donations
        </p>

        <p className="text-xs text-gray-500">
          Allow alumni to donate on the platform.
        </p>
      </div>

      <button
        onClick={() => handleToggle("enableDonations")}
        className={`w-12 h-6 rounded-full relative transition
          ${
            settings.enableDonations
              ? "bg-primary"
              : "bg-gray-300"
          }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition
            ${
              settings.enableDonations
                ? "left-7"
                : "left-1"
            }`}
        />
      </button>

    </div>

  </div>

  {/* Save */}
  <div className="lg:hidden flex justify-end w-full mt-4 mb-[5em]">

    <button className="flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-lg text-sm hover:opacity-90">
      <Save size={16} />
      Save Changes
    </button>

  </div>

  </section></section>
  </>



);
}
