# Kalupahana Auto Car Wash - ERP System

Production-grade ERP for a vehicle service station with **modular architecture** and feature toggles.

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Shadcn-style components
- **Backend/DB:** Supabase (PostgreSQL)
- **State:** Zustand (feature flags persisted)
- **Icons:** Lucide React

## Feature Flag System

Almost every module can be turned **ON/OFF** via **System Settings** (`/settings`). When a feature is off, it is hidden from the sidebar and logic. Dashboard and System Settings are always visible.

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment**
   - Copy `.env.example` to `.env.local`
   - Add your Supabase URL and anon key (or run without; flags use defaults from local storage)

3. **Database**
   - Create a Supabase project and run `supabase/schema.sql` in the SQL Editor to create tables and seed `feature_flags`.

4. **Run dev server**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000). Use **System Settings** to enable/disable modules.

## Project Structure

- `src/app/` – App Router pages (dashboard, invoices, inventory, settings, etc.)
- `src/components/` – UI components and layout (Sidebar)
- `src/config/navigation.ts` – Nav items and feature flag IDs
- `src/contexts/SettingsProvider.tsx` – Feature flags from DB + refresh
- `src/store/feature-flags.ts` – Zustand store (persisted)
- `src/types/` – Feature flags and DB types
- `supabase/schema.sql` – Full database schema

## Core Modules (Implemented)

- **Dashboard** – Today’s car count, income, active jobs, low stock, top services
- **Smart Invoice** – New invoice with line items, discount, total; print-ready
- **Inventory** – Stock list, add item, low stock alerts, QR placeholder
- **System Settings** – Toggle all features by category

Other modules (Vehicle History, Loyalty, Queue, etc.) have routes and sidebar entries; full implementation can be added incrementally.

## UI/UX

- High-contrast, touch-friendly (min 44px targets)
- Responsive: mobile (owner), tablet (mechanic), desktop (cashier)
- Industrial, clean layout
