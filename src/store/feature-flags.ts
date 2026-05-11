import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FeatureFlag } from "@/types/feature-flags";
import { FEATURE_FLAG_IDS } from "@/types/feature-flags";

/**
 * Mock feature flags - local default state only (no Supabase).
 * Used as initial state and when resetting. Supabase sync can be added later.
 */
const MOCK_FEATURE_FLAGS: FeatureFlag[] = [
  { id: FEATURE_FLAG_IDS.DASHBOARD, name: "Dashboard", description: "Real-time daily income, jobs, profit", is_enabled: true, display_order: 0, category: "core" },
  { id: FEATURE_FLAG_IDS.SMART_INVOICE, name: "Smart Invoice", description: "Professional bills, print support", is_enabled: true, display_order: 1, category: "core" },
  { id: FEATURE_FLAG_IDS.INVENTORY, name: "Inventory with QR", description: "Stock management, QR scan", is_enabled: true, display_order: 2, category: "core" },
  { id: FEATURE_FLAG_IDS.ADMIN_PANEL, name: "Admin Panel", description: "Full data control", is_enabled: true, display_order: 3, category: "core" },
  { id: FEATURE_FLAG_IDS.VEHICLE_HISTORY, name: "Vehicle Service History", description: "Search by plate, timeline", is_enabled: true, display_order: 10, category: "crm" },
  { id: FEATURE_FLAG_IDS.LOYALTY_POINTS, name: "Loyalty & Points", description: "Points rules, redeem discounts", is_enabled: true, display_order: 11, category: "crm" },
  { id: FEATURE_FLAG_IDS.SERVICE_PACKAGES, name: "Service Packages", description: "Pre-set bundles", is_enabled: true, display_order: 12, category: "crm" },
  { id: FEATURE_FLAG_IDS.JOB_CARD_INSPECTION, name: "Job Card & Inspection", description: "Damage diagram, signature", is_enabled: true, display_order: 13, category: "crm" },
  { id: FEATURE_FLAG_IDS.SUBSCRIPTION_PASS, name: "Subscription Pass", description: "Recurring customers", is_enabled: true, display_order: 14, category: "crm" },
  { id: FEATURE_FLAG_IDS.CUSTOMER_FEEDBACK, name: "Customer Feedback", description: "Rating link/QR on invoice", is_enabled: true, display_order: 15, category: "crm" },
  { id: FEATURE_FLAG_IDS.BIRTHDAY_ANNIVERSARY, name: "Birthday/Anniversary", description: "Auto greetings", is_enabled: true, display_order: 16, category: "crm" },
  { id: FEATURE_FLAG_IDS.EXPENSE_TRACKING, name: "Expense Tracking", description: "Operational costs", is_enabled: true, display_order: 20, category: "financial" },
  { id: FEATURE_FLAG_IDS.PROFIT_LOSS, name: "Profit & Loss", description: "Income - Expenses report", is_enabled: true, display_order: 21, category: "financial" },
  { id: FEATURE_FLAG_IDS.EMPLOYEE_COMMISSION, name: "Employee Commission", description: "Staff commission calc", is_enabled: true, display_order: 22, category: "financial" },
  { id: FEATURE_FLAG_IDS.SUPPLIER_MANAGEMENT, name: "Supplier Management", description: "Vendors, PO history", is_enabled: true, display_order: 23, category: "financial" },
  { id: FEATURE_FLAG_IDS.MULTIPLE_PAYMENTS, name: "Multiple Payments", description: "Split payments", is_enabled: true, display_order: 24, category: "financial" },
  { id: FEATURE_FLAG_IDS.ANALYTICS, name: "Advanced Analytics", description: "Charts, peak hours", is_enabled: true, display_order: 25, category: "financial" },
  { id: FEATURE_FLAG_IDS.QUEUE_MANAGEMENT, name: "Queue Management", description: "Token, status tracking", is_enabled: true, display_order: 30, category: "operational" },
  { id: FEATURE_FLAG_IDS.WAITING_DISPLAY, name: "Waiting Display (TV)", description: "TV mode", is_enabled: true, display_order: 31, category: "operational" },
  { id: FEATURE_FLAG_IDS.SMS_WHATSAPP, name: "SMS/WhatsApp", description: "Notifications", is_enabled: true, display_order: 32, category: "operational" },
  { id: FEATURE_FLAG_IDS.STAFF_ATTENDANCE, name: "Staff Attendance", description: "Clock in/out", is_enabled: true, display_order: 33, category: "operational" },
  { id: FEATURE_FLAG_IDS.EQUIPMENT_MAINTENANCE, name: "Equipment Maintenance", description: "Machinery reminders", is_enabled: true, display_order: 34, category: "operational" },
  { id: FEATURE_FLAG_IDS.MECHANIC_BAY_VIEW, name: "Mechanic/Bay View", description: "Tablet mode", is_enabled: true, display_order: 35, category: "operational" },
  { id: FEATURE_FLAG_IDS.ANPR, name: "ANPR Placeholder", description: "Number plate API", is_enabled: true, display_order: 40, category: "advanced" },
  { id: FEATURE_FLAG_IDS.OFFLINE_SYNC, name: "Offline Sync", description: "Cache invoices", is_enabled: true, display_order: 41, category: "advanced" },
  { id: FEATURE_FLAG_IDS.AUDIT_LOGS, name: "Audit Logs", description: "Immutable action log", is_enabled: true, display_order: 42, category: "advanced" },
  { id: FEATURE_FLAG_IDS.DATA_EXPORT, name: "Data Export", description: "CSV/Excel/PDF", is_enabled: true, display_order: 43, category: "advanced" },
  { id: FEATURE_FLAG_IDS.DOCUMENT_EXPIRY, name: "Document Expiry", description: "License/Insurance alerts", is_enabled: true, display_order: 44, category: "advanced" },
  { id: FEATURE_FLAG_IDS.HOLIDAY_SLOT_BLOCKER, name: "Holiday/Slot Blocker", description: "Closed dates", is_enabled: true, display_order: 45, category: "advanced" },
  { id: FEATURE_FLAG_IDS.SETTINGS, name: "Settings & Customization", description: "Theme, feature toggles", is_enabled: true, display_order: 99, category: "core" },
];

interface FeatureFlagsState {
  /** All flags (mock data; persisted in localStorage) */
  flags: FeatureFlag[];
  /** True when syncing from remote (e.g. Supabase); unused in mock-only mode */
  isLoading: boolean;
  setFlags: (flags: FeatureFlag[]) => void;
  setLoading: (loading: boolean) => void;
  /** Check if a feature is enabled by id */
  isEnabled: (id: string) => boolean;
  /** Toggle a single feature */
  updateFlag: (id: string, is_enabled: boolean) => void;
  /** Restore default mock state (all enabled) */
  resetToDefaults: () => void;
}

export const useFeatureFlagsStore = create<FeatureFlagsState>()(
  persist(
    (set, get) => ({
      flags: MOCK_FEATURE_FLAGS,
      isLoading: false,
      setFlags: (flags) => set({ flags }),
      setLoading: (isLoading) => set({ isLoading }),
      isEnabled: (id) => {
        const flag = get().flags.find((f) => f.id === id);
        return flag?.is_enabled ?? true;
      },
      updateFlag: (id, is_enabled) =>
        set((state) => ({
          flags: state.flags.map((f) =>
            f.id === id ? { ...f, is_enabled } : f
          ),
        })),
      resetToDefaults: () => set({ flags: MOCK_FEATURE_FLAGS }),
    }),
    {
      name: "kalupahana-feature-flags",
      partialize: (state) => ({ flags: state.flags }),
    }
  )
);
