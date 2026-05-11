"use client";

import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

/** Main app layout: sidebar + content area. */
export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <main className="min-w-0 flex-1 overflow-auto bg-slate-50">{children}</main>
    </div>
  );
}
