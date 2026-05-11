"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Admin Panel</h1>
      <Card>
        <CardHeader>
          <CardTitle>Full data control</CardTitle>
          <CardDescription>Edit/delete records. Restricted to Admin role.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
            <Users className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">Admin tools will be available here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
