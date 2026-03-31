"use client";

import React from "react";
import { useLocalization } from "@/libs/localization";
import { ChefHat, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function RecipeHeader() {
  const { L } = useLocalization();
  const router = useRouter();

  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => router.back()}
          className="rounded-full"
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ChefHat className="size-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {L("MealPlannerAPI", "AddNewRecipe") || "Add New Recipe"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {L("MealPlannerAPI", "ShareYourCulinaryCreation") ||
                "Share your culinary creation with the world"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
