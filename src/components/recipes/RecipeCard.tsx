"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Clock, ChefHat } from "lucide-react";
import type { RecipeSummary, TrendingRecipe } from "@/libs/interfaceDTO";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const DIFFICULTY_LABELS: Record<number, string> = {
  0: "Easy",
  1: "Medium",
  2: "Hard",
};

const PLACEHOLDER_IMAGE = "https://placehold.co/400x300/e2e8f0/64748b?text=Recipe";

type RecipeCardProps = {
  recipe: RecipeSummary | TrendingRecipe;
  variant?: "default" | "trending" | "compact";
};

export default function RecipeCard({ recipe, variant = "default" }: RecipeCardProps) {
  const isTrending = "trendingScore" in recipe && "trendingSince" in recipe;
  const summary = "totalTimeMinutes" in recipe ? recipe : null;

  return (
    <Link href={`/recipe/${recipe.id}`}>
      <Card className="group overflow-hidden h-full transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:ring-2 hover:ring-amber-500/30 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 pt-0">
        <div className="relative aspect-4/3  w-full bg-zinc-100 dark:bg-zinc-800">
          <Image
            src={recipe.imageUrl || PLACEHOLDER_IMAGE}
            alt={recipe.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized={!recipe.imageUrl}
          />
          {isTrending && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-amber-500/90 text-white border-0 font-medium">
                🔥 Trending
              </Badge>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-3">
            <div className="flex items-center gap-2 text-white/90 text-sm">
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                {recipe.rating?.toFixed(1) ?? "—"}
              </span>
              <span>•</span>
              <span>{recipe.reviewCount ?? 0} reviews</span>
              {isTrending && "trendingSince" in recipe && (
                <>
                  <span>•</span>
                  <span className="text-white/80">{recipe.trendingSince}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <CardHeader className="pb-2">
          <h3 className="font-semibold text-lg text-zinc-900 dark:text-white line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
            {recipe.name}
          </h3>
          {summary && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              <Badge variant="secondary" className="text-xs font-normal">
                {summary.cuisine}
              </Badge>
              {summary.difficulty !== undefined && (
                <Badge variant="outline" className="text-xs font-normal">
                  <ChefHat className="w-3 h-3 mr-0.5" />
                  {DIFFICULTY_LABELS[summary.difficulty] ?? "—"}
                </Badge>
              )}
            </div>
          )}
        </CardHeader>
        {variant !== "compact" && "description" in recipe && recipe.description && (
          <CardContent className="pt-0">
            <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
              {recipe.description}
            </p>
            {summary && (
              <div className="flex items-center gap-2 mt-3 text-xs text-zinc-400 dark:text-zinc-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {summary.totalTimeMinutes} min
                </span>
                <span>•</span>
                <span>{summary.servings} servings</span>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </Link>
  );
}
