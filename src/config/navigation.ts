/**
 * Sidebar navigation config.
 * Each item's id maps to a feature flag; visibility is controlled by the feature-flags store.
 * Use NAV_ITEMS with useFeatureFlagsStore().isEnabled(item.id) to show/hide links.
 */
import { FEATURE_FLAG_IDS } from "@/types/feature-flags";
import type { NavItem } from "@/types/feature-flags";

export const NAV_ITEMS: NavItem[] = [
  { id: FEATURE_FLAG_IDS.DASHBOARD, label: "Dashboard", href: "/", icon: "LayoutDashboard", category: "core", alwaysShow: true },
  { id: FEATURE_FLAG_IDS.SMART_INVOICE, label: "Invoices", href: "/invoices", icon: "FileText", category: "core" },
  { id: FEATURE_FLAG_IDS.INVENTORY, label: "Inventory", href: "/inventory", icon: "Package", category: "core" },
  { id: FEATURE_FLAG_IDS.ADMIN_PANEL, label: "Admin", href: "/admin", icon: "Users", category: "core" },
  { id: FEATURE_FLAG_IDS.VEHICLE_HISTORY, label: "Vehicle History", href: "/vehicle-history", icon: "ClipboardList", category: "crm" },
  { id: FEATURE_FLAG_IDS.LOYALTY_POINTS, label: "Loyalty & Points", href: "/loyalty", icon: "Gift", category: "crm" },
  { id: FEATURE_FLAG_IDS.SERVICE_PACKAGES, label: "Service Packages", href: "/packages", icon: "PackageCheck", category: "crm" },
  { id: FEATURE_FLAG_IDS.JOB_CARD_INSPECTION, label: "Job Card & Inspection", href: "/job-cards", icon: "ClipboardList", category: "crm" },
  { id: FEATURE_FLAG_IDS.SUBSCRIPTION_PASS, label: "Subscription Pass", href: "/subscriptions", icon: "CreditCard", category: "crm" },
  { id: FEATURE_FLAG_IDS.CUSTOMER_FEEDBACK, label: "Customer Feedback", href: "/feedback", icon: "MessageSquare", category: "crm" },
  { id: FEATURE_FLAG_IDS.BIRTHDAY_ANNIVERSARY, label: "Birthday/Anniversary", href: "/greetings", icon: "Cake", category: "crm" },
  { id: FEATURE_FLAG_IDS.EXPENSE_TRACKING, label: "Expenses", href: "/expenses", icon: "Receipt", category: "financial" },
  { id: FEATURE_FLAG_IDS.PROFIT_LOSS, label: "Profit & Loss", href: "/profit-loss", icon: "TrendingDown", category: "financial" },
  { id: FEATURE_FLAG_IDS.EMPLOYEE_COMMISSION, label: "Employee Commission", href: "/commission", icon: "UserCog", category: "financial" },
  { id: FEATURE_FLAG_IDS.SUPPLIER_MANAGEMENT, label: "Suppliers", href: "/suppliers", icon: "Truck", category: "financial" },
  { id: FEATURE_FLAG_IDS.MULTIPLE_PAYMENTS, label: "Payments", href: "/payments", icon: "Wallet", category: "financial" },
  { id: FEATURE_FLAG_IDS.ANALYTICS, label: "Analytics", href: "/analytics", icon: "BarChart3", category: "financial" },
  { id: FEATURE_FLAG_IDS.QUEUE_MANAGEMENT, label: "Queue", href: "/queue", icon: "ListOrdered", category: "operational" },
  { id: FEATURE_FLAG_IDS.WAITING_DISPLAY, label: "Waiting Display (TV)", href: "/waiting-display", icon: "Tv", category: "operational" },
  { id: FEATURE_FLAG_IDS.SMS_WHATSAPP, label: "SMS/WhatsApp", href: "/notifications", icon: "MessageCircle", category: "operational" },
  { id: FEATURE_FLAG_IDS.STAFF_ATTENDANCE, label: "Attendance", href: "/attendance", icon: "Clock", category: "operational" },
  { id: FEATURE_FLAG_IDS.EQUIPMENT_MAINTENANCE, label: "Equipment", href: "/equipment", icon: "Wrench", category: "operational" },
  { id: FEATURE_FLAG_IDS.MECHANIC_BAY_VIEW, label: "Bay View (Tablet)", href: "/bay-view", icon: "Tablet", category: "operational" },
  { id: FEATURE_FLAG_IDS.ANPR, label: "ANPR", href: "/anpr", icon: "Camera", category: "advanced" },
  { id: FEATURE_FLAG_IDS.OFFLINE_SYNC, label: "Offline Sync", href: "/offline", icon: "CloudOff", category: "advanced" },
  { id: FEATURE_FLAG_IDS.AUDIT_LOGS, label: "Audit Logs", href: "/audit", icon: "FileCheck", category: "advanced" },
  { id: FEATURE_FLAG_IDS.DATA_EXPORT, label: "Export", href: "/export", icon: "Download", category: "advanced" },
  { id: FEATURE_FLAG_IDS.DOCUMENT_EXPIRY, label: "Document Expiry", href: "/document-expiry", icon: "Calendar", category: "advanced" },
  { id: FEATURE_FLAG_IDS.HOLIDAY_SLOT_BLOCKER, label: "Holiday/Slots", href: "/holidays", icon: "CalendarX", category: "advanced" },
  { id: FEATURE_FLAG_IDS.SETTINGS, label: "System Settings", href: "/settings", icon: "Settings", category: "core", alwaysShow: true },
];

/** Category labels for sidebar sections and settings panel */
export const CATEGORY_LABELS: Record<string, string> = {
  core: "Core",
  crm: "Customer & Service",
  financial: "Financial",
  operational: "Operations",
  advanced: "Advanced",
};
