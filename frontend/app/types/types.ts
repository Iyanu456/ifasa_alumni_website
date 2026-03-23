export type ApiError = {
  code?: string;
  details?: unknown;
  requestId?: string;
  stack?: string;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  error: ApiError | null;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PaginatedApiResponse<T> = ApiResponse<T[]> & {
  meta: PaginationMeta;
};

export type UserRole = "user" | "admin";
export type AuthProvider = "local" | "google";
export type ApprovalStatus = "pending" | "approved";

export type User = {
  _id: string;
  fullName: string;
  email: string;
  googleId?: string | null;
  authProvider: AuthProvider;
  isVerified: boolean;
  isProfileComplete: boolean;
  phone?: string | null;
  graduationYear?: string | null;
  degree?: string | null;
  specialization?: string | null;
  currentRole?: string | null;
  company?: string | null;
  location?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  role: UserRole | "alumnus";
  status: ApprovalStatus;
  consent?: boolean;
  associationRoleTitle?: string | null;
  isMentorAvailable?: boolean;
  isSpotlight?: boolean;
  spotlightQuote?: string | null;
  lastLoginAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type AuthPayload = {
  token: string;
  user: User;
  isProfileComplete: boolean;
  requiresProfileCompletion: boolean;
};

export type LoginBody = {
  email: string;
  password: string;
};

export type RegisterBody = {
  //fullName: string;
  email: string;
  password: string;
  //phone: string;
  //graduationYear: string;
  //degree: string;
  //specialization?: string;
  //currentRole?: string;
  //company?: string;
  //location?: string;
  //bio?: string;
  //consent: boolean;
};

export type ProfileUpdateBody = Omit<RegisterBody, "email" | "password">;

export type ProfileUpdatePayload = {
  fullName: string;
  phone: string;
  graduationYear: string;
  degree: string;
  specialization?: string;
  currentRole?: string;
  company?: string;
  location?: string;
  bio?: string;
  consent: boolean;
  avatar?: File | null;
};

export type AdminAlumniFormBody = {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  graduationYear: string;
  degree: string;
  specialization?: string;
  currentRole?: string;
  company?: string;
  location?: string;
  bio?: string;
  status?: ApprovalStatus;
  associationRoleTitle?: string;
  spotlightQuote?: string;
  isMentorAvailable?: boolean;
  isSpotlight?: boolean;
  consent?: boolean;
};

export type Settings = {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  socialLinks: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
  donationLink?: string;
  donationAccountNumber?: string;
  donationBankName?: string;
  footerText?: string;
  allowRegistrations: boolean;
  enableDonations: boolean;
};

export type Executive = {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string | null;
  role: string;
  position: string;
  title: string;
  sortOrder?: number;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type Event = {
  _id: string;
  title: string;
  slug: string;
  category: string;
  date: string;
  location: string;
  description: string;
  registrationLink?: string | null;
  coverImageUrl?: string | null;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type Opportunity = {
  _id: string;
  title: string;
  slug: string;
  organization: string;
  category: string;
  description: string;
  requirements: string[];
  location?: string | null;
  deadline?: string | null;
  applicationLink?: string | null;
  status: "open" | "closed";
  coverImageUrl?: string | null;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type NewsItem = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  tags: string[];
  status: "draft" | "published";
  publishedAt?: string | null;
  coverImageUrl?: string | null;
  authorName?: string | null;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type GalleryItem = {
  _id: string;
  title: string;
  imageUrl: string;
  altText?: string | null;
  category: string;
  capturedAt?: string | null;
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type Donation = {
  id: string;
  donorName: string;
  email?: string | null;
  amount: number;
  note?: string | null;
  reference: string;
  status: "pending" | "completed" | "failed";
  paidAt?: string | null;
  createdAt?: string;
};

export type DonationSummary = {
  totalAmount: number;
  totalDonations: number;
  pendingDonations: number;
  donorCount: number;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  status: "new" | "read" | "resolved";
  createdAt?: string;
};

export type Sponsorship = {
  id: string;
  name: string;
  email: string;
  organization?: string | null;
  message: string;
  status: "new" | "contacted" | "closed";
  createdAt?: string;
};

export type HomeDashboardData = {
  stats: {
    registeredAlumni: number;
    countriesRepresented: number;
    mentorsAvailable: number;
    activeEvents: number;
  };
  featuredEvents: Event[];
  featuredOpportunities: Opportunity[];
  spotlightAlumni: User[];
  latestNews: NewsItem[];
};

export type AdminDashboardData = {
  metrics: {
    registeredAlumni: number;
    upcomingEvents: number;
    activeOpportunities: number;
    donationsReceived: number;
  };
  recentActivities: ActivityLog[];
  latestOpportunities: Pick<Opportunity, "_id" | "title" | "organization" | "deadline">[];
};

export type ActivityLog = {
  id?: string;
  actorName?: string;
  action: string;
  entityType: string;
  targetName?: string;
  description?: string;
  createdAt?: string;
};

export type EventFormBody = {
  title: string;
  category: string;
  date: string;
  location: string;
  description: string;
  registrationLink?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
};

export type OpportunityFormBody = {
  title: string;
  organization: string;
  category: string;
  description: string;
  requirements?: string[] | string;
  location?: string;
  deadline?: string;
  applicationLink?: string;
  status?: "open" | "closed";
  isFeatured?: boolean;
};

export type NewsFormBody = {
  title: string;
  excerpt?: string;
  content: string;
  tags?: string[] | string;
  status?: "draft" | "published";
  isFeatured?: boolean;
};

export type ExecutiveFormBody = {
  name: string;
  email: string;
  role: string;
  position: string;
  title: string;
  sortOrder?: number;
  isPublished?: boolean;
};

export type GalleryFormBody = {
  title: string;
  altText?: string;
  category?: string;
  capturedAt?: string;
  isPublished?: boolean;
};

export type DonationBody = {
  amount: number;
  donorName?: string;
  email?: string;
  note?: string;
};

export type ContactBody = {
  name: string;
  email: string;
  message: string;
};

export type SponsorshipBody = {
  name: string;
  email: string;
  organization?: string;
  message: string;
};

export type UsersFilter = {
  search?: string;
  role?: "user" | "admin" | "alumnus";
  status?: ApprovalStatus;
  authProvider?: AuthProvider;
  isVerified?: boolean;
  isProfileComplete?: boolean;
  page?: number;
  limit?: number;
};
