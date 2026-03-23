import { sendSuccess } from "../utils/response.js";
import { asyncHandler } from "../utils/async-handler.js";
import {
  createContactMessage,
  createSponsorship,
  listContactMessages,
  listSponsorships,
  updateContactStatus,
  updateSponsorshipStatus,
} from "../services/inquiry.service.js";

export const createContactMessageController = asyncHandler(async (req, res) => {
  const message = await createContactMessage(req.body);

  return sendSuccess(res, {
    statusCode: 201,
    message: "Message sent successfully.",
    data: {
      message,
    },
  });
});

export const listContactMessagesController = asyncHandler(async (req, res) => {
  const result = await listContactMessages(req.query);

  return sendSuccess(res, {
    message: "Contact messages fetched successfully.",
    data: result.documents,
    meta: result.pagination,
  });
});

export const updateContactStatusController = asyncHandler(async (req, res) => {
  const message = await updateContactStatus(req.params.id, req.body.status, req.user);

  return sendSuccess(res, {
    message: "Contact message status updated successfully.",
    data: {
      message,
    },
  });
});

export const createSponsorshipController = asyncHandler(async (req, res) => {
  const sponsorship = await createSponsorship(req.body);

  return sendSuccess(res, {
    statusCode: 201,
    message: "Sponsorship request submitted successfully.",
    data: {
      sponsorship,
    },
  });
});

export const listSponsorshipsController = asyncHandler(async (req, res) => {
  const result = await listSponsorships(req.query);

  return sendSuccess(res, {
    message: "Sponsorship requests fetched successfully.",
    data: result.documents,
    meta: result.pagination,
  });
});

export const updateSponsorshipStatusController = asyncHandler(async (req, res) => {
  const sponsorship = await updateSponsorshipStatus(req.params.id, req.body.status, req.user);

  return sendSuccess(res, {
    message: "Sponsorship status updated successfully.",
    data: {
      sponsorship,
    },
  });
});
