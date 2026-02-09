/**
 * Supabase Integration Index for Sunya Project
 *
 * This is the main entry point for all Supabase-related functionality.
 * Import from this file for cleaner imports throughout the project.
 *
 * Project URL: https://uigslezjwyrygojgzjth.supabase.co
 */

// Main client functions from the main supabase configuration
export {
  createSupabaseClientFromRequest,
  getSupabaseAdminClient,
  getSupabaseClient,
  getSupabaseServerClient,
} from "../supabase";
// Middleware utilities
export * from "./middleware";
// Types
export * from "./types";
