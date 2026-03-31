"use client";
import React from "react";
import { useLocalization } from "@/libs/localization";

export default function ProfilePage() {
  const { L } = useLocalization();
  // TODO: Fetch profile data from API
  return (
    <div className="w-full max-w-6xl mx-auto px-6 pt-24 pb-12">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
        {L("MealPlannerAPI", "Profile")}
      </h1>
      <p className="mt-2 text-zinc-500">
        {L("MealPlannerAPI", "ProfileDescription")}
      </p>
    </div>
  );
}
