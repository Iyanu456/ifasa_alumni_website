"use client";

import { useMemo, useState } from "react";
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
  socialLinks: { instagram: "", linkedin: "", twitter: "" },
  //donationLink: "",
  donationAccountNumber: "",
  donationBankName: "",
  footerText: "",
  accountName: "",
  allowRegistrations: true,
  enableDonations: true,
};

export default function SettingsTab() {
  const settingsQuery = useAdminSettingsQuery();
  const { updateSettingsMutation } = useAppMutations();
  const [draft, setDraft] = useState<Settings | null>(null);
  const [saved, setSaved] = useState(false);

  const settings = useMemo(() => {
    const fetched = settingsQuery.data?.data.settings;
    const base = fetched
      ? {
          ...defaultSettings,
          ...fetched,
          socialLinks: { ...defaultSettings.socialLinks, ...fetched.socialLinks },
        }
      : defaultSettings;

    return draft || base;
  }, [draft, settingsQuery.data]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    const source = draft || settings;

    if (["instagram", "linkedin", "twitter"].includes(name)) {
      setDraft({
        ...source,
        socialLinks: {
          ...source.socialLinks,
          [name]: value,
        },
      });
      return;
    }

    setDraft({
      ...source,
      [name]: value,
    });
  };

  const handleToggle = (name: "allowRegistrations" | "enableDonations") => {
    const source = draft || settings;
    setDraft({
      ...source,
      [name]: !source[name],
    });
  };

  const handleSave = async () => {
    setSaved(false);
    await updateSettingsMutation.mutateAsync(settings);
    setDraft(null);
    setSaved(true);
  };

  if (settingsQuery.isLoading) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
        Loading settings...
      </div>
    );
  }

  if (settingsQuery.error) {
    return (
      <div className="rounded-2xl border border-dashed border-red-200 bg-red-50 p-10 text-center text-sm text-red-500">
        We could not load settings.
      </div>
    );
  }

  return (
    <>
      <div>
        <h1 className="text-lg font-semibold md:text-2xl">Settings</h1>
        <p className="mb-4 text-sm text-gray-500">
          Manage platform configuration and public contact details.
        </p>
      </div>

      {updateSettingsMutation.error ? (
        <p className="mb-4 text-sm text-red-500">
          {getApiErrorMessage(updateSettingsMutation.error, "We could not save the settings.")}
        </p>
      ) : null}

      {saved ? <p className="mb-4 text-sm text-green-600">Settings saved successfully.</p> : null}

      <section className="flex h-[fit-content] flex-col gap-3 lg:grid lg:grid-cols-2">
        <section className="space-y-6">
          <div className="space-y-4 rounded-xl border border-gray-100 bg-white p-6">
            <h2 className="font-semibold">Site Information</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <input name="siteName" value={settings.siteName} onChange={handleChange} className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
              <input name="contactEmail" value={settings.contactEmail} onChange={handleChange} className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
              <input name="contactPhone" value={settings.contactPhone} onChange={handleChange} className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
              <input name="contactAddress" value={settings.contactAddress} onChange={handleChange} className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
            <textarea name="siteDescription" rows={3} value={settings.siteDescription} onChange={handleChange} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
          </div>

          <div className="space-y-4 rounded-xl border border-gray-100 bg-white p-6">
            <h2 className="font-semibold">Social Links</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <input name="instagram" value={settings.socialLinks.instagram || ""} onChange={handleChange} placeholder="Instagram URL" className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
              <input name="linkedin" value={settings.socialLinks.linkedin || ""} onChange={handleChange} placeholder="LinkedIn URL" className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
              <input name="twitter" value={settings.socialLinks.twitter || ""} onChange={handleChange} placeholder="Twitter URL" className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
          </div>
        </section>

        <section className="flex flex-col md:grid gap-4">
          <div className="space-y-4 rounded-xl border border-gray-100 bg-white p-6">
            <h2 className="font-semibold">Donation Settings</h2>
            <input name="accountName" value={settings.accountName || ""} onChange={handleChange} placeholder="Account name" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
            <div className="grid gap-4 md:grid-cols-2">
              <input name="donationAccountNumber" value={settings.donationAccountNumber || ""} onChange={handleChange} placeholder="Donation account number" className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
              <input name="donationBankName" value={settings.donationBankName || ""} onChange={handleChange} placeholder="Bank name" className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
          </div>

          <div className="space-y-4 rounded-xl border border-gray-100 bg-white p-6">
            <h2 className="font-semibold">Footer Content</h2>
            <textarea name="footerText" rows={3} value={settings.footerText || ""} onChange={handleChange} placeholder="Footer text" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
          </div>

          <div className="space-y-4 rounded-xl border border-gray-100 bg-white p-6">
            <h2 className="font-semibold">Platform Controls</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Allow Alumni Registration</p>
                <p className="text-xs text-gray-500">Enable new alumni to sign up.</p>
              </div>
              <button onClick={() => handleToggle("allowRegistrations")} className={`relative h-6 w-12 rounded-full transition ${settings.allowRegistrations ? "bg-primary" : "bg-gray-300"}`}>
                <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${settings.allowRegistrations ? "left-7" : "left-1"}`} />
              </button>
            </div>
            {/*<div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Enable Donations</p>
                <p className="text-xs text-gray-500">Allow alumni to donate on the platform.</p>
              </div>
              <button onClick={() => handleToggle("enableDonations")} className={`relative h-6 w-12 rounded-full transition ${settings.enableDonations ? "bg-primary" : "bg-gray-300"}`}>
                <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${settings.enableDonations ? "left-7" : "left-1"}`} />
              </button>
            </div>*/}
          </div>

          <div className="mb-[5em] flex w-full justify-end">
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
  );
}
