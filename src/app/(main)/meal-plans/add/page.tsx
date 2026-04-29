"use client";

import React from "react";
import Link from "next/link";
import { CalendarPlus, Sparkles, ArrowRight, CalendarDays } from "lucide-react";
import { AppPageHeader } from "@/components/layout/AppPageHeader";
import { AppSection } from "@/components/layout/AppSection";
import { Button } from "@/components/ui/button";
import { useLocalization } from "@/libs/LocalizationProvider";

export default function AddMealPlanPage() {
  const { L } = useLocalization();

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16 animate-page-in">
      <AppPageHeader
        className="mb-8"
        gradientClassName="bg-primary-secondary-205"
        icon={CalendarPlus}
        title={L("MealPlannerAPI", "MealPlan:AddPageTitle")}
        description={L("MealPlannerAPI", "MealPlan:AddPageDescription")}
      />

      <AppSection
        title={L("MealPlannerAPI", "MealPlan:HowToStartTitle")}
        description={L("MealPlannerAPI", "MealPlan:HowToStartDescription")}
        icon={Sparkles}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-border bg-background/70 p-5">
            <p className="text-sm font-semibold text-foreground mb-2">
              {L("MealPlannerAPI", "MealPlan:StartFromExistingTitle")}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              {L("MealPlannerAPI", "MealPlan:StartFromExistingDescription")}
            </p>
            <Button asChild className="bg-brand-gradient text-white hover:opacity-90">
              <Link href="/meal-plans">
                {L("MealPlannerAPI", "MealPlan:GoToMealPlans")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="rounded-2xl border border-border bg-background/70 p-5">
            <p className="text-sm font-semibold text-foreground mb-2">
              {L("MealPlannerAPI", "MealPlan:PickRecipesTitle")}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              {L("MealPlannerAPI", "MealPlan:PickRecipesDescription")}
            </p>
            <Button asChild variant="outline">
              <Link href="/recipe">
                {L("MealPlannerAPI", "MealPlan:BrowseRecipes")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </AppSection>

      <div className="mt-6 rounded-2xl border border-border bg-primary-secondary-radial p-5 flex items-start gap-3">
        <CalendarDays className="h-5 w-5 text-primary mt-0.5" />
        <p className="text-sm text-muted-foreground">
          {L("MealPlannerAPI", "MealPlan:AddPageHint")}
        </p>
      </div>
    </div>
  );
}
