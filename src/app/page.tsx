"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, FileText, TrendingUp, Package } from "lucide-react";

const statCards = [
  {
    title: "Today's Car Count",
    value: "0",
    subtitle: "Vehicles serviced today",
    icon: Car,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    title: "Today's Income",
    value: "LKR 0",
    subtitle: "Total revenue today",
    icon: TrendingUp,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    title: "Active Jobs",
    value: "0",
    subtitle: "In progress",
    icon: FileText,
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
  },
  {
    title: "Low Stock Alerts",
    value: "0",
    subtitle: "Items below threshold",
    icon: Package,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
];

export default function DashboardPage() {
  return (
    <div className="p-6 md:p-8">
      <h1 className="mb-8 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className="overflow-hidden rounded-xl border-slate-200/80 bg-white shadow-md shadow-slate-200/50 transition-shadow hover:shadow-lg hover:shadow-slate-200/50"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  {stat.title}
                </CardTitle>
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${stat.iconBg} ${stat.iconColor}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold tracking-tight text-slate-900">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-slate-600">{stat.subtitle}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card className="overflow-hidden rounded-xl border-slate-200/80 bg-white shadow-md shadow-slate-200/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">
              Top Services
            </CardTitle>
            <CardDescription className="text-slate-600">
              Most used services this period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              No data yet. Start creating invoices to see top services.
            </p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden rounded-xl border-slate-200/80 bg-white shadow-md shadow-slate-200/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">
              Profit Estimate
            </CardTitle>
            <CardDescription className="text-slate-600">
              Income minus expenses (today)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tracking-tight text-slate-900">
              LKR 0
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Enable Expense Tracking for accurate P&amp;L.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
