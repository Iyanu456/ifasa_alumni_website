"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { request } from "./requests";
import { TokenService } from "./token-service";
import { useStore } from "../lib/store";
import type {
  ContactBody,
  Donation,
  DonationBody,
  EventFormBody,
  GalleryFormBody,
  LoginBody,
  NewsFormBody,
  OpportunityFormBody,
  ProfileUpdateBody,
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
  const { setUser, user } = useStore();

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

  const googleCallbackMutation = useMutation({
    mutationFn: ({code, state}:{code: string; state: string}) => request.googleCallback({code, state}),
    onSuccess: (response) => {
      TokenService.setCookie(response.data.token);
      setUser(response.data.user);
    },
  });


  const updateOwnProfileMutation = useMutation({
    mutationFn: (data: ProfileUpdateBody) => request.updateOwnProfile(data),
    onSuccess: (response) => {
      setUser(response.data.user);
      queryClient.invalidateQueries({ queryKey: ["auth", "profile"] });
      queryClient.invalidateQueries({ queryKey: ["alumni"] });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donations", "summary"] });
      queryClient.invalidateQueries({ queryKey: ["donations", "admin"] });
    },
  });

  const createEventMutation = useMutation({
    mutationFn: ({ data, image }: { data: EventFormBody; image?: File | null }) =>
      request.createEvent(data, image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: (id: string) => request.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["opportunities"] });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["opportunities"] });
    },
  });

  const deleteOpportunityMutation = useMutation({
    mutationFn: (id: string) => request.deleteOpportunity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["opportunities"] });
    },
  });

  const createNewsMutation = useMutation({
    mutationFn: ({ data, image }: { data: NewsFormBody; image?: File | null }) =>
      request.createNews(data, image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
  });

  const deleteNewsMutation = useMutation({
    mutationFn: (id: string) => request.deleteNews(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });

  const approveAlumnusMutation = useMutation({
    mutationFn: (id: string) => request.approveAlumnus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alumni"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });

  const updateAlumnusMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      request.updateAlumnus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alumni"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });

  const deleteAlumnusMutation = useMutation({
    mutationFn: (id: string) => request.deleteAlumnus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alumni"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });

  const makeAdminMutation = useMutation({
    mutationFn: (id: string) => request.makeAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["alumni"] });
    },
  });

  const removeAdminMutation = useMutation({
    mutationFn: (id: string) => request.removeAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["alumni"] });
    },
  });

  const updateDonationStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Donation["status"] }) =>
      request.updateDonationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donations"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "admin"] });
    },
  });

  return {
    loginMutation,
    registerMutation,
    verifyEmailMutation,
    resendVerificationEmailMutation,
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
    approveAlumnusMutation,
    updateAlumnusMutation,
    deleteAlumnusMutation,
    makeAdminMutation,
    removeAdminMutation,
    updateDonationStatusMutation,
  };
};
