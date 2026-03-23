import ContactMessage from "../models/contact-message.model.js";
import Sponsorship from "../models/sponsorship.model.js";
import ApiError from "../utils/api-error.js";
import { listDocuments } from "./query.service.js";
import { logActivity } from "./activity.service.js";

export const createContactMessage = async (payload) => {
  const message = await ContactMessage.create(payload);

  await logActivity({
    action: "contact.created",
    entityType: "contact",
    entityId: message._id,
    targetName: message.name,
    description: "Contact message submitted.",
  });

  return message;
};

export const listContactMessages = async (query) =>
  listDocuments({
    model: ContactMessage,
    query,
    filter: query.status ? { status: query.status } : {},
    searchFields: ["name", "email", "message"],
    allowedSortFields: ["createdAt", "updatedAt", "name"],
    defaultSortField: "createdAt",
    defaultOrder: "desc",
  });

export const updateContactStatus = async (id, status, actor) => {
  const message = await ContactMessage.findById(id);

  if (!message) {
    throw new ApiError(404, "Contact message not found.", "RESOURCE_NOT_FOUND");
  }

  message.status = status;
  await message.save();

  await logActivity({
    actor,
    action: "contact.updated",
    entityType: "contact",
    entityId: message._id,
    targetName: message.name,
    description: `Contact status changed to ${status}.`,
  });

  return message;
};

export const createSponsorship = async (payload) => {
  const sponsorship = await Sponsorship.create(payload);

  await logActivity({
    action: "sponsorship.created",
    entityType: "sponsorship",
    entityId: sponsorship._id,
    targetName: sponsorship.name,
    description: "Sponsorship request submitted.",
  });

  return sponsorship;
};

export const listSponsorships = async (query) =>
  listDocuments({
    model: Sponsorship,
    query,
    filter: query.status ? { status: query.status } : {},
    searchFields: ["name", "email", "organization", "message"],
    allowedSortFields: ["createdAt", "updatedAt", "name"],
    defaultSortField: "createdAt",
    defaultOrder: "desc",
  });

export const updateSponsorshipStatus = async (id, status, actor) => {
  const sponsorship = await Sponsorship.findById(id);

  if (!sponsorship) {
    throw new ApiError(404, "Sponsorship not found.", "RESOURCE_NOT_FOUND");
  }

  sponsorship.status = status;
  await sponsorship.save();

  await logActivity({
    actor,
    action: "sponsorship.updated",
    entityType: "sponsorship",
    entityId: sponsorship._id,
    targetName: sponsorship.name,
    description: `Sponsorship status changed to ${status}.`,
  });

  return sponsorship;
};
