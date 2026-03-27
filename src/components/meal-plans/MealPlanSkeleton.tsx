import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function MealPlanSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-72 w-full rounded-3xl" />
      ))}
    </div>
  );
}
