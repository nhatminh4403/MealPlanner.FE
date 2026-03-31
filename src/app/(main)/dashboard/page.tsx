"use client";
import React from "react";
import { useLocalization } from "@/libs/localization";

export default function DashboardPage() {
  const { L } = useLocalization();
  // TODO: Fetch dashboard data from API
  return (
    <div className="w-full max-w-6xl mx-auto px-6 pt-24 pb-12 animate-page-in">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
        {L("MealPlannerAPI", "Dashboard")}
      </h1>
      <p className="mt-2 text-zinc-500">
        {L("MealPlannerAPI", "DashboardOverview")}
      </p>
    </div>
  );
}
