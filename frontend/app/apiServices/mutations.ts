"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { request } from "./requests";
import { TokenService } from "./token-service";
import { useStore } from "../lib/store";
import type {
  AdminAlumniFormBody,
  ContactBody,
  Donation,
  DonationBody,
  ExecutiveFormBody,
  EventFormBody,
  GalleryFormBody,
  LoginBody,
  NewsFormBody,
  OpportunityFormBody,
  ProfileUpdatePayload,
  RegisterBody,
  Settings,
  SponsorshipBody,
  User,
} from "../types/types";

export const getApiErrorMessage = (error: unknown, fallback: string) => {
  const axiosError = error as AxiosError<{ message?: string }>;
  return axiosError.response?.data?.message || axiosError.message || fallback;
};

export const useAppMutations = () => {
  const queryClient = useQueryClient();
  const { setUser } = useStore();

  const invalidateHomeDashboard = () =>
    queryClient.invalidateQueries({ queryKey: ["dashboard", "home"] });

  const invalidateAdminDashboard = () =>
    queryClient.invalidateQueries({ queryKey: ["dashboard", "admin"] });

  const invalidatePublicSettings = () =>
    queryClient.invalidateQueries({ queryKey: ["settings", "public"] });

  const invalidateAdminSettings = () =>
    queryClient.invalidateQueries({ queryKey: ["settings", "admin"] });

  const invalidateAlumniQueries = async () => {
    await queryClient.invalidateQueries({ queryKey: ["alumni"] });
    await queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
  };

  const invalidateEventQueries = async () => {
    await queryClient.invalidateQueries({ queryKey: ["events"] });
    await invalidateHomeDashboard();
    await invalidateAdminDashboard();
  };

  const invalidateOpportunityQueries = async () => {
    await queryClient.invalidateQueries({ queryKey: ["opportunities"] });
    await invalidateHomeDashboard();
    await invalidateAdminDashboard();
  };

  const invalidateNewsQueries = async () => {
    await queryClient.invalidateQueries({ queryKey: ["news"] });
    await invalidateHomeDashboard();
  };

  const invalidateExecutiveQueries = async () => {
    await queryClient.invalidateQueries({ queryKey: ["executives"] });
  };

  const loginMutation = useMutation({
    mutationFn: (data: LoginBody) => request.login(data),
    onSuccess: (response) => {
      TokenService.setCookie(response.data.token);
      setUser(response.data.user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterBody) => request.register(data),
    onSuccess: (response) => {
      setUser(response.data.user);
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: (token: string) => request.verifyEmail(token),
    onSuccess: (response) => {
      TokenService.setCookie(response.data.token);
      setUser(response.data.user);
    },
    
  });

  const resendVerificationEmailMutation = useMutation({
    mutationFn: (email: string) => request.resendVerification(email),
    
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: (email: string) => request.forgotPassword(email),
  });

  const resetPasswordMutation = useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      request.resetPassword(token, password),
    onSuccess: (response) => {
      TokenService.setCookie(response.data.token);
      setUser(response.data.user);
    },
  });

  const googleCallbackMutation = useMutation({
    mutationFn: ({code, state}:{code: string; state: string}) => request.googleCallback({code, state}),
    onSuccess: (response) => {
      TokenService.setCookie(response.data.token);
      setUser(response.data.user);
    },
  });


  const updateOwnProfileMutation = useMutation({
    mutationFn: (data: ProfileUpdatePayload) => request.updateOwnProfile(data),
    onSuccess: async (response) => {
      setUser(response.data.user);
      await queryClient.invalidateQueries({ queryKey: ["auth", "profile"] });
      await invalidateAlumniQueries();
      await invalidateHomeDashboard();
      await invalidateAdminDashboard();
    },
  });

  
  const createContactMutation = useMutation({
    mutationFn: (data: ContactBody) => request.createContactMessage(data),
  });

  const createSponsorshipMutation = useMutation({
    mutationFn: (data: SponsorshipBody) => request.createSponsorship(data),
  });

  const createDonationMutation = useMutation({
    mutationFn: (data: DonationBody) => request.createDonation(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["donations", "summary"] });
      await queryClient.invalidateQueries({ queryKey: ["donations", "admin"] });
      await invalidateAdminDashboard();
    },
  });

  const createEventMutation = useMutation({
    mutationFn: ({ data, image }: { data: EventFormBody; image?: File | null }) =>
      request.createEvent(data, image),
    onSuccess: async () => {
      await invalidateEventQueries();
    },
  });

  const updateEventMutation = useMutation({
    mutationFn: ({
      id,
      data,
      image,
    }: {
      id: string;
      data: Partial<EventFormBody>;
      image?: File | null;
    }) => request.updateEvent(id, data, image),
    onSuccess: async () => {
      await invalidateEventQueries();
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: (id: string) => request.deleteEvent(id),
    onSuccess: async () => {
      await invalidateEventQueries();
    },
  });

  const createOpportunityMutation = useMutation({
    mutationFn: ({
      data,
      image,
    }: {
      data: OpportunityFormBody;
      image?: File | null;
    }) => request.createOpportunity(data, image),
    onSuccess: async () => {
      await invalidateOpportunityQueries();
    },
  });

  const updateOpportunityMutation = useMutation({
    mutationFn: ({
      id,
      data,
      image,
    }: {
      id: string;
      data: Partial<OpportunityFormBody>;
      image?: File | null;
    }) => request.updateOpportunity(id, data, image),
    onSuccess: async () => {
      await invalidateOpportunityQueries();
    },
  });

  const deleteOpportunityMutation = useMutation({
    mutationFn: (id: string) => request.deleteOpportunity(id),
    onSuccess: async () => {
      await invalidateOpportunityQueries();
    },
  });

  const createNewsMutation = useMutation({
    mutationFn: ({ data, image }: { data: NewsFormBody; image?: File | null }) =>
      request.createNews(data, image),
    onSuccess: async () => {
      await invalidateNewsQueries();
    },
  });

  const updateNewsMutation = useMutation({
    mutationFn: ({
      id,
      data,
      image,
    }: {
      id: string;
      data: Partial<NewsFormBody>;
      image?: File | null;
    }) => request.updateNews(id, data, image),
    onSuccess: async () => {
      await invalidateNewsQueries();
    },
  });

  const deleteNewsMutation = useMutation({
    mutationFn: (id: string) => request.deleteNews(id),
    onSuccess: async () => {
      await invalidateNewsQueries();
    },
  });

  const createGalleryMutation = useMutation({
    mutationFn: ({ data, image }: { data: GalleryFormBody; image: File }) =>
      request.createGalleryItem(data, image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
    },
  });

  const updateGalleryMutation = useMutation({
    mutationFn: ({
      id,
      data,
      image,
    }: {
      id: string;
      data: Partial<GalleryFormBody>;
      image?: File | null;
    }) => request.updateGalleryItem(id, data, image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
    },
  });

  const deleteGalleryMutation = useMutation({
    mutationFn: (id: string) => request.deleteGalleryItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (data: Partial<Settings>) => request.updateSettings(data),
    onSuccess: async () => {
      await invalidatePublicSettings();
      await invalidateAdminSettings();
    },
  });

  const createExecutiveMutation = useMutation({
    mutationFn: ({ data, image }: { data: ExecutiveFormBody; image?: File | null }) =>
      request.createExecutive(data, image),
    onSuccess: async () => {
      await invalidateExecutiveQueries();
    },
  });

  const updateExecutiveMutation = useMutation({
    mutationFn: ({
      id,
      data,
      image,
    }: {
      id: string;
      data: Partial<ExecutiveFormBody>;
      image?: File | null;
    }) => request.updateExecutive(id, data, image),
    onSuccess: async () => {
      await invalidateExecutiveQueries();
    },
  });

  const deleteExecutiveMutation = useMutation({
    mutationFn: (id: string) => request.deleteExecutive(id),
    onSuccess: async () => {
      await invalidateExecutiveQueries();
    },
  });

  const approveAlumnusMutation = useMutation({
    mutationFn: (id: string) => request.approveAlumnus(id),
    onSuccess: async () => {
      await invalidateAlumniQueries();
      await invalidateHomeDashboard();
      await invalidateAdminDashboard();
    },
  });

  const createAlumnusMutation = useMutation({
    mutationFn: (data: AdminAlumniFormBody) => request.createAlumnus(data),
    onSuccess: async () => {
      await invalidateAlumniQueries();
      await invalidateHomeDashboard();
      await invalidateAdminDashboard();
    },
  });

  const updateAlumnusMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      request.updateAlumnus(id, data),
    onSuccess: async () => {
      await invalidateAlumniQueries();
      await invalidateHomeDashboard();
      await invalidateAdminDashboard();
    },
  });

  const deleteAlumnusMutation = useMutation({
    mutationFn: (id: string) => request.deleteAlumnus(id),
    onSuccess: async () => {
      await invalidateAlumniQueries();
      await invalidateHomeDashboard();
      await invalidateAdminDashboard();
    },
  });

  const makeAdminMutation = useMutation({
    mutationFn: (id: string) => request.makeAdmin(id),
    onSuccess: async () => {
      await invalidateAlumniQueries();
      await invalidateHomeDashboard();
      await invalidateAdminDashboard();
    },
  });

  const removeAdminMutation = useMutation({
    mutationFn: (id: string) => request.removeAdmin(id),
    onSuccess: async () => {
      await invalidateAlumniQueries();
      await invalidateHomeDashboard();
      await invalidateAdminDashboard();
    },
  });

  const updateDonationStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Donation["status"] }) =>
      request.updateDonationStatus(id, status),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["donations"] });
      await queryClient.invalidateQueries({ queryKey: ["donations", "summary"] });
      await invalidateAdminDashboard();
    },
  });

  return {
    loginMutation,
    registerMutation,
    verifyEmailMutation,
    resendVerificationEmailMutation,
    forgotPasswordMutation,
    resetPasswordMutation,
    googleCallbackMutation,
    updateOwnProfileMutation,
    createContactMutation,
    createSponsorshipMutation,
    createDonationMutation,
    createEventMutation,
    updateEventMutation,
    deleteEventMutation,
    createOpportunityMutation,
    updateOpportunityMutation,
    deleteOpportunityMutation,
    createNewsMutation,
    updateNewsMutation,
    deleteNewsMutation,
    createGalleryMutation,
    updateGalleryMutation,
    deleteGalleryMutation,
    updateSettingsMutation,
    createExecutiveMutation,
    updateExecutiveMutation,
    deleteExecutiveMutation,
    approveAlumnusMutation,
    createAlumnusMutation,
    updateAlumnusMutation,
    deleteAlumnusMutation,
    makeAdminMutation,
    removeAdminMutation,
    updateDonationStatusMutation,
  };
};
