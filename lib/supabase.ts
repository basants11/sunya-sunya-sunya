/**
 * Supabase Client Configuration
 *
 * This module provides Supabase client instances for the Sunya project.
 * It handles both client-side and server-side Supabase connections.
 *
 * Project URL: https://uigslezjwyrygojgzjth.supabase.co
 */

import { createServerClient, parse, type CookieOptions } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

// Environment variables must be defined in .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Type declaration for Supabase URL and Key global cache
 */
declare global {
  var supabaseUrl: string | undefined;
  var supabaseAnonKey: string | undefined;
}

/**
 * Validate environment variables
 */
function validateEnv(): void {
  if (!supabaseUrl) {
    console.warn(
      "⚠️ NEXT_PUBLIC_SUPABASE_URL is not defined in environment variables",
    );
  }
  if (!supabaseAnonKey) {
    console.warn(
      "⚠️ NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined in environment variables",
    );
  }
}

/**
 * Cookie interface for Supabase server client
 */
interface SupabaseCookies {
  getAll(): Array<{ name: string; value: string }>;
  setAll(
    cookies: Array<{ name: string; value: string; options?: CookieOptions }>,
  ): void;
}

/**
 * Create a Supabase client for client-side usage
 * Use this for authenticated user operations in browser context
 */
export function getSupabaseClient() {
  validateEnv();

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      "❌ Supabase client requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  });
}

/**
 * Create a Supabase client for server-side usage (with cookies)
 * Use this in Next.js App Router server components and API routes
 */
export function getSupabaseServerClient(cookies: SupabaseCookies) {
  validateEnv();

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      "❌ Supabase server client requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
    return null;
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookies.getAll();
      },
      setAll(cookiesToSet) {
        // This is handled by middleware for security
        cookies.setAll(cookiesToSet);
      },
    },
  });
}

/**
 * Create a Supabase admin client for privileged operations
 * Use this for backend operations that require elevated permissions
 * WARNING: Never expose this key to the client side
 */
export function getSupabaseAdminClient() {
  validateEnv();

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error(
      "❌ Supabase admin client requires SUPABASE_SERVICE_ROLE_KEY",
    );
    return null;
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Helper to create Supabase client from browser request
 * Use this in API routes and server actions
 */
export function createSupabaseClientFromRequest(request: Request) {
  validateEnv();

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      "❌ Supabase client requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
    return null;
  }

  // Parse cookies from request headers
  const cookieStore = parse(request.headers.get("cookie") ?? "");

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return Object.keys(cookieStore).map((name) => ({
          name,
          value: cookieStore[name] ?? "",
        }));
      },
      setAll() {
        // This is handled by middleware for security
      },
    },
  });
}

// Export URL and Key for reference
export { supabaseUrl, supabaseAnonKey };

// Default export for convenience
export default getSupabaseClient;
