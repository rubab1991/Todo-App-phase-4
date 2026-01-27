/**
 * Better Auth Configuration for Todo App
 * This file configures the Better Auth service to run alongside the FastAPI backend
 */

import { betterAuth } from "better-auth";

// Better Auth configuration
export const auth = betterAuth({
  database: {
    provider: "postgresql",
    url: process.env.NEON_DB_URL!,
  },
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:8002",
  account: {
    accountLinks: "enabled", // Enable account linking features
  },
  socialProviders: {
    // Add any social providers if needed
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true in production
  },
  session: {
    expiresIn: 7 * 24 * 60 * 60, // 7 days
    rememberMe: true,
  },
  user: {
    // Additional user configuration if needed
  },
  ui: {
    // Configuration for the auth UI if needed
  }
});