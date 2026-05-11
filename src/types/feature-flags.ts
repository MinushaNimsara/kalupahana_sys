/**
 * Feature flag types and constants.
 * Used for type-safe navigation and conditional rendering.
 * IDs are shared between local (mock) state and future DB (e.g. Supabase).
 */

/** All feature flag IDs - use these for isEnabled(id) and nav mapping */
export const FEATURE_FLAG_IDS = {
  DASHBOARD: "dashboard",
  SMART_INVOICE: "smart_invoice",
  INVENTORY: "inventory",
  ADMIN_PANEL: "admin_panel",
  VEHICLE_HISTORY: "vehicle_history",
  LOYALTY_POINTS: "loyalty_points",
  SERVICE_PACKAGES: "service_packages",
  JOB_CARD_INSPECTION: "job_card_inspection",
  SUBSCRIPTION_PASS: "subscription_pass",
  CUSTOMER_FEEDBACK: "customer_feedback",
  BIRTHDAY_ANNIVERSARY: "birthday_anniversary",
  EXPENSE_TRACKING: "expense_tracking",
  PROFIT_LOSS: "profit_loss",
  EMPLOYEE_COMMISSION: "employee_commission",
  SUPPLIER_MANAGEMENT: "supplier_management",
  MULTIPLE_PAYMENTS: "multiple_payments",
  ANALYTICS: "analytics",
  QUEUE_MANAGEMENT: "queue_management",
  WAITING_DISPLAY: "waiting_display",
  SMS_WHATSAPP: "sms_whatsapp",
  STAFF_ATTENDANCE: "staff_attendance",
  EQUIPMENT_MAINTENANCE: "equipment_maintenance",
  MECHANIC_BAY_VIEW: "mechanic_bay_view",
  ANPR: "anpr",
  OFFLINE_SYNC: "offline_sync",
  AUDIT_LOGS: "audit_logs",
  DATA_EXPORT: "data_export",
  DOCUMENT_EXPIRY: "document_expiry",
  HOLIDAY_SLOT_BLOCKER: "holiday_slot_blocker",
  SETTINGS: "settings",
} as const;

export type FeatureFlagId = (typeof FEATURE_FLAG_IDS)[keyof typeof FEATURE_FLAG_IDS];

/** Allowed categories for grouping in sidebar and settings */
export type FeatureFlagCategory = "core" | "crm" | "financial" | "operational" | "advanced";

export interface FeatureFlag {
  id: FeatureFlagId | string;
  name: string;
  description: string | null;
  is_enabled: boolean;
  display_order: number;
  category: FeatureFlagCategory | string | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * Sidebar nav item. id must match a feature flag id so visibility can be toggled.
 * alwaysShow = visible even when flag is off (e.g. Dashboard, Settings).
 */
export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  category: string;
  alwaysShow?: boolean;
}
