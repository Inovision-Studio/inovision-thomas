/**
 * Per-deployment constants that are not owner-editable in the admin.
 * ponytail: env, not a Setting — hours/analytics helpers are sync and run in
 * many places; move to Settings if an owner ever needs to change it live.
 */
export const TIMEZONE = process.env.TIMEZONE || "America/New_York";
