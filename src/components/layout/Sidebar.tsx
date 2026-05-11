"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Package,
  Settings,
  Users,
  Gift,
  PackageCheck,
  ClipboardList,
  CreditCard,
  MessageSquare,
  Cake,
  Receipt,
  TrendingDown,
  UserCog,
  Truck,
  Wallet,
  BarChart3,
  ListOrdered,
  Tv,
  MessageCircle,
  Clock,
  Wrench,
  Tablet,
  Camera,
  CloudOff,
  FileCheck,
  Download,
  Calendar,
  CalendarX,
  Droplets,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useConfig } from "@/contexts/ConfigProvider";
import { useFeatureFlagsStore } from "@/store/feature-flags";
import { NAV_ITEMS, CATEGORY_LABELS } from "@/config/navigation";
import type { NavItem } from "@/types/feature-flags";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  FileText,
  Package,
  Settings,
  Users,
  Gift,
  PackageCheck,
  ClipboardList,
  CreditCard,
  MessageSquare,
  Cake,
  Receipt,
  TrendingDown,
  UserCog,
  Truck,
  Wallet,
  BarChart3,
  ListOrdered,
  Tv,
  MessageCircle,
  Clock,
  Wrench,
  Tablet,
  Camera,
  CloudOff,
  FileCheck,
  Download,
  Calendar,
  CalendarX,
};

function getIcon(name: string) {
  return ICON_MAP[name] ?? LayoutDashboard;
}

/** Sidebar: only renders nav items whose feature flag is enabled (or alwaysShow). */
export function Sidebar() {
  const pathname = usePathname();
  const { businessName } = useConfig();
  const flags = useFeatureFlagsStore((s) => s.flags);

  const isEnabled = (id: string) => {
    const flag = flags.find((f) => f.id === id);
    return flag?.is_enabled ?? true;
  };

  const visibleItems = NAV_ITEMS.filter(
    (item) => item.alwaysShow || isEnabled(item.id)
  );

  const byCategory = visibleItems.reduce<Record<string, NavItem[]>>(
    (acc, item) => {
      const cat = item.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    },
    {}
  );

  const categoryOrder = ["core", "crm", "financial", "operational", "advanced"];

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-slate-200/80 bg-white shadow-sm">
      <div className="flex h-16 items-center gap-3 border-b border-slate-200/80 px-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
          <Droplets className="h-6 w-6" />
        </div>
        <span className="truncate text-base font-semibold text-slate-900">
          {businessName || "Car Wash ERP"}
        </span>
      </div>
      <nav className="flex-1 overflow-y-auto p-3">
        {categoryOrder.map((cat) => {
          const items = byCategory[cat];
          if (!items?.length) return null;
          return (
            <div key={cat} className="mb-5">
              <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {CATEGORY_LABELS[cat] ?? cat}
              </h3>
              <ul className="space-y-0.5">
                {items.map((item) => {
                  const Icon = getIcon(item.icon);
                  const active = pathname === item.href;
                  return (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors touch-manipulation",
                          active
                            ? "border-l-4 border-indigo-600 bg-indigo-50/80 text-indigo-700"
                            : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-5 w-5 shrink-0",
                            active ? "text-indigo-600" : "text-slate-500"
                          )}
                        />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
