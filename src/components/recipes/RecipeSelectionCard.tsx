"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Star, Clock, Flame } from "lucide-react";
import { RecipeSummary, TrendingRecipe } from "@/libs/interfaceDTO";

interface RecipeSelectionCardProps {
  recipe: RecipeSummary | TrendingRecipe;
  isAdding?: boolean;
  onAdd?: (recipe: RecipeSummary | TrendingRecipe) => void;
  listType?: string;
  disabled?: boolean;
}

export default function RecipeSelectionCard({
  recipe,
  isAdding = false,
  onAdd,
  listType,
  disabled = false,
}: RecipeSelectionCardProps) {
  const isTrending = listType === "trending" && "trendingScore" in recipe;

  return (
    <div
      className="
      group relative flex flex-col overflow-hidden rounded-2xl
      bg-white/3 border border-white/6

      transform-gpu will-change-transform
      transition-all duration-300 ease-out

      hover:-translate-y-0.5
      hover:border-white/12
      "
    >
      {/* Smooth shadow layer (no flicker) */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-[0_20px_60px_rgba(0,0,0,0.4)]" />

      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={
            recipe.imageUrl ||
            "https://placehold.co/600x338/1a1a1a/444?text=Recipe"
          }
          alt={recipe.name}
          fill
          className="
            object-cover
            transition-transform duration-500 ease-out
            transform-gpu will-change-transform
            group-hover:scale-105
          "
          unoptimized
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Trending badge */}
        <div className="absolute top-3 left-3 flex gap-2 pointer-events-none">
          {isTrending && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider shadow-lg">
              <Flame size={10} /> Hot
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="absolute bottom-3 left-3 pointer-events-none">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-black/40 backdrop-blur-md border border-white/10">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span className="text-white text-[12px] font-bold">
              {recipe.rating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* View Details */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link
            href={`/recipe/${recipe.id}`}
            className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white text-xs font-bold hover:bg-white hover:text-black transition-all flex items-center gap-2"
          >
            View Details
          </Link>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-4 bg-linear-to-b from-transparent to-white/2">
        <div className="flex-1 space-y-1.5">
          <h3 className="font-bold text-white leading-tight line-clamp-2 text-sm group-hover:text-emerald-400 transition-colors duration-300">
            {recipe.name}
          </h3>

          <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-medium">
            {"totalTimeMinutes" in recipe && recipe.totalTimeMinutes ? (
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {recipe.totalTimeMinutes}m
              </span>
            ) : null}

            {"cuisine" in recipe && recipe.cuisine ? (
              <>
                <span className="text-zinc-700">·</span>
                <span>{recipe.cuisine}</span>
              </>
            ) : null}
          </div>
        </div>

        {/* Button */}
        {onAdd && (
          <button
            onClick={() => onAdd(recipe)}
            disabled={disabled || isAdding}
            className="
              w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2
              transition-all duration-300 disabled:opacity-40

              bg-white/5 text-white border border-white/10
              group-hover:bg-white group-hover:text-zinc-950
            "
          >
            {isAdding ? (
              <div
                className="h-4 w-4 border-2 border-current
                            border-t-transparent rounded-full
                            animate-spin"
              />
            ) : (
              <>
                <Plus
                  className="transition-transform duration-300 group-hover:rotate-90"
                  size={15}
                />
                Add to Plan
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
