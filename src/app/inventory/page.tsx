"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, Plus, QrCode, Search, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function InventoryPage() {
  const [search, setSearch] = useState("");

  const items: { id: string; name: string; sku: string; quantity: number; lowThreshold: number; unit: string }[] = [];
  const lowStockCount = items.filter((i) => i.quantity <= i.lowThreshold).length;

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Inventory</h1>
        <div className="flex gap-2">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search stock..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="min-h-11 pl-9"
            />
          </div>
          <Button size="lg" className="min-h-11 touch-manipulation">
            <QrCode className="mr-2 h-5 w-5" />
            Scan QR
          </Button>
          <Link href="/inventory/new">
            <Button size="lg" variant="secondary" className="min-h-11 touch-manipulation">
              <Plus className="mr-2 h-5 w-5" />
              Add Item
            </Button>
          </Link>
        </div>
      </div>

      {lowStockCount > 0 && (
        <Card className="mb-6 border-amber-500/50 bg-amber-500/5">
          <CardContent className="flex items-center gap-2 py-4">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <span className="font-medium">Low stock: {lowStockCount} item(s) below threshold.</span>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Stock (Oils, Filters, Shampoos)</CardTitle>
          <CardDescription>Manage stock. Generate and scan QR to deduct or add. Low stock alerts.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
            <Package className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">No inventory items yet.</p>
            <Link href="/inventory/new">
              <Button className="mt-4 min-h-11">
                <Plus className="mr-2 h-5 w-5" />
                Add first item
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
