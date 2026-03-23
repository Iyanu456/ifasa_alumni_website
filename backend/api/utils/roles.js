export const USER_ROLES = Object.freeze({
  USER: "user",
  ADMIN: "admin",
  LEGACY_ALUMNUS: "alumnus",
});

export const REGULAR_USER_ROLES = Object.freeze([
  USER_ROLES.USER,
  USER_ROLES.LEGACY_ALUMNUS,
]);

export const isRegularUserRole = (role) => REGULAR_USER_ROLES.includes(role);
