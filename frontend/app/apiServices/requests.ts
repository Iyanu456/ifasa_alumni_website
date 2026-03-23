import { crudRequest } from "./crud-requests";
import {
  ADMIN_ENDPOINTS,
  ALUMNI_ENDPOINTS,
  AUTH_ENDPOINTS,
  DASHBOARD_ENDPOINTS,
  DONATION_ENDPOINTS,
  EVENT_ENDPOINTS,
  GALLERY_ENDPOINTS,
  INQUIRY_ENDPOINTS,
  NEWS_ENDPOINTS,
  OPPORTUNITY_ENDPOINTS,
  SETTINGS_ENDPOINTS,
  EXECUTIVE_ENDPOINTS,
} from "./routes";
import type {
  AdminDashboardData,
  AdminAlumniFormBody,
  ApiResponse,
  ContactBody,
  ContactMessage,
  Donation,
  DonationBody,
  DonationSummary,
  Event,
  Executive,
  ExecutiveFormBody,
  EventFormBody,
  GalleryFormBody,
  GalleryItem,
  HomeDashboardData,
  LoginBody,
  NewsFormBody,
  NewsItem,
  Opportunity,
  OpportunityFormBody,
  PaginatedApiResponse,
  ProfileUpdatePayload,
  RegisterBody,
  Settings,
  Sponsorship,
  SponsorshipBody,
  User,
  UsersFilter,
  AuthPayload,
} from "../types/types";

const buildQueryString = (params?: Record<string, unknown>) => {
  if (!params) {
    return "";
  }

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== "" &&
      value !== "All"
    ) {
      searchParams.set(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
};

const appendQuery = (url: string, params?: Record<string, unknown>) =>
  `${url}${buildQueryString(params)}`;

const createFormData = (
  payload: Record<string, unknown>,
  fileFields: Record<string, File | null | undefined> = {},
) => {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    if (Array.isArray(value)) {
      formData.append(key, value.join(","));
      return;
    }

    formData.append(key, String(value));
  });

  Object.entries(fileFields).forEach(([key, value]) => {
    if (value) {
      formData.append(key, value);
    }
  });

  return formData;
};

export const request = {
  register: async (data: RegisterBody): Promise<ApiResponse<{ user: User }>> => {
    const response = await crudRequest.POST<RegisterBody, ApiResponse<{ user: User }>>(
      AUTH_ENDPOINTS.REGISTER,
      data,
    );
    return response.data;
  },

  login: async (data: LoginBody): Promise<ApiResponse<AuthPayload>> => {
    const response = await crudRequest.POST<LoginBody, ApiResponse<AuthPayload>>(
      AUTH_ENDPOINTS.LOGIN,
      data,
    );
    return response.data;
  },

  getGoogleAuthUrl: async (redirectUri?: string) => {
    const response = await crudRequest.GET<
      ApiResponse<{ url: string; redirectUri: string; responseMode: string }>
    >(appendQuery(AUTH_ENDPOINTS.GOOGLE_INITIATE, { redirectUri }));
    return response.data;
  },

  resendVerification: async (email: string) => {
    const response = await crudRequest.POST<
      { email: string },
      ApiResponse<{ sent: boolean; expiresAt: string; previewUrl?: string | null }>
    >(AUTH_ENDPOINTS.RESEND_VERIFICATION, { email });
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await crudRequest.POST<
      { email: string },
      ApiResponse<{ sent: boolean; expiresAt?: string; previewUrl?: string | null }>
    >(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
    return response.data;
  },

  resetPassword: async (token: string, password: string) => {
    const response = await crudRequest.POST<
      { password: string },
      ApiResponse<AuthPayload>
    >(AUTH_ENDPOINTS.RESET_PASSWORD(token), { password });
    return response.data;
  },

  verifyEmail: async (token: string) => {
    const response = await crudRequest.GET<ApiResponse<{ token: string; user: User }>>(
      AUTH_ENDPOINTS.VERIFY_EMAIL(token),
    );
    return response.data;
  },

  googleCallback: async ({code, state}: {code: string; state: string}) => {
    const response = await crudRequest.GET<ApiResponse<{ 
      token: string;
      user: User; 
      isProfileComplete: boolean; requiresProfileCompletion: boolean
    }>>(
      `${AUTH_ENDPOINTS.GOOGLE_CALLBACK}?code=${code}&state=${state}`
    );
    return response.data
  },

  getOwnProfile: async () => {
    const response = await crudRequest.GET<
      ApiResponse<{ user: User; isProfileComplete: boolean }>
    >(AUTH_ENDPOINTS.PROFILE);
    return response.data;
  },

  updateOwnProfile: async (data: ProfileUpdatePayload) => {
    const formData = createFormData(data as unknown as Record<string, unknown>, {
      avatar: data.avatar,
    });
    const response = await crudRequest.POST<
      FormData,
      ApiResponse<{ user: User; isProfileComplete: boolean }>
    >(AUTH_ENDPOINTS.PROFILE, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  getHomeDashboard: async () => {
    const response = await crudRequest.GET<ApiResponse<HomeDashboardData>>(
      DASHBOARD_ENDPOINTS.HOME,
    );
    return response.data;
  },

  getAdminDashboard: async () => {
    const response = await crudRequest.GET<ApiResponse<AdminDashboardData>>(
      DASHBOARD_ENDPOINTS.ADMIN,
    );
    return response.data;
  },

  getPublicAlumni: async (params?: Record<string, unknown>) => {
    const response = await crudRequest.GET<PaginatedApiResponse<User>>(
      appendQuery(ALUMNI_ENDPOINTS.PUBLIC, params),
    );
    return response.data;
  },

  getExecutives: async () => {
    const response = await crudRequest.GET<ApiResponse<{ executives: Executive[] }>>(
      EXECUTIVE_ENDPOINTS.PUBLIC,
    );
    return response.data;
  },

  getAdminExecutives: async (params?: Record<string, unknown>) => {
    const response = await crudRequest.GET<PaginatedApiResponse<Executive>>(
      appendQuery(EXECUTIVE_ENDPOINTS.ADMIN, params),
    );
    return response.data;
  },

  getExecutiveById: async (id: string) => {
    const response = await crudRequest.GET<ApiResponse<{ executive: Executive }>>(
      EXECUTIVE_ENDPOINTS.DETAIL(id),
    );
    return response.data;
  },

  getAdminAlumni: async (params?: Record<string, unknown>) => {
    const response = await crudRequest.GET<PaginatedApiResponse<User>>(
      appendQuery(ALUMNI_ENDPOINTS.ADMIN, params),
    );
    return response.data;
  },

  createAlumnus: async (data: AdminAlumniFormBody) => {
    const response = await crudRequest.POST<
      AdminAlumniFormBody,
      ApiResponse<{ alumnus: User }>
    >(ALUMNI_ENDPOINTS.ADMIN, data);
    return response.data;
  },

  getAdminAlumnus: async (id: string) => {
    const response = await crudRequest.GET<ApiResponse<{ alumnus: User }>>(
      ALUMNI_ENDPOINTS.ADMIN_DETAIL(id),
    );
    return response.data;
  },

  getPublicAlumnus: async (id: string) => {
    const response = await crudRequest.GET<ApiResponse<{ alumnus: User }>>(
      ALUMNI_ENDPOINTS.DETAIL(id),
    );
    return response.data;
  },

  approveAlumnus: async (id: string) => {
    const response = await crudRequest.PATCH<undefined, ApiResponse<{ alumnus: User }>>(
      ALUMNI_ENDPOINTS.APPROVE(id),
    );
    return response.data;
  },

  updateAlumnus: async (id: string, data: Partial<User>) => {
    const response = await crudRequest.PATCH<
      Partial<User>,
      ApiResponse<{ alumnus: User }>
    >(ALUMNI_ENDPOINTS.DETAIL(id), data);
    return response.data;
  },

  deleteAlumnus: async (id: string) => {
    const response = await crudRequest.DELETE<ApiResponse<{ alumnus: User }>>(
      ALUMNI_ENDPOINTS.DETAIL(id),
    );
    return response.data;
  },

  getEvents: async (params?: Record<string, unknown>) => {
    const response = await crudRequest.GET<PaginatedApiResponse<Event>>(
      appendQuery(EVENT_ENDPOINTS.PUBLIC, params),
    );
    return response.data;
  },

  getAdminEvents: async (params?: Record<string, unknown>) => {
    const response = await crudRequest.GET<PaginatedApiResponse<Event>>(
      appendQuery(EVENT_ENDPOINTS.ADMIN, params),
    );
    return response.data;
  },

  getEventById: async (id: string) => {
    const response = await crudRequest.GET<ApiResponse<{ event: Event }>>(
      EVENT_ENDPOINTS.DETAIL(id),
    );
    return response.data;
  },

  createEvent: async (data: EventFormBody, image?: File | null) => {
    const formData = createFormData(data as Record<string, unknown>, { image });
    const response = await crudRequest.POST<FormData, ApiResponse<{ event: Event }>>(
      EVENT_ENDPOINTS.PUBLIC,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  },

  updateEvent: async (id: string, data: Partial<EventFormBody>, image?: File | null) => {
    const formData = createFormData(data as Record<string, unknown>, { image });
    const response = await crudRequest.PATCH<FormData, ApiResponse<{ event: Event }>>(
      EVENT_ENDPOINTS.DETAIL(id),
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  },

  deleteEvent: async (id: string) => {
    const response = await crudRequest.DELETE<ApiResponse<{ event: Event }>>(
      EVENT_ENDPOINTS.DETAIL(id),
    );
    return response.data;
  },

  getOpportunities: async (params?: Record<string, unknown>) => {
    const response = await crudRequest.GET<PaginatedApiResponse<Opportunity>>(
      appendQuery(OPPORTUNITY_ENDPOINTS.PUBLIC, params),
    );
    return response.data;
  },

  getAdminOpportunities: async (params?: Record<string, unknown>) => {
    const response = await crudRequest.GET<PaginatedApiResponse<Opportunity>>(
      appendQuery(OPPORTUNITY_ENDPOINTS.ADMIN, params),
    );
    return response.data;
  },

  getOpportunityById: async (id: string) => {
    const response = await crudRequest.GET<
      ApiResponse<{ opportunity: Opportunity }>
    >(OPPORTUNITY_ENDPOINTS.DETAIL(id));
    return response.data;
  },

  createOpportunity: async (
    data: OpportunityFormBody,
    image?: File | null,
  ) => {
    const formData = createFormData(data as Record<string, unknown>, { image });
    const response = await crudRequest.POST<
      FormData,
      ApiResponse<{ opportunity: Opportunity }>
    >(OPPORTUNITY_ENDPOINTS.PUBLIC, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  updateOpportunity: async (
    id: string,
    data: Partial<OpportunityFormBody>,
    image?: File | null,
  ) => {
    const formData = createFormData(data as Record<string, unknown>, { image });
    const response = await crudRequest.PATCH<
      FormData,
      ApiResponse<{ opportunity: Opportunity }>
    >(OPPORTUNITY_ENDPOINTS.DETAIL(id), formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  deleteOpportunity: async (id: string) => {
    const response = await crudRequest.DELETE<
      ApiResponse<{ opportunity: Opportunity }>
    >(OPPORTUNITY_ENDPOINTS.DETAIL(id));
    return response.data;
  },

  getNews: async (params?: Record<string, unknown>) => {
    const response = await crudRequest.GET<PaginatedApiResponse<NewsItem>>(
      appendQuery(NEWS_ENDPOINTS.PUBLIC, params),
    );
    return response.data;
  },

  getAdminNews: async (params?: Record<string, unknown>) => {
    const response = await crudRequest.GET<PaginatedApiResponse<NewsItem>>(
      appendQuery(NEWS_ENDPOINTS.ADMIN, params),
    );
    return response.data;
  },

  getNewsById: async (id: string) => {
    const response = await crudRequest.GET<ApiResponse<{ news: NewsItem }>>(
      NEWS_ENDPOINTS.DETAIL(id),
    );
    return response.data;
  },

  createNews: async (data: NewsFormBody, image?: File | null) => {
    const formData = createFormData(data as Record<string, unknown>, { image });
    const response = await crudRequest.POST<FormData, ApiResponse<{ news: NewsItem }>>(
      NEWS_ENDPOINTS.PUBLIC,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  },

  updateNews: async (id: string, data: Partial<NewsFormBody>, image?: File | null) => {
    const formData = createFormData(data as Record<string, unknown>, { image });
    const response = await crudRequest.PATCH<FormData, ApiResponse<{ news: NewsItem }>>(
      NEWS_ENDPOINTS.DETAIL(id),
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  },

  deleteNews: async (id: string) => {
    const response = await crudRequest.DELETE<ApiResponse<{ news: NewsItem }>>(
      NEWS_ENDPOINTS.DETAIL(id),
    );
    return response.data;
  },

  getGallery: async (params?: Record<string, unknown>) => {
    const response = await crudRequest.GET<PaginatedApiResponse<GalleryItem>>(
      appendQuery(GALLERY_ENDPOINTS.PUBLIC, params),
    );
    return response.data;
  },

  getAdminGallery: async (params?: Record<string, unknown>) => {
    const response = await crudRequest.GET<PaginatedApiResponse<GalleryItem>>(
      appendQuery(GALLERY_ENDPOINTS.ADMIN, params),
    );
    return response.data;
  },

  createGalleryItem: async (data: GalleryFormBody, image: File) => {
    const formData = createFormData(data as Record<string, unknown>, { image });
    const response = await crudRequest.POST<FormData, ApiResponse<{ item: GalleryItem }>>(
      GALLERY_ENDPOINTS.PUBLIC,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  },

  updateGalleryItem: async (
    id: string,
    data: Partial<GalleryFormBody>,
    image?: File | null,
  ) => {
    const formData = createFormData(data as Record<string, unknown>, { image });
    const response = await crudRequest.PATCH<FormData, ApiResponse<{ item: GalleryItem }>>(
      GALLERY_ENDPOINTS.DETAIL(id),
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  },

  deleteGalleryItem: async (id: string) => {
    const response = await crudRequest.DELETE<ApiResponse<{ item: GalleryItem }>>(
      GALLERY_ENDPOINTS.DETAIL(id),
    );
    return response.data;
  },

  getDonationSummary: async () => {
    const response = await crudRequest.GET<ApiResponse<DonationSummary>>(
      DONATION_ENDPOINTS.SUMMARY,
    );
    return response.data;
  },

  createDonation: async (data: DonationBody) => {
    const response = await crudRequest.POST<
      DonationBody,
      ApiResponse<{ donation: Donation; checkoutUrl?: string | null }>
    >(DONATION_ENDPOINTS.CREATE, data);
    return response.data;
  },

  getAdminDonations: async (params?: Record<string, unknown>) => {
    const response = await crudRequest.GET<PaginatedApiResponse<Donation>>(
      appendQuery(DONATION_ENDPOINTS.ADMIN, params),
    );
    return response.data;
  },

  updateDonationStatus: async (
    id: string,
    status: Donation["status"],
  ) => {
    const response = await crudRequest.PATCH<
      { status: Donation["status"] },
      ApiResponse<{ donation: Donation }>
    >(DONATION_ENDPOINTS.STATUS(id), { status });
    return response.data;
  },

  createContactMessage: async (data: ContactBody) => {
    const response = await crudRequest.POST<
      ContactBody,
      ApiResponse<{ message: ContactMessage }>
    >(INQUIRY_ENDPOINTS.CONTACT, data);
    return response.data;
  },

  getAdminContactMessages: async (params?: Record<string, unknown>) => {
    const response = await crudRequest.GET<PaginatedApiResponse<ContactMessage>>(
      appendQuery(INQUIRY_ENDPOINTS.CONTACT, params),
    );
    return response.data;
  },

  createSponsorship: async (data: SponsorshipBody) => {
    const response = await crudRequest.POST<
      SponsorshipBody,
      ApiResponse<{ sponsorship: Sponsorship }>
    >(INQUIRY_ENDPOINTS.SPONSORSHIPS, data);
    return response.data;
  },

  getAdminSponsorships: async (params?: Record<string, unknown>) => {
    const response = await crudRequest.GET<PaginatedApiResponse<Sponsorship>>(
      appendQuery(INQUIRY_ENDPOINTS.SPONSORSHIPS, params),
    );
    return response.data;
  },

  getPublicSettings: async () => {
    const response = await crudRequest.GET<ApiResponse<{ settings: Settings }>>(
      SETTINGS_ENDPOINTS.PUBLIC,
    );
    return response.data;
  },

  getAdminSettings: async () => {
    const response = await crudRequest.GET<ApiResponse<{ settings: Settings }>>(
      SETTINGS_ENDPOINTS.ADMIN,
    );
    return response.data;
  },

  updateSettings: async (data: Partial<Settings>) => {
    const response = await crudRequest.PATCH<
      Partial<Settings>,
      ApiResponse<{ settings: Settings }>
    >(SETTINGS_ENDPOINTS.ADMIN, data);
    return response.data;
  },

  createExecutive: async (data: ExecutiveFormBody, image?: File | null) => {
    const formData = createFormData(data as Record<string, unknown>, {
      profilePicture: image,
    });
    const response = await crudRequest.POST<FormData, ApiResponse<{ executive: Executive }>>(
      EXECUTIVE_ENDPOINTS.PUBLIC,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  },

  updateExecutive: async (
    id: string,
    data: Partial<ExecutiveFormBody>,
    image?: File | null,
  ) => {
    const formData = createFormData(data as Record<string, unknown>, {
      profilePicture: image,
    });
    const response = await crudRequest.PATCH<FormData, ApiResponse<{ executive: Executive }>>(
      EXECUTIVE_ENDPOINTS.DETAIL(id),
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  },

  deleteExecutive: async (id: string) => {
    const response = await crudRequest.DELETE<ApiResponse<{ executive: Executive }>>(
      EXECUTIVE_ENDPOINTS.DETAIL(id),
    );
    return response.data;
  },

  getAdminUsers: async (params?: UsersFilter) => {
    const response = await crudRequest.GET<PaginatedApiResponse<User>>(
      appendQuery(ADMIN_ENDPOINTS.USERS, params),
    );
    return response.data;
  },

  getAdminUser: async (id: string) => {
    const response = await crudRequest.GET<ApiResponse<{ user: User }>>(
      ADMIN_ENDPOINTS.USER_DETAIL(id),
    );
    return response.data;
  },

  makeAdmin: async (id: string) => {
    const response = await crudRequest.PATCH<undefined, ApiResponse<{ user: User }>>(
      ADMIN_ENDPOINTS.MAKE_ADMIN(id),
    );
    return response.data;
  },

  removeAdmin: async (id: string) => {
    const response = await crudRequest.PATCH<undefined, ApiResponse<{ user: User }>>(
      ADMIN_ENDPOINTS.REMOVE_ADMIN(id),
    );
    return response.data;
  },
};
