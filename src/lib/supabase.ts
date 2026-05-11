import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { getAppConfig } from "./app-config";

let cachedClient: ReturnType<typeof createClient<Database>> | null = null;
let cachedUrl = "";
let cachedKey = "";

/**
 * Get Supabase client using dynamic config.
 * First reads from localStorage (app_config), then falls back to .env.
 * Client is cached per url+key; invalidated on next page load after config save.
 */
export function getSupabaseClient(): ReturnType<typeof createClient<Database>> | null {
  const config = getAppConfig();
  const url = config.supabaseUrl?.trim() ?? "";
  const key = config.supabaseAnonKey?.trim() ?? "";

  if (!url || !key) return null;

  if (cachedClient && cachedUrl === url && cachedKey === key) {
    return cachedClient;
  }

  cachedUrl = url;
  cachedKey = key;
  cachedClient = createClient<Database>(url, key);
  return cachedClient;
}

/** Reset cached client (e.g. after config change before reload). */
export function clearSupabaseCache(): void {
  cachedClient = null;
  cachedUrl = "";
  cachedKey = "";
}
