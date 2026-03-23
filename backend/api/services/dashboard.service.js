import Donation from "../models/donation.model.js";
import Event from "../models/event.model.js";
import News from "../models/news.model.js";
import Opportunity from "../models/opportunity.model.js";
import User from "../models/user.model.js";
import { REGULAR_USER_ROLES } from "../utils/roles.js";
import { getRecentActivities } from "./activity.service.js";

const getDistinctCountriesCount = async () => {
  const users = await User.find({
    role: { $in: REGULAR_USER_ROLES },
    status: "approved",
    isVerified: true,
    location: { $exists: true, $ne: "" },
  })
    .select("location")
    .lean();

  const countries = new Set(
    users
      .map((user) => {
        const parts = String(user.location).split(",");
        return parts[parts.length - 1]?.trim().toLowerCase();
      })
      .filter(Boolean),
  );

  return countries.size;
};

export const getAdminDashboard = async () => {
  const [registeredAlumni, upcomingEvents, activeOpportunities, activities, latestOpportunities] =
    await Promise.all([
      User.countDocuments({ role: { $in: REGULAR_USER_ROLES } }),
      Event.countDocuments({ isPublished: true, date: { $gte: new Date() } }),
      Opportunity.countDocuments({ status: "open" }),
      getRecentActivities(8),
      Opportunity.find({ status: "open" })
        .sort({ deadline: 1, createdAt: -1 })
        .limit(5)
        .select("title organization deadline")
        .lean(),
    ]);

  const [donationAggregate] = await Donation.aggregate([
    {
      $group: {
        _id: null,
        totalAmount: {
          $sum: {
            $cond: [{ $eq: ["$status", "completed"] }, "$amount", 0],
          },
        },
      },
    },
  ]);

  return {
    metrics: {
      registeredAlumni,
      upcomingEvents,
      activeOpportunities,
      donationsReceived: donationAggregate?.totalAmount || 0,
    },
    recentActivities: activities,
    latestOpportunities,
  };
};

export const getPublicHomeDashboard = async () => {
  const [registeredAlumni, countriesRepresented, mentorsAvailable, activeEvents] =
    await Promise.all([
      User.countDocuments({
        role: { $in: REGULAR_USER_ROLES },
        status: "approved",
        isVerified: true,
      }),
      getDistinctCountriesCount(),
      User.countDocuments({
        role: { $in: REGULAR_USER_ROLES },
        status: "approved",
        isVerified: true,
        isMentorAvailable: true,
      }),
      Event.countDocuments({
        isPublished: true,
        date: { $gte: new Date() },
      }),
    ]);

  const [events, opportunities, spotlights, news] = await Promise.all([
    Event.find({
      isPublished: true,
      date: { $gte: new Date() },
    })
      .sort({ isFeatured: -1, date: 1 })
      .limit(4)
      .lean(),
    Opportunity.find({
      status: "open",
    })
      .sort({ isFeatured: -1, deadline: 1, createdAt: -1 })
      .limit(3)
      .lean(),
    User.find({
      role: { $in: REGULAR_USER_ROLES },
      status: "approved",
      isVerified: true,
      isSpotlight: true,
    })
      .sort({ updatedAt: -1 })
      .limit(3)
      .lean(),
    News.find({
      status: "published",
    })
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(3)
      .lean(),
  ]);

  return {
    stats: {
      registeredAlumni,
      countriesRepresented,
      mentorsAvailable,
      activeEvents,
    },
    featuredEvents: events,
    featuredOpportunities: opportunities,
    spotlightAlumni: spotlights,
    latestNews: news,
  };
};
