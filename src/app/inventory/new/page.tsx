"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QrCode } from "lucide-react";
import Link from "next/link";

export default function NewInventoryItemPage() {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [lowStockThreshold, setLowStockThreshold] = useState(5);
  const [unit, setUnit] = useState("pcs");
  const [costPrice, setCostPrice] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Add inventory item</h1>
        <Link href="/inventory">
          <Button variant="outline" size="lg" className="min-h-11">
            Cancel
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Item details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">Name *</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Engine Oil 5W-30" className="min-h-11" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">SKU</label>
            <Input value={sku} onChange={(e) => setSku(e.target.value)} placeholder="e.g. OIL-5W30-1L" className="min-h-11" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Category</label>
            <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Oils, Filters" className="min-h-11" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Unit</label>
            <Input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="pcs, L, kg" className="min-h-11" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Quantity</label>
            <Input type="number" min={0} value={quantity || ""} onChange={(e) => setQuantity(Number(e.target.value) || 0)} className="min-h-11" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Low stock threshold</label>
            <Input type="number" min={0} value={lowStockThreshold || ""} onChange={(e) => setLowStockThreshold(Number(e.target.value) || 0)} className="min-h-11" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Cost price (LKR)</label>
            <Input type="number" min={0} value={costPrice || ""} onChange={(e) => setCostPrice(Number(e.target.value) || 0)} className="min-h-11" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Selling price (LKR)</label>
            <Input type="number" min={0} value={sellingPrice || ""} onChange={(e) => setSellingPrice(Number(e.target.value) || 0)} className="min-h-11" />
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-end gap-2">
        <Button size="lg" variant="secondary" className="min-h-11">
          <QrCode className="mr-2 h-5 w-5" />
          Generate QR
        </Button>
        <Button size="lg" className="min-h-11">Save item</Button>
      </div>
    </div>
  );
}
