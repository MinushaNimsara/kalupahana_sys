"use client";

import { useState, useCallback } from "react";
import { useFeatureFlagsStore } from "@/store/feature-flags";
import { useConfig } from "@/contexts/ConfigProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { CATEGORY_LABELS } from "@/config/navigation";
import {
  getAppConfig,
  saveAppConfig,
  validateAdminPassword,
  getDefaultAdminPassword,
} from "@/lib/app-config";
import { Lock, Shield, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORY_ORDER = ["core", "crm", "financial", "operational", "advanced"] as const;

type SettingsTab = "features" | "admin";

export default function SettingsPage() {
  const [tab, setTab] = useState<SettingsTab>("features");
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [adminForm, setAdminForm] = useState(() => getAppConfig());
  const [changePasswordCurrent, setChangePasswordCurrent] = useState("");
  const [changePasswordNew, setChangePasswordNew] = useState("");
  const [changePasswordConfirm, setChangePasswordConfirm] = useState("");
  const [changePasswordError, setChangePasswordError] = useState("");

  const { flags, updateFlag, resetToDefaults } = useFeatureFlagsStore();
  const { businessName, setBusinessName } = useConfig();

  const byCategory = flags.reduce<Record<string, typeof flags>>((acc, f) => {
    const cat = (f.category ?? "core") as string;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(f);
    return acc;
  }, {});

  const handleOpenSystemAdmin = useCallback(() => {
    if (adminUnlocked) {
      setTab("admin");
      setAdminForm(getAppConfig());
      return;
    }
    setPasswordInput("");
    setPasswordError("");
    setPasswordModalOpen(true);
  }, [adminUnlocked]);

  const handlePasswordSubmit = useCallback(() => {
    if (validateAdminPassword(passwordInput)) {
      setAdminUnlocked(true);
      setPasswordModalOpen(false);
      setTab("admin");
      setAdminForm(getAppConfig());
    } else {
      setPasswordError("Incorrect password.");
    }
  }, [passwordInput]);

  const handleSaveConfig = useCallback(() => {
    saveAppConfig({
      businessName: adminForm.businessName?.trim() || undefined,
      supabaseUrl: adminForm.supabaseUrl?.trim() || undefined,
      supabaseAnonKey: adminForm.supabaseAnonKey?.trim() || undefined,
    });
    if (adminForm.businessName?.trim()) {
      setBusinessName(adminForm.businessName.trim());
    }
    window.location.reload();
  }, [adminForm, setBusinessName]);

  const handleChangePassword = useCallback(() => {
    setChangePasswordError("");
    if (!validateAdminPassword(changePasswordCurrent)) {
      setChangePasswordError("Current password is incorrect.");
      return;
    }
    if (changePasswordNew.length < 4) {
      setChangePasswordError("New password must be at least 4 characters.");
      return;
    }
    if (changePasswordNew !== changePasswordConfirm) {
      setChangePasswordError("New passwords do not match.");
      return;
    }
    saveAppConfig({ adminPassword: changePasswordNew });
    setChangePasswordCurrent("");
    setChangePasswordNew("");
    setChangePasswordConfirm("");
    setChangePasswordError("");
  }, [changePasswordCurrent, changePasswordNew, changePasswordConfirm]);

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
          System Settings
        </h1>
        <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setTab("features")}
            className={cn(
              "flex min-h-11 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all touch-manipulation",
              tab === "features"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            )}
          >
            <Settings2 className="h-5 w-5" />
            Feature Toggles
          </button>
          <button
            type="button"
            onClick={handleOpenSystemAdmin}
            className={cn(
              "flex min-h-11 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all touch-manipulation",
              tab === "admin"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            )}
          >
            <Shield className="h-5 w-5" />
            System Admin
            {!adminUnlocked && <Lock className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {tab === "features" && (
        <>
          <p className="mb-6 text-slate-600">
            Toggle features ON/OFF. Disabled features are hidden from the sidebar immediately.
          </p>
          <div className="mb-6 flex justify-end">
            <Button
              variant="secondary"
              size="lg"
              className="min-h-11 touch-manipulation"
              onClick={() => resetToDefaults()}
            >
              Reset all to ON
            </Button>
          </div>
          {CATEGORY_ORDER.map((cat) => {
            const items = byCategory[cat];
            if (!items?.length) return null;
            const sorted = [...items].sort((a, b) => a.display_order - b.display_order);
            return (
              <Card key={cat} className="mb-6">
                <CardHeader>
                  <CardTitle>{CATEGORY_LABELS[cat] ?? cat}</CardTitle>
                  <CardDescription>Feature toggles for this category</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {sorted.map((flag) => (
                      <li
                        key={flag.id}
                        className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200/80 bg-slate-50/50 p-4"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-slate-900">{flag.name}</p>
                          {flag.description && (
                            <p className="mt-0.5 text-sm text-slate-600">{flag.description}</p>
                          )}
                        </div>
                        <Switch
                          checked={flag.is_enabled}
                          onCheckedChange={(checked) => updateFlag(flag.id as string, checked)}
                          className="shrink-0"
                        />
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </>
      )}

      {tab === "admin" && adminUnlocked && (
        <>
          <p className="mb-6 text-slate-600">
            Configure business name and database. Changes take effect after Save and reload.
          </p>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>App & Database</CardTitle>
              <CardDescription>
                Business name appears in the app header and invoices. Supabase credentials are
                stored in this browser only.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-900">
                  Business Name
                </label>
                <Input
                  value={adminForm.businessName ?? ""}
                  onChange={(e) => setAdminForm((p) => ({ ...p, businessName: e.target.value }))}
                  placeholder="e.g. Kalupahana Auto Car Wash"
                  className="min-h-11"
                />
                <p className="mt-1.5 text-xs text-slate-500">
                  Shown in the sidebar header and on invoice headers.
                </p>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-900">
                  Supabase URL
                </label>
                <Input
                  value={adminForm.supabaseUrl ?? ""}
                  onChange={(e) => setAdminForm((p) => ({ ...p, supabaseUrl: e.target.value }))}
                  placeholder="https://your-project.supabase.co"
                  className="min-h-11"
                />
                <p className="mt-1.5 text-xs text-slate-500">
                  Your Supabase project URL from the dashboard.
                </p>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-900">
                  Supabase Anon Key
                </label>
                <Input
                  type="password"
                  value={adminForm.supabaseAnonKey ?? ""}
                  onChange={(e) => setAdminForm((p) => ({ ...p, supabaseAnonKey: e.target.value }))}
                  placeholder="Your anon key"
                  className="min-h-11"
                />
                <p className="mt-1.5 text-xs text-slate-500">
                  Public anon key from Project Settings → API. Safe to store in browser.
                </p>
              </div>
              <Button
                size="lg"
                className="min-h-12 touch-manipulation px-6 shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-200/60"
                onClick={handleSaveConfig}
              >
                Save & Reload
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Change Admin Password</CardTitle>
              <CardDescription>
                Default is &quot;admin123&quot; until changed. Stored in this browser only.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-900">
                  Current password
                </label>
                <Input
                  type="password"
                  value={changePasswordCurrent}
                  onChange={(e) => setChangePasswordCurrent(e.target.value)}
                  placeholder="Current password"
                  className="min-h-11"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-900">
                  New password
                </label>
                <Input
                  type="password"
                  value={changePasswordNew}
                  onChange={(e) => setChangePasswordNew(e.target.value)}
                  placeholder="New password (min 4 characters)"
                  className="min-h-11"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-900">
                  Confirm new password
                </label>
                <Input
                  type="password"
                  value={changePasswordConfirm}
                  onChange={(e) => setChangePasswordConfirm(e.target.value)}
                  placeholder="Confirm new password"
                  className="min-h-11"
                />
              </div>
              {changePasswordError && (
                <p className="text-sm text-red-600">{changePasswordError}</p>
              )}
              <Button
                variant="secondary"
                size="lg"
                className="min-h-11 touch-manipulation"
                onClick={handleChangePassword}
              >
                Change Password
              </Button>
            </CardContent>
          </Card>
        </>
      )}

      <Dialog open={passwordModalOpen} onOpenChange={setPasswordModalOpen}>
        <DialogContent className="rounded-2xl border-slate-200 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-slate-900">Enter Admin Password</DialogTitle>
            <DialogDescription className="text-slate-600">
              System Admin is locked. Default password is &quot;{getDefaultAdminPassword()}&quot;
              (change it after first login).
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Input
              type="password"
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
                setPasswordError("");
              }}
              placeholder="Password"
              className="min-h-11"
              onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
            />
            {passwordError && (
              <p className="mt-2 text-sm text-red-600">{passwordError}</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPasswordModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePasswordSubmit}>Unlock</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
