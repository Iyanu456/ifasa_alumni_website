"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { getApiErrorMessage, useAppMutations } from "../../apiServices/mutations";
import { useAdminSettingsQuery } from "../../apiServices/queries";
import type { Settings } from "../../types/types";

const defaultSettings: Settings = {
  siteName: "",
  siteDescription: "",
  contactEmail: "",
  contactPhone: "",
  contactAddress: "",
  socialLinks: {
    instagram: "",
    linkedin: "",
    twitter: "",
  },
  donationLink: "",
  allowRegistrations: true,
  enableDonations: true,
};

export default function SettingsTab() {
  const settingsQuery = useAdminSettingsQuery();
  const { updateSettingsMutation } = useAppMutations();
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchedSettings = settingsQuery.data?.data.settings;

    if (fetchedSettings) {
      setSettings({
        ...defaultSettings,
        ...fetchedSettings,
        socialLinks: {
          ...defaultSettings.socialLinks,
          ...fetchedSettings.socialLinks,
        },
      });
    }
  }, [settingsQuery.data]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;

    if (["instagram", "linkedin", "twitter"].includes(name)) {
      setSettings((current) => ({
        ...current,
        socialLinks: {
          ...current.socialLinks,
          [name]: value,
        },
      }));
      return;
    }

    setSettings((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleToggle = (name: "allowRegistrations" | "enableDonations") => {
    setSettings((current) => ({
      ...current,
      [name]: !current[name],
    }));
  };

  const handleSave = async () => {
    setSaved(false);

    await updateSettingsMutation.mutateAsync(settings);
    setSaved(true);
  };

  return (
    <>
      <div>
        <h1 className="text-lg font-semibold md:text-2xl">Settings</h1>
        <p className="mb-4 text-sm text-gray-500">
          Manage platform configuration and public contact details.
        </p>
      </div>

      {settingsQuery.isLoading ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
          Loading settings...
        </div>
      ) : settingsQuery.error ? (
        <div className="rounded-2xl border border-dashed border-red-200 bg-red-50 p-10 text-center text-sm text-red-500">
          We could not load settings.
        </div>
      ) : (
        <>
          {updateSettingsMutation.error ? (
            <p className="mb-4 text-sm text-red-500">
              {getApiErrorMessage(
                updateSettingsMutation.error,
                "We could not save the settings.",
              )}
            </p>
          ) : null}

          {saved ? (
            <p className="mb-4 text-sm text-green-600">
              Settings saved successfully.
            </p>
          ) : null}

          <section className="flex h-[fit-content] flex-col gap-3 lg:grid lg:grid-cols-2">
            <section className="space-y-6">
              <div className="space-y-4 rounded-xl border border-gray-100 bg-white p-6">
                <h2 className="font-semibold">Site Information</h2>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Site Name</label>
                    <input
                      name="siteName"
                      value={settings.siteName}
                      onChange={handleChange}
                      className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium">Contact Email</label>
                    <input
                      name="contactEmail"
                      value={settings.contactEmail}
                      onChange={handleChange}
                      className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium">Contact Phone</label>
                    <input
                      name="contactPhone"
                      value={settings.contactPhone}
                      onChange={handleChange}
                      className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium">Contact Address</label>
                    <input
                      name="contactAddress"
                      value={settings.contactAddress}
                      onChange={handleChange}
                      className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Site Description</label>
                  <textarea
                    name="siteDescription"
                    rows={3}
                    value={settings.siteDescription}
                    onChange={handleChange}
                    className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              <div className="space-y-4 rounded-xl border border-gray-100 bg-white p-6">
                <h2 className="font-semibold">Social Links</h2>

                <div className="grid gap-4 md:grid-cols-3">
                  <input
                    name="instagram"
                    value={settings.socialLinks.instagram || ""}
                    onChange={handleChange}
                    placeholder="Instagram URL"
                    className="mt-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                  />

                  <input
                    name="linkedin"
                    value={settings.socialLinks.linkedin || ""}
                    onChange={handleChange}
                    placeholder="LinkedIn URL"
                    className="mt-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                  />

                  <input
                    name="twitter"
                    value={settings.socialLinks.twitter || ""}
                    onChange={handleChange}
                    placeholder="Twitter URL"
                    className="mt-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              <div className="hidden w-full justify-start lg:flex">
                <button
                  onClick={() => void handleSave()}
                  disabled={updateSettingsMutation.isPending}
                  className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm text-white hover:opacity-90 disabled:opacity-60"
                >
                  <Save size={16} />
                  {updateSettingsMutation.isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </section>

            <section className="flex flex-col md:grid">
              <div className="space-y-4 rounded-xl border border-gray-100 bg-white p-6">
                <h2 className="font-semibold">Donation Settings</h2>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Donation Payment Link</label>
                  <input
                    name="donationLink"
                    value={settings.donationLink || ""}
                    onChange={handleChange}
                    placeholder="Paystack / Flutterwave link"
                    className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              <div className="mt-1.5 space-y-4 rounded-xl border border-gray-100 bg-white p-6">
                <h2 className="font-semibold">Platform Controls</h2>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Allow Alumni Registration</p>
                    <p className="text-xs text-gray-500">
                      Enable new alumni to sign up.
                    </p>
                  </div>

                  <button
                    onClick={() => handleToggle("allowRegistrations")}
                    className={`relative h-6 w-12 rounded-full transition ${
                      settings.allowRegistrations ? "bg-primary" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                        settings.allowRegistrations ? "left-7" : "left-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Enable Donations</p>
                    <p className="text-xs text-gray-500">
                      Allow alumni to donate on the platform.
                    </p>
                  </div>

                  <button
                    onClick={() => handleToggle("enableDonations")}
                    className={`relative h-6 w-12 rounded-full transition duration-300 ease-in ${
                      settings.enableDonations ? "bg-primary" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                        settings.enableDonations ? "left-7" : "left-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="mt-4 mb-[5em] flex w-full justify-end lg:hidden">
                <button
                  onClick={() => void handleSave()}
                  disabled={updateSettingsMutation.isPending}
                  className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm text-white hover:opacity-90 disabled:opacity-60"
                >
                  <Save size={16} />
                  {updateSettingsMutation.isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </section>
          </section>
        </>
      )}
    </>
  );
}
