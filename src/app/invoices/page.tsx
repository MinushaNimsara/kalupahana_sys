"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, FileText, Printer } from "lucide-react";
import Link from "next/link";

export default function InvoicesPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Smart Invoice</h1>
        <div className="flex gap-2">
          <Input
            placeholder="Search invoice..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <Link href="/invoices/new">
            <Button size="lg" className="min-h-11 touch-manipulation">
              <Plus className="mr-2 h-5 w-5" />
              New Invoice
            </Button>
          </Link>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
          <CardDescription>Professional bills with branding. Auto-calculate totals. Thermal &amp; A4 print support.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">No invoices yet.</p>
            <Link href="/invoices/new">
              <Button className="mt-4 min-h-11">
                <Plus className="mr-2 h-5 w-5" />
                Create first invoice
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
