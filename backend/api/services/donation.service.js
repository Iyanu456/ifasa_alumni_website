import mongoose from "mongoose";
import Donation from "../models/donation.model.js";
import ApiError from "../utils/api-error.js";
import { getSettings } from "./settings.service.js";
import { listDocuments } from "./query.service.js";
import { logActivity } from "./activity.service.js";

const createReference = () =>
  `DON-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;

const findDonation = async (id) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid donation identifier.", "INVALID_IDENTIFIER");
  }

  const donation = await Donation.findById(id);

  if (!donation) {
    throw new ApiError(404, "Donation not found.", "RESOURCE_NOT_FOUND");
  }

  return donation;
};

export const createDonation = async (payload, actor = null) => {
  const settings = await getSettings();

  if (!settings.enableDonations) {
    throw new ApiError(
      403,
      "Donations are currently disabled.",
      "DONATIONS_DISABLED",
    );
  }

  const donation = await Donation.create({
    donorName: payload.donorName || "Anonymous Donor",
    email: payload.email,
    amount: payload.amount,
    note: payload.note,
    reference: createReference(),
    donorUser: actor?._id,
    metadata: {
      checkoutUrl: settings.donationLink || null,
    },
  });

  await logActivity({
    actor,
    action: "donations.created",
    entityType: "donation",
    entityId: donation._id,
    targetName: donation.donorName,
    description: "Donation intent created.",
  });

  return {
    donation,
    checkoutUrl: settings.donationLink || null,
  };
};

export const listDonations = async (query) =>
  listDocuments({
    model: Donation,
    query,
    filter: query.status ? { status: query.status } : {},
    searchFields: ["donorName", "email", "reference"],
    allowedSortFields: ["amount", "createdAt", "paidAt", "donorName"],
    defaultSortField: "createdAt",
    defaultOrder: "desc",
  });

export const updateDonationStatus = async (id, status, actor) => {
  const donation = await findDonation(id);
  donation.status = status;
  donation.paidAt = status === "completed" ? new Date() : donation.paidAt;
  await donation.save();

  await logActivity({
    actor,
    action: "donations.updated",
    entityType: "donation",
    entityId: donation._id,
    targetName: donation.donorName,
    description: `Donation marked as ${status}.`,
  });

  return donation;
};

export const getDonationSummary = async () => {
  const [aggregate] = await Donation.aggregate([
    {
      $group: {
        _id: null,
        totalAmount: {
          $sum: {
            $cond: [{ $eq: ["$status", "completed"] }, "$amount", 0],
          },
        },
        totalDonations: { $sum: 1 },
        pendingDonations: {
          $sum: {
            $cond: [{ $eq: ["$status", "pending"] }, 1, 0],
          },
        },
      },
    },
  ]);

  return {
    totalAmount: aggregate?.totalAmount || 0,
    totalDonations: aggregate?.totalDonations || 0,
    pendingDonations: aggregate?.pendingDonations || 0,
    donorCount: aggregate?.totalDonations || 0,
  };
};
