-- =============================================
-- KALUPAHANA AUTO CAR WASH - ERP DATABASE SCHEMA
-- Supabase (PostgreSQL) - Run in Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. FEATURE FLAGS / SYSTEM SETTINGS
-- =============================================
CREATE TABLE feature_flags (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 0,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed all 30 module flags (Dashboard & Admin are always visible in UI but can be restricted)
INSERT INTO feature_flags (id, name, description, is_enabled, display_order, category) VALUES
-- Core Operations
('dashboard', 'Dashboard', 'Real-time daily income, jobs, profit', true, 0, 'core'),
('smart_invoice', 'Smart Invoice', 'Professional bills, print support', true, 1, 'core'),
('inventory', 'Inventory with QR', 'Stock management, QR scan', true, 2, 'core'),
('admin_panel', 'Admin Panel', 'Full data control', true, 3, 'core'),
-- CRM
('vehicle_history', 'Vehicle Service History', 'Search by plate, timeline', true, 10, 'crm'),
('loyalty_points', 'Loyalty & Points', 'Points rules, redeem discounts', true, 11, 'crm'),
('service_packages', 'Service Packages', 'Pre-set bundles', true, 12, 'crm'),
('job_card_inspection', 'Digital Job Card & Inspection', 'Damage diagram, signature', true, 13, 'crm'),
('subscription_pass', 'Subscription/Monthly Pass', 'Recurring customers', true, 14, 'crm'),
('customer_feedback', 'Customer Feedback', 'Rating link/QR on invoice', true, 15, 'crm'),
('birthday_anniversary', 'Birthday/Anniversary Wishes', 'Auto greetings', true, 16, 'crm'),
-- Financial
('expense_tracking', 'Expense Tracking', 'Operational costs', true, 20, 'financial'),
('profit_loss', 'Profit & Loss', 'Income - Expenses report', true, 21, 'financial'),
('employee_commission', 'Employee Commission', 'Staff commission calc', true, 22, 'financial'),
('supplier_management', 'Supplier Management', 'Vendors, PO history', true, 23, 'financial'),
('multiple_payments', 'Multiple Payment Methods', 'Split payments', true, 24, 'financial'),
('analytics', 'Advanced Analytics', 'Charts, peak hours', true, 25, 'financial'),
-- Operational
('queue_management', 'Queue Management', 'Token, status tracking', true, 30, 'operational'),
('waiting_display', 'Waiting Area Display', 'TV mode', true, 31, 'operational'),
('sms_whatsapp', 'SMS/WhatsApp', 'Notifications', true, 32, 'operational'),
('staff_attendance', 'Staff Attendance', 'Clock in/out', true, 33, 'operational'),
('equipment_maintenance', 'Equipment Maintenance', 'Machinery reminders', true, 34, 'operational'),
('mechanic_bay_view', 'Mechanic/Bay View', 'Tablet mode', true, 35, 'operational'),
-- Advanced
('anpr', 'ANPR Placeholder', 'Number plate API', true, 40, 'advanced'),
('offline_sync', 'Offline Sync', 'Cache invoices', true, 41, 'advanced'),
('audit_logs', 'Audit Logs', 'Immutable action log', true, 42, 'advanced'),
('data_export', 'Data Export', 'CSV/Excel/PDF', true, 43, 'advanced'),
('document_expiry', 'Document Expiry', 'License/Insurance alerts', true, 44, 'advanced'),
('holiday_slot_blocker', 'Holiday/Slot Blocker', 'Closed dates', true, 45, 'advanced'),
('settings', 'Settings & Customization', 'Theme, feature toggles', true, 99, 'core');

-- =============================================
-- 2. USERS & ROLES (extends Supabase auth if needed)
-- =============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'manager', 'staff', 'cashier')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 3. CUSTOMERS & VEHICLES
-- =============================================
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  notes TEXT,
  loyalty_points INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  plate_number TEXT NOT NULL,
  make TEXT,
  model TEXT,
  year INT,
  color TEXT,
  revenue_license_expiry DATE,
  insurance_expiry DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(plate_number)
);

CREATE INDEX idx_vehicles_plate ON vehicles(plate_number);
CREATE INDEX idx_vehicles_customer ON vehicles(customer_id);

-- =============================================
-- 4. SERVICES & PACKAGES
-- =============================================
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(12,2) NOT NULL DEFAULT 0,
  duration_minutes INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE service_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  total_price DECIMAL(12,2) NOT NULL DEFAULT 0,
  services JSONB DEFAULT '[]', -- [{ service_id, qty, price }]
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 5. INVENTORY
-- =============================================
CREATE TABLE inventory_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku TEXT UNIQUE,
  name TEXT NOT NULL,
  category TEXT,
  unit TEXT DEFAULT 'pcs',
  quantity DECIMAL(12,2) NOT NULL DEFAULT 0,
  low_stock_threshold DECIMAL(12,2) DEFAULT 5,
  cost_price DECIMAL(12,2) DEFAULT 0,
  selling_price DECIMAL(12,2) DEFAULT 0,
  qr_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE inventory_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id UUID REFERENCES inventory_items(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('in', 'out', 'adjust')),
  quantity DECIMAL(12,2) NOT NULL,
  reference_type TEXT,
  reference_id UUID,
  notes TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_inventory_movements_item ON inventory_movements(item_id);

-- =============================================
-- 6. INVOICES & PAYMENTS
-- =============================================
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number TEXT UNIQUE NOT NULL,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'paid', 'cancelled')),
  subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
  discount DECIMAL(12,2) DEFAULT 0,
  tax DECIMAL(12,2) DEFAULT 0,
  total DECIMAL(12,2) NOT NULL DEFAULT 0,
  loyalty_points_used INT DEFAULT 0,
  loyalty_points_earned INT DEFAULT 0,
  notes TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE invoice_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('service', 'package', 'part')),
  service_id UUID REFERENCES services(id),
  package_id UUID REFERENCES service_packages(id),
  inventory_item_id UUID REFERENCES inventory_items(id),
  description TEXT,
  quantity DECIMAL(12,2) NOT NULL DEFAULT 1,
  unit_price DECIMAL(12,2) NOT NULL,
  total DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  method TEXT NOT NULL CHECK (method IN ('cash', 'card', 'cheque', 'transfer', 'other')),
  amount DECIMAL(12,2) NOT NULL,
  reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_invoices_vehicle ON invoices(vehicle_id);
CREATE INDEX idx_invoices_created ON invoices(created_at);
CREATE INDEX idx_invoices_status ON invoices(status);

-- =============================================
-- 7. JOB CARDS & QUEUE
-- =============================================
CREATE TABLE job_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token_number INT,
  invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'washing', 'drying', 'ready', 'completed')),
  inspection_data JSONB,
  customer_signature TEXT,
  assigned_staff_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_job_cards_status ON job_cards(status);
CREATE INDEX idx_job_cards_created ON job_cards(created_at);

-- =============================================
-- 8. EMPLOYEES & COMMISSION
-- =============================================
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  commission_type TEXT CHECK (commission_type IN ('percentage', 'fixed')),
  commission_value DECIMAL(12,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE job_commissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 9. EXPENSES
-- =============================================
CREATE TABLE expense_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT
);

CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES expense_categories(id),
  amount DECIMAL(12,2) NOT NULL,
  description TEXT,
  expense_date DATE NOT NULL,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 10. SUPPLIERS & PURCHASE ORDERS
-- =============================================
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  contact_person TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE purchase_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID REFERENCES suppliers(id),
  po_number TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'draft',
  total DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 11. SUBSCRIPTIONS / MONTHLY PASS
-- =============================================
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id),
  vehicle_id UUID REFERENCES vehicles(id),
  plan_name TEXT,
  washes_per_month INT,
  used_this_month INT DEFAULT 0,
  period_start DATE,
  period_end DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 12. FEEDBACK & RATINGS
-- =============================================
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID REFERENCES invoices(id),
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  token TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 13. AUDIT LOGS
-- =============================================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);

-- =============================================
-- 14. HOLIDAYS / SLOT BLOCKER
-- =============================================
CREATE TABLE holiday_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  reason TEXT,
  is_full_day BOOLEAN DEFAULT true,
  start_time TIME,
  end_time TIME,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 15. STAFF ATTENDANCE
-- =============================================
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id),
  date DATE NOT NULL,
  clock_in TIMESTAMPTZ,
  clock_out TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id, date)
);

-- =============================================
-- 16. EQUIPMENT MAINTENANCE
-- =============================================
CREATE TABLE equipment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  next_maintenance_date DATE,
  maintenance_interval_days INT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE equipment_maintenance_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipment_id UUID REFERENCES equipment(id),
  maintenance_date DATE NOT NULL,
  description TEXT,
  performed_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 17. LOYALTY RULES (optional config)
-- =============================================
CREATE TABLE loyalty_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  points_per_amount DECIMAL(12,2) NOT NULL,
  amount_currency DECIMAL(12,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- RLS (Row Level Security) - enable per table as needed
-- =============================================
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Feature flags are readable by all authenticated" ON feature_flags FOR SELECT TO authenticated USING (true);
CREATE POLICY "Only admin can update feature flags" ON feature_flags FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
