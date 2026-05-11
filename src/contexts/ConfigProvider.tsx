"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getAppConfig, saveAppConfig } from "@/lib/app-config";
import type { AppConfig } from "@/types/app-config";

type ConfigContextValue = {
  businessName: string;
  theme: AppConfig["theme"];
  setBusinessName: (name: string) => void;
  setTheme: (theme: AppConfig["theme"]) => void;
  refreshConfig: () => void;
};

const ConfigContext = createContext<ConfigContextValue | null>(null);

const DEFAULT_BUSINESS_NAME = "Kalupahana Car Wash";

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [businessName, setBusinessNameState] = useState(DEFAULT_BUSINESS_NAME);
  const [theme, setThemeState] = useState<AppConfig["theme"]>("light");

  const refreshConfig = useCallback(() => {
    const config = getAppConfig();
    setBusinessNameState(config.businessName?.trim() || DEFAULT_BUSINESS_NAME);
    setThemeState(config.theme ?? "light");
  }, []);

  useEffect(() => {
    refreshConfig();
  }, [refreshConfig]);

  const setBusinessName = useCallback((name: string) => {
    setBusinessNameState(name);
    saveAppConfig({ businessName: name });
  }, []);

  const setTheme = useCallback((t: AppConfig["theme"]) => {
    setThemeState(t ?? "light");
    saveAppConfig({ theme: t ?? "light" });
  }, []);

  const value: ConfigContextValue = {
    businessName,
    theme,
    setBusinessName,
    setTheme,
    refreshConfig,
  };

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const ctx = useContext(ConfigContext);
  if (!ctx) {
    throw new Error("useConfig must be used within ConfigProvider");
  }
  return ctx;
}
