import { BASE_URL } from "./base-urls";

const API_V1 = `${BASE_URL}/api`;

export const AUTH_ENDPOINTS = {
  REGISTER: `${API_V1}/auth/register`,
  LOGIN: `${API_V1}/auth/login`,
  GOOGLE_INITIATE: `${API_V1}/auth/google/initiate`,
  GOOGLE_CALLBACK: `${API_V1}/auth/google/callback`,
  RESEND_VERIFICATION: `${API_V1}/auth/resend-verification`,
  VERIFY_EMAIL: (token: string) => `${API_V1}/auth/verify-email/${token}`,
  ME: `${API_V1}/auth/me`,
  PROFILE: `${API_V1}/users/profile`,
};

export const DASHBOARD_ENDPOINTS = {
  HOME: `${API_V1}/dashboard/home`,
  ADMIN: `${API_V1}/dashboard/admin`,
};

export const ALUMNI_ENDPOINTS = {
  PUBLIC: `${API_V1}/alumni`,
  EXECUTIVES: `${API_V1}/alumni/executives`,
  ADMIN: `${API_V1}/alumni/admin`,
  ADMIN_DETAIL: (id: string) => `${API_V1}/alumni/admin/${id}`,
  DETAIL: (id: string) => `${API_V1}/alumni/${id}`,
  APPROVE: (id: string) => `${API_V1}/alumni/${id}/approve`,
};

export const EVENT_ENDPOINTS = {
  PUBLIC: `${API_V1}/events`,
  ADMIN: `${API_V1}/events/admin`,
  DETAIL: (id: string) => `${API_V1}/events/${id}`,
};

export const OPPORTUNITY_ENDPOINTS = {
  PUBLIC: `${API_V1}/opportunities`,
  ADMIN: `${API_V1}/opportunities/admin`,
  DETAIL: (id: string) => `${API_V1}/opportunities/${id}`,
};

export const NEWS_ENDPOINTS = {
  PUBLIC: `${API_V1}/news`,
  ADMIN: `${API_V1}/news/admin`,
  DETAIL: (id: string) => `${API_V1}/news/${id}`,
};

export const GALLERY_ENDPOINTS = {
  PUBLIC: `${API_V1}/gallery`,
  ADMIN: `${API_V1}/gallery/admin`,
  DETAIL: (id: string) => `${API_V1}/gallery/${id}`,
};

export const DONATION_ENDPOINTS = {
  SUMMARY: `${API_V1}/donations/summary`,
  CREATE: `${API_V1}/donations`,
  ADMIN: `${API_V1}/donations/admin`,
  STATUS: (id: string) => `${API_V1}/donations/${id}/status`,
};

export const INQUIRY_ENDPOINTS = {
  CONTACT: `${API_V1}/inquiries/contact`,
  CONTACT_STATUS: (id: string) => `${API_V1}/inquiries/contact/${id}/status`,
  SPONSORSHIPS: `${API_V1}/inquiries/sponsorships`,
  SPONSORSHIP_STATUS: (id: string) =>
    `${API_V1}/inquiries/sponsorships/${id}/status`,
};

export const SETTINGS_ENDPOINTS = {
  PUBLIC: `${API_V1}/settings/public`,
  ADMIN: `${API_V1}/settings`,
};

export const ADMIN_ENDPOINTS = {
  USERS: `${API_V1}/admin/users`,
  USER_DETAIL: (id: string) => `${API_V1}/admin/users/${id}`,
  MAKE_ADMIN: (id: string) => `${API_V1}/admin/users/${id}/make-admin`,
  REMOVE_ADMIN: (id: string) => `${API_V1}/admin/users/${id}/remove-admin`,
};
