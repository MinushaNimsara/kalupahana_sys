/** Stored in localStorage under key `app_config`. */
export interface AppConfig {
  businessName?: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  theme?: "light" | "dark";
  /** Current admin password (plain). Default is admin123 until changed. */
  adminPassword?: string;
}

export const APP_CONFIG_KEY = "app_config" as const;
