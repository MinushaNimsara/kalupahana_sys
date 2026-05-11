"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Printer } from "lucide-react";
import Link from "next/link";

type LineItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

export default function NewInvoicePage() {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [items, setItems] = useState<LineItem[]>([]);
  const [discount, setDiscount] = useState(0);

  const subtotal = items.reduce((s, i) => s + i.total, 0);
  const total = Math.max(0, subtotal - discount);

  function addLine() {
    setItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        description: "",
        quantity: 1,
        unitPrice: 0,
        total: 0,
      },
    ]);
  }

  function updateLine(id: string, field: keyof LineItem, value: string | number) {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const next = { ...item, [field]: value };
        if (field === "quantity" || field === "unitPrice") {
          next.total = Number(next.quantity) * Number(next.unitPrice);
        }
        return next;
      })
    );
  }

  function removeLine(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">New Invoice</h1>
        <div className="flex gap-2">
          <Link href="/invoices">
            <Button variant="outline" size="lg" className="min-h-11">
              Cancel
            </Button>
          </Link>
          <Button size="lg" className="min-h-11">
            <Printer className="mr-2 h-5 w-5" />
            Save &amp; Print
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Bill details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">Vehicle number</label>
            <Input
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              placeholder="e.g. CAR-1234"
              className="min-h-11"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Customer name</label>
            <Input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Customer name"
              className="min-h-11"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Items (Services + Parts)</CardTitle>
          <Button onClick={addLine} size="lg" className="min-h-11">
            <Plus className="mr-2 h-5 w-5" />
            Add line
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items.length === 0 ? (
              <p className="py-4 text-center text-muted-foreground">No items. Click &quot;Add line&quot; to add services or parts.</p>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex flex-wrap items-end gap-2 rounded-lg border p-3">
                  <div className="min-w-[200px] flex-1">
                    <label className="mb-1 block text-xs font-medium">Description</label>
                    <Input
                      value={item.description}
                      onChange={(e) => updateLine(item.id, "description", e.target.value)}
                      placeholder="Service or part"
                      className="min-h-11"
                    />
                  </div>
                  <div className="w-24">
                    <label className="mb-1 block text-xs font-medium">Qty</label>
                    <Input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateLine(item.id, "quantity", Number(e.target.value) || 0)}
                      className="min-h-11"
                    />
                  </div>
                  <div className="w-32">
                    <label className="mb-1 block text-xs font-medium">Unit price (LKR)</label>
                    <Input
                      type="number"
                      min={0}
                      value={item.unitPrice || ""}
                      onChange={(e) => updateLine(item.id, "unitPrice", Number(e.target.value) || 0)}
                      className="min-h-11"
                    />
                  </div>
                  <div className="w-28 text-right font-medium">LKR {item.total.toLocaleString()}</div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="min-h-11 min-w-11"
                    onClick={() => removeLine(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-end gap-4 border-t pt-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Discount (LKR)</label>
              <Input
                type="number"
                min={0}
                value={discount || ""}
                onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                className="w-28 min-h-11"
              />
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Subtotal: LKR {subtotal.toLocaleString()}</p>
              <p className="text-xl font-bold">Total: LKR {total.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
