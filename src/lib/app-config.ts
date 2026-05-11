import type { AppConfig } from "@/types/app-config";
import { APP_CONFIG_KEY } from "@/types/app-config";

const DEFAULT_ADMIN_PASSWORD = "admin123";

/** Get config from localStorage (client) or env (server). Safe to call from both. */
export function getAppConfig(): AppConfig {
  if (typeof window === "undefined") {
    return {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "",
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "",
    };
  }
  try {
    const raw = localStorage.getItem(APP_CONFIG_KEY);
    const stored: AppConfig = raw ? JSON.parse(raw) : {};
    return {
      businessName: stored.businessName ?? "",
      supabaseUrl: stored.supabaseUrl ?? process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "",
      supabaseAnonKey: stored.supabaseAnonKey ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "",
      theme: stored.theme ?? "light",
      adminPassword: stored.adminPassword ?? DEFAULT_ADMIN_PASSWORD,
    };
  } catch {
    return {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "",
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "",
    };
  }
}

/** Save config to localStorage. Call from client only. */
export function saveAppConfig(config: Partial<AppConfig>): void {
  if (typeof window === "undefined") return;
  const current = getAppConfig();
  const next: AppConfig = {
    ...current,
    ...config,
  };
  localStorage.setItem(APP_CONFIG_KEY, JSON.stringify(next));
}

/** Default admin password when none is set. */
export function getDefaultAdminPassword(): string {
  return DEFAULT_ADMIN_PASSWORD;
}

/** Check password. Uses stored adminPassword if set, else default. */
export function validateAdminPassword(input: string): boolean {
  const config = getAppConfig();
  const expected = config.adminPassword ?? DEFAULT_ADMIN_PASSWORD;
  return input === expected;
}
