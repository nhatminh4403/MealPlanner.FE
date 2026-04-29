"use client";

import React from "react";
import RecipeCard from "./RecipeCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { RecipeSummary, TrendingRecipe } from "@/libs/interfaceDTO";

interface RecipeSectionProps {
  title: string;
  icon: React.ReactNode;
  recipes: (RecipeSummary | TrendingRecipe)[];
  loading: boolean;
  emptyMessage: string;
  variant?: "default" | "trending" | "compact";
}

function RecipeCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <Skeleton className="aspect-4/3 w-full rounded-none" />
      <div className="p-4 space-y-2.5">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <div className="flex gap-3 pt-2 border-t border-border/60">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}

export default function RecipeSection({
  title,
  icon,
  recipes,
  loading,
  emptyMessage,
  variant = "default",
}: RecipeSectionProps) {
  return (
    <section>
      {(title || icon) && (
        <div className="flex items-center gap-2 mb-6">
          {icon && (
            <div className="flex items-center justify-center">{icon}</div>
          )}
          {title && (
            <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          )}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <RecipeCardSkeleton key={i} />
          ))}
        </div>
      ) : recipes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 rounded-2xl border-2 border-dashed border-border text-center">
          <span className="text-4xl mb-3" aria-hidden="true">🍽️</span>
          <p className="text-muted-foreground text-sm">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} variant={variant} />
          ))}
        </div>
      )}
    </section>
  );
}
