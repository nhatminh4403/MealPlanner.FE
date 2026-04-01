"use client";

import type { RecipeSummary } from "@/libs/interfaceDTO";
import RecipeCard from "./RecipeCard";

interface RecipeCardGridProps {
  recipes: RecipeSummary[];
  className?: string;
}

export default function RecipeCardGrid({
  recipes,
  className = "",
}: RecipeCardGridProps) {
  return (
    <div
      className={`grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ${className}`}
    >
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}
