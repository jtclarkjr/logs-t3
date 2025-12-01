/**
 * Global authentication configuration
 * Check if authentication is enabled via environment variable
 */
export const authEnabled = process.env.NEXT_PUBLIC_AUTH_ENABLED === "true";

/**
 * Check if user sign-up is enabled
 * When false, users can only sign in (no new registrations)
 */
export const signUpEnabled =
  process.env.NEXT_PUBLIC_AUTH_SIGNUP_ENABLED === "true";
