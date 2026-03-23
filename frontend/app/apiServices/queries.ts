import { useQuery } from "@tanstack/react-query";
import { request } from "./requests";
import type { UsersFilter } from "../types/types";

export const useHomeDashboardQuery = () =>
  useQuery({
    queryKey: ["dashboard", "home"],
    queryFn: request.getHomeDashboard,
  });

export const useAdminDashboardQuery = () =>
  useQuery({
    queryKey: ["dashboard", "admin"],
    queryFn: request.getAdminDashboard,
  });

export const usePublicSettingsQuery = () =>
  useQuery({
    queryKey: ["settings", "public"],
    queryFn: request.getPublicSettings,
  });

export const useAdminSettingsQuery = () =>
  useQuery({
    queryKey: ["settings", "admin"],
    queryFn: request.getAdminSettings,
  });

export const usePublicAlumniQuery = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: ["alumni", "public", params],
    queryFn: () => request.getPublicAlumni(params),
  });

export const useExecutivesQuery = () =>
  useQuery({
    queryKey: ["alumni", "executives"],
    queryFn: request.getExecutives,
  });

export const useAdminAlumniQuery = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: ["alumni", "admin", params],
    queryFn: () => request.getAdminAlumni(params),
  });

export const useEventsQuery = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: ["events", params],
    queryFn: () => request.getEvents(params),
  });

export const useAdminEventsQuery = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: ["events", "admin", params],
    queryFn: () => request.getAdminEvents(params),
  });

export const useEventQuery = (id?: string) =>
  useQuery({
    queryKey: ["event", id],
    queryFn: () => request.getEventById(id!),
    enabled: Boolean(id),
  });

export const useOpportunitiesQuery = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: ["opportunities", params],
    queryFn: () => request.getOpportunities(params),
  });

export const useAdminOpportunitiesQuery = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: ["opportunities", "admin", params],
    queryFn: () => request.getAdminOpportunities(params),
  });

export const useOpportunityQuery = (id?: string) =>
  useQuery({
    queryKey: ["opportunity", id],
    queryFn: () => request.getOpportunityById(id!),
    enabled: Boolean(id),
  });

export const useNewsQuery = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: ["news", params],
    queryFn: () => request.getNews(params),
  });

export const useAdminNewsQuery = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: ["news", "admin", params],
    queryFn: () => request.getAdminNews(params),
  });

export const useGalleryQuery = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: ["gallery", params],
    queryFn: () => request.getGallery(params),
  });

export const useAdminGalleryQuery = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: ["gallery", "admin", params],
    queryFn: () => request.getAdminGallery(params),
  });

export const useDonationSummaryQuery = () =>
  useQuery({
    queryKey: ["donations", "summary"],
    queryFn: request.getDonationSummary,
  });

export const useAdminDonationsQuery = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: ["donations", "admin", params],
    queryFn: () => request.getAdminDonations(params),
  });

export const useAdminUsersQuery = (params?: UsersFilter) =>
  useQuery({
    queryKey: ["admin", "users", params],
    queryFn: () => request.getAdminUsers(params),
  });

export const useAdminUserQuery = (id?: string) =>
  useQuery({
    queryKey: ["admin", "user", id],
    queryFn: () => request.getAdminUser(id!),
    enabled: Boolean(id),
  });

export const useOwnProfileQuery = (enabled = true) =>
  useQuery({
    queryKey: ["auth", "profile"],
    queryFn: request.getOwnProfile,
    enabled,
  });
