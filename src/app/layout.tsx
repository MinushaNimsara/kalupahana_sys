import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ConfigProvider } from "@/contexts/ConfigProvider";
import { SettingsProvider } from "@/contexts/SettingsProvider";
import { Layout } from "@/components/layout/Layout";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Car Wash ERP",
  description: "ERP system for vehicle service station",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationError>
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
        <ConfigProvider>
          <SettingsProvider>
            <Layout>{children}</Layout>
          </SettingsProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
