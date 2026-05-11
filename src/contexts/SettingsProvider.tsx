"use client";

import { createContext, useCallback, useContext, useEffect } from "react";
import { useFeatureFlagsStore } from "@/store/feature-flags";
import { getSupabaseClient } from "@/lib/supabase";
import type { FeatureFlag } from "@/types/feature-flags";

type SettingsContextValue = {
  isFeatureEnabled: (id: string) => boolean;
  refreshFlags: () => Promise<void>;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { flags, setFlags, setLoading, isEnabled } = useFeatureFlagsStore();

  const refreshFlags = useCallback(async () => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("feature_flags")
        .select("*")
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        setFlags(data as FeatureFlag[]);
      }
    } catch {
      // Offline or no Supabase - keep current flags
    } finally {
      setLoading(false);
    }
  }, [setFlags, setLoading]);

  useEffect(() => {
    refreshFlags();
  }, [refreshFlags]);

  const value: SettingsContextValue = {
    isFeatureEnabled: isEnabled,
    refreshFlags,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return ctx;
}
