import Setting from "../models/setting.model.js";
import { logActivity } from "./activity.service.js";

const DEFAULT_SETTINGS = {
  key: "global",
  siteName: "IFASA Architecture Alumni",
  siteDescription: "A community of architects shaping the future.",
  contactEmail: "alumni.ife@oau.edu.ng",
  contactPhone: "+234 800 000 0000",
  contactAddress: "OAU Campus, Ile-Ife",
  socialLinks: {
    instagram: "",
    linkedin: "",
    twitter: "",
  },
  donationLink: "",
  donationAccountNumber: "",
  donationBankName: "",
  footerText:
    "Connecting alumni of the Department of Architecture, Obafemi Awolowo University.",
  allowRegistrations: true,
  enableDonations: true,
};

export const ensureDefaultSettings = async () =>
  Setting.findOneAndUpdate(
    { key: "global" },
    { $setOnInsert: DEFAULT_SETTINGS },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    },
  );

export const getSettings = async () => ensureDefaultSettings();

export const getPublicSettings = async () => {
  const settings = await ensureDefaultSettings();

  return {
    siteName: settings.siteName,
    siteDescription: settings.siteDescription,
    contactEmail: settings.contactEmail,
    contactPhone: settings.contactPhone,
    contactAddress: settings.contactAddress,
    socialLinks: settings.socialLinks,
    accountName: settings.accountName,
    donationAccountNumber: settings.donationAccountNumber,
    donationBankName: settings.donationBankName,
    footerText: settings.footerText,
    allowRegistrations: settings.allowRegistrations,
    enableDonations: settings.enableDonations,
  };
};

export const updateSettings = async (payload, actor) => {
  const settings = await ensureDefaultSettings();
  const socialLinks = payload.socialLinks || {};

  settings.siteName = payload.siteName ?? settings.siteName;
  settings.siteDescription = payload.siteDescription ?? settings.siteDescription;
  settings.contactEmail = payload.contactEmail ?? settings.contactEmail;
  settings.contactPhone = payload.contactPhone ?? settings.contactPhone;
  settings.contactAddress = payload.contactAddress ?? settings.contactAddress;
  settings.accountName = payload.accountName ?? settings.accountName;
  settings.donationAccountNumber =
    payload.donationAccountNumber ?? settings.donationAccountNumber;
  settings.donationBankName =
    payload.donationBankName ?? settings.donationBankName;
  settings.footerText = payload.footerText ?? settings.footerText;

  settings.socialLinks = {
    instagram:
      socialLinks.instagram ?? payload.instagram ?? settings.socialLinks.instagram,
    linkedin:
      socialLinks.linkedin ?? payload.linkedin ?? settings.socialLinks.linkedin,
    twitter: socialLinks.twitter ?? payload.twitter ?? settings.socialLinks.twitter,
  };

  if (typeof payload.allowRegistrations === "boolean") {
    settings.allowRegistrations = payload.allowRegistrations;
  }

  if (typeof payload.enableDonations === "boolean") {
    settings.enableDonations = payload.enableDonations;
  }

  await settings.save();

  await logActivity({
    actor,
    action: "settings.updated",
    entityType: "setting",
    entityId: settings._id,
    targetName: settings.siteName,
    description: "Platform settings updated.",
  });

  return settings;
};
