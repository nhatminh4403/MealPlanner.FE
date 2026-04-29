"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Clock, ChefHat, Users, Flame } from "lucide-react";
import type { RecipeSummary, TrendingRecipe } from "@/libs/interfaceDTO";
import { Badge } from "@/components/ui/badge";
import { useLocalization } from "@/libs/LocalizationProvider";

const DIFFICULTY_LABEL_KEYS: Record<number, string> = {
  0: "Unit:Easy",
  1: "Unit:Medium",
  2: "Unit:Hard",
};

const DIFFICULTY_COLORS: Record<number, string> = {
  0: "text-emerald-600 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950 dark:border-emerald-800",
  1: "text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950 dark:border-amber-800",
  2: "text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950 dark:border-red-800",
};

const PLACEHOLDER_IMAGE =
  "https://placehold.co/400x300/e2e8f0/64748b?text=Recipe";

type RecipeCardProps = {
  recipe: RecipeSummary | TrendingRecipe;
  variant?: "default" | "trending" | "compact";
};

export default function RecipeCard({
  recipe,
  variant = "default",
}: RecipeCardProps) {
  const { L } = useLocalization();
  const isTrending = "trendingScore" in recipe && "trendingSince" in recipe;
  const summary = "totalTimeMinutes" in recipe ? recipe : null;

  return (
    <Link
      href={`/recipe/${recipe.id}`}
      className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl block h-full"
    >
      <article className="relative overflow-hidden rounded-2xl border border-border bg-card h-full flex flex-col transition-all duration-300 group-hover:shadow-brand-glow group-hover:-translate-y-0.5 group-hover:border-primary/30">
        {/* Image */}
        <div className="relative aspect-4/3 w-full overflow-hidden bg-muted shrink-0">
          <Image
            src={recipe.imageUrl || PLACEHOLDER_IMAGE}
            alt={recipe.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized={!recipe.imageUrl}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

          {/* Trending badge */}
          {isTrending && (
            <div className="absolute top-2.5 left-2.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/90 backdrop-blur-sm px-2.5 py-1 text-[11px] font-bold text-white shadow">
                <Flame className="w-3 h-3" aria-hidden="true" />
                {L("MealPlannerAPI", "Recipes:TrendingLabel")}
              </span>
            </div>
          )}

          {/* Rating pill — bottom left */}
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 rounded-full bg-black/50 backdrop-blur-sm px-2.5 py-1">
            <Star
              className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0"
              aria-hidden="true"
            />
            <span className="text-xs font-bold text-white tabular-nums">
              {recipe.rating?.toFixed(1) ?? "—"}
            </span>
            <span className="text-[10px] text-white/70">
              ({recipe.reviewCount ?? 0})
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-4 gap-2">
          {/* Title */}
          <h3 className="font-bold text-base text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
            {recipe.name}
          </h3>

          {/* Badges row */}
          {summary && (
            <div className="flex flex-wrap gap-1.5">
              {summary.cuisine && (
                <Badge
                  variant="secondary"
                  className="text-[11px] font-medium px-2 py-0.5"
                >
                  {summary.cuisine}
                </Badge>
              )}
              {summary.difficulty !== undefined && (
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${DIFFICULTY_COLORS[summary.difficulty] ?? ""}`}
                >
                  <ChefHat className="w-3 h-3" aria-hidden="true" />
                  {L(
                    "MealPlannerAPI",
                    DIFFICULTY_LABEL_KEYS[summary.difficulty] ?? "Unit:Easy",
                  )}
                </span>
              )}
            </div>
          )}

          {/* Description */}
          {variant !== "compact" &&
            "description" in recipe &&
            recipe.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed flex-1">
                {recipe.description}
              </p>
            )}

          {/* Footer meta */}
          {summary && (
            <div className="flex items-center gap-3 pt-1 mt-auto text-xs text-muted-foreground border-t border-border/60">
              <span className="flex items-center gap-1 pt-2">
                <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                {summary.totalTimeMinutes}{" "}
                {L("MealPlannerAPI", "Recipes:MinShort")}
              </span>
              <span className="flex items-center gap-1 pt-2">
                <Users className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                {summary.servings} {L("MealPlannerAPI", "Recipes:Servings")}
              </span>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
