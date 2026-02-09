/**
 * Supabase Type Definitions for Sunya Project
 *
 * This file contains TypeScript type definitions for Supabase tables
 * and the application.
 *
 custom types used across * Note: For full type safety, generate database.types.ts using:
 * npx supabase gen types types --project-id "your-project-id" > lib/supabase/database.types.ts
 */

/**
 * Custom types for Supabase data
 */
export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  image_url: string | null;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total_amount: number;
  shipping_address: Address | null;
  created_at: string;
  updated_at: string;
}

export interface Address {
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_type: "monthly" | "quarterly" | "annual";
  status: "active" | "cancelled" | "paused" | "expired";
  current_period_start: string;
  current_period_end: string;
  created_at: string;
  updated_at: string;
}

// Supabase Auth types
export interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: User;
}

export interface User {
  id: string;
  email: string;
  email_confirmed_at: string | null;
  created_at: string;
  updated_at: string;
  user_metadata: Record<string, unknown>;
  app_metadata: Record<string, unknown>;
}

// Realtime subscription types
export interface RealtimeChannel {
  id: string;
  name: string;
  event: "INSERT" | "UPDATE" | "DELETE" | "*";
  schema: string;
  table: string;
  filter?: string;
}

// Helper type for Supabase responses
export type SupabaseResponse<T> = {
  data: T | null;
  error: Error | null;
  status: number;
  statusText: string;
};

// Helper type for paginated results
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
