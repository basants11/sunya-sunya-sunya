/**
 * Supabase Auth Middleware Helper
 *
 * This module provides authentication utilities for Supabase
 * in Next.js middleware and server-side operations.
 *
 * Project URL: https://uigslezjwyrygojgzjth.supabase.co
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Create a Supabase client for middleware usage
 */
export function createSupabaseMiddlewareClient(request: NextRequest) {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase environment variables are not defined");
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach((cookie) => {
          request.cookies.set(cookie);
        });
      },
    },
  });
}

/**
 * Get Supabase client from cookies in server context
 */
export async function getSupabaseFromCookies() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase environment variables are not defined");
  }

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {
        // Not supported in server components
      },
    },
  });
}

/**
 * Check if user is authenticated via Supabase
 */
export async function isAuthenticated(request?: NextRequest): Promise<boolean> {
  try {
    const client = request
      ? createSupabaseMiddlewareClient(request)
      : await getSupabaseFromCookies();

    const {
      data: { session },
    } = await client.auth.getSession();
    return !!session;
  } catch {
    return false;
  }
}

/**
 * Get current user from Supabase
 */
export async function getCurrentUser(request?: NextRequest) {
  try {
    const client = request
      ? createSupabaseMiddlewareClient(request)
      : await getSupabaseFromCookies();

    const {
      data: { user },
    } = await client.auth.getUser();
    return user;
  } catch {
    return null;
  }
}

/**
 * Protect routes that require authentication
 */
export async function protectRoute(request: NextRequest) {
  const isAuth = await isAuthenticated(request);

  if (!isAuth) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("login", "true");
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

/**
 * Redirect authenticated users away from auth pages
 */
export async function redirectIfAuthenticated(request: NextRequest) {
  const isAuth = await isAuthenticated(request);

  if (isAuth) {
    const url = request.nextUrl.clone();
    url.pathname = "/account";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

/**
 * Refresh session if needed
 */
export async function refreshSession(request: NextRequest) {
  try {
    const client = createSupabaseMiddlewareClient(request);
    const {
      data: { session },
    } = await client.auth.getSession();

    if (session?.refresh_token) {
      await client.auth.refreshSession();
    }
  } catch {
    // Session refresh failed, user will need to re-authenticate
  }

  return NextResponse.next();
}
