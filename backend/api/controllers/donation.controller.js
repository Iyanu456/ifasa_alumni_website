import { sendSuccess } from "../utils/response.js";
import { asyncHandler } from "../utils/async-handler.js";
import {
  createDonation,
  getDonationSummary,
  listDonations,
  updateDonationStatus,
} from "../services/donation.service.js";

export const createDonationController = asyncHandler(async (req, res) => {
  const result = await createDonation(req.body, req.user || null);

  return sendSuccess(res, {
    statusCode: 201,
    message: "Donation created successfully.",
    data: result,
  });
});

export const getDonationSummaryController = asyncHandler(async (_req, res) => {
  const summary = await getDonationSummary();

  return sendSuccess(res, {
    message: "Donation summary fetched successfully.",
    data: summary,
  });
});

export const getAdminDonationsController = asyncHandler(async (req, res) => {
  const result = await listDonations(req.query);

  return sendSuccess(res, {
    message: "Donations fetched successfully.",
    data: result.documents,
    meta: result.pagination,
  });
});

export const updateDonationStatusController = asyncHandler(async (req, res) => {
  const donation = await updateDonationStatus(req.params.id, req.body.status, req.user);

  return sendSuccess(res, {
    message: "Donation status updated successfully.",
    data: {
      donation,
    },
  });
});
