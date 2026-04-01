"use client";
import React from "react";
import { Search } from "lucide-react";
import { RecipeSummary, TrendingRecipe } from "@/libs/interfaceDTO";
import RecipeSelectionCard from "./RecipeSelectionCard";

interface RecipeSelectionGridProps {
  recipes: (RecipeSummary | TrendingRecipe)[];
  listType: string;
  searchTerm?: string;
  addingId?: string | null;
  onAdd: (recipe: RecipeSummary | TrendingRecipe) => void;
  emptyState?: React.ReactNode;
}

export default function RecipeSelectionGrid({
  recipes,
  listType,
  searchTerm = "",
  addingId = null,
  onAdd,
  emptyState,
}: RecipeSelectionGridProps) {
  const filtered = searchTerm
    ? recipes.filter((r) =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : recipes;

  if (filtered.length === 0) {
    if (searchTerm) {
      return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
            <Search size={28} className="text-zinc-600" />
          </div>
          <p className="text-zinc-400 font-semibold mb-1">No recipes found</p>
          <p className="text-zinc-600 text-sm">Try a different search term</p>
        </div>
      );
    }
    return <>{emptyState}</>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 gap-4">
      {filtered.map((recipe) => (
        <RecipeSelectionCard
          key={recipe.id}
          recipe={recipe}
          listType={listType}
          isAdding={addingId === recipe.id}
          onAdd={onAdd}
          disabled={addingId !== null}
        />
      ))}
    </div>
  );
}
