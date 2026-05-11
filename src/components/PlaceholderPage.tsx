import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from "lucide-react";

export function PlaceholderPage({ title, description }: { title: string; description?: string }) {
  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">{title}</h1>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Construction className="mb-4 h-12 w-12 text-muted-foreground" />
          <CardTitle className="mb-2">Coming soon</CardTitle>
          <CardDescription>{description ?? `This module will be implemented here.`}</CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
