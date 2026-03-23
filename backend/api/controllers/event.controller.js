import { buildFileUrl } from "../utils/file.js";
import { parseBoolean, parseDateValue } from "../utils/parsers.js";
import { sendSuccess } from "../utils/response.js";
import { asyncHandler } from "../utils/async-handler.js";
import {
  createEvent,
  deleteEvent,
  getEventByIdentifier,
  listAdminEvents,
  listPublicEvents,
  updateEvent,
} from "../services/event.service.js";

const buildEventPayload = (req) => ({
  title: req.body.title,
  category: req.body.category,
  date: parseDateValue(req.body.date),
  location: req.body.location,
  description: req.body.description,
  registrationLink: req.body.registrationLink || req.body.rsvp,
  isPublished: parseBoolean(req.body.isPublished),
  isFeatured: parseBoolean(req.body.isFeatured),
  coverImageUrl: req.file ? buildFileUrl(req, req.file) : undefined,
});

export const getPublicEvents = asyncHandler(async (req, res) => {
  const result = await listPublicEvents(req.query);

  return sendSuccess(res, {
    message: "Events fetched successfully.",
    data: result.documents,
    meta: result.pagination,
  });
});

export const getAdminEvents = asyncHandler(async (req, res) => {
  const result = await listAdminEvents(req.query);

  return sendSuccess(res, {
    message: "Admin events fetched successfully.",
    data: result.documents,
    meta: result.pagination,
  });
});

export const getEvent = asyncHandler(async (req, res) => {
  const event = await getEventByIdentifier(req.params.id, false);

  return sendSuccess(res, {
    message: "Event fetched successfully.",
    data: {
      event,
    },
  });
});

export const createEventController = asyncHandler(async (req, res) => {
  const event = await createEvent(buildEventPayload(req), req.user);

  return sendSuccess(res, {
    statusCode: 201,
    message: "Event created successfully.",
    data: {
      event,
    },
  });
});

export const updateEventController = asyncHandler(async (req, res) => {
  const event = await updateEvent(req.params.id, buildEventPayload(req), req.user);

  return sendSuccess(res, {
    message: "Event updated successfully.",
    data: {
      event,
    },
  });
});

export const deleteEventController = asyncHandler(async (req, res) => {
  const event = await deleteEvent(req.params.id, req.user);

  return sendSuccess(res, {
    message: "Event deleted successfully.",
    data: {
      event,
    },
  });
});
