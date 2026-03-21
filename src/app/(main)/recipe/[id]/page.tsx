"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { recipes as recipeApi } from "@/libs/api";
import type { Recipe } from "@/libs/interfaceDTO";
import {
  Star,
  Clock,
  ChefHat,
  Users,
  ArrowLeft,
  Loader2,
  UtensilsCrossed,
  ListChecks,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const DIFFICULTY_LABELS: Record<number, string> = {
  0: "Easy",
  1: "Medium",
  2: "Hard",
};

const PLACEHOLDER_IMAGE = "https://placehold.co/1200x600/e2e8f0/64748b?text=Recipe";

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    async function fetchRecipe() {
      try {
        setLoading(true);
        setError(null);
        const res = await recipeApi.get(id);

        setRecipe(res.data);
        console.log("recipe", res.data);
      } catch (err: unknown) {
        setRecipe(null);
        setError(err && typeof err === "object" && "response" in err
          ? "Recipe not found."
          : "Failed to load recipe.");
      } finally {
        setLoading(false);
      }
    }
    fetchRecipe();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-12 h-12 animate-spin text-amber-500 mb-4" />
        <p className="text-zinc-500 dark:text-zinc-400">Loading recipe...</p>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16 text-center">
        <p className="text-zinc-600 dark:text-zinc-400 mb-4">{error ?? "Recipe not found."}</p>
        <Button variant="outline" onClick={() => router.push("/recipe")} className="cursor-default">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Recipes
        </Button>
      </div>
    );
  }

  const totalTime = (recipe.prepTimeMinutes ?? 0) + (recipe.cookingTimeMinutes ?? 0);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-8">
      <Button
        variant="ghost"
        size="sm"
        className="mb-4 -ml-2"
        onClick={() => router.push("/recipe")}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Recipes
      </Button>

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Left column: Hero, meta, tags, description, nutrition */}
        <div className="space-y-4">
          {/* Hero image */}
          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
            <Image
              src={recipe.imageUrl || PLACEHOLDER_IMAGE}
              alt={recipe.name}
              fill
              loading="eager"
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              unoptimized={!recipe.imageUrl}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h1 className="text-2xl sm:text-3xl font-bold drop-shadow-lg">{recipe.name}</h1>
              {recipe.author && (
                <Link
                  href={`/profile/${recipe.author.id}`}
                  className="mt-2 flex items-center gap-2 text-white/90 hover:text-white transition-colors"
                >
                  <Avatar className="w-6 h-6 border border-white/30">
                    <AvatarImage src={recipe.author.avatarUrl} />
                    <AvatarFallback className="text-xs bg-white/20">
                      {recipe.author.name?.charAt(0) ?? "?"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{recipe.author.name}</span>
                </Link>
              )}
            </div>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span className="font-medium text-zinc-900 dark:text-white">{recipe.rating?.toFixed(1) ?? "—"}</span>
              <span>({recipe.reviewCount ?? 0} reviews)</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
              <Clock className="w-5 h-5" />
              <span>{totalTime} min total</span>
              {recipe.prepTimeMinutes > 0 && (
                <span className="text-zinc-400 dark:text-zinc-500">({recipe.prepTimeMinutes} min prep + {recipe.cookingTimeMinutes} min cook)</span>
              )}
            </div>
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
              <Users className="w-5 h-5" />
              <span>{recipe.servings} servings</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
              <ChefHat className="w-5 h-5" />
              <span>{DIFFICULTY_LABELS[recipe.difficulty] ?? "—"}</span>
            </div>
            {recipe.cuisine && (
              <Badge variant="secondary">{recipe.cuisine}</Badge>
            )}
          </div>

          {/* Tags */}
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {recipe.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="font-normal">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Description */}
          {recipe.description && (
            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-snug">
              {recipe.description}
            </p>
          )}

          {/* Nutrition */}
          {recipe.nutritionPerServing && (
            <section className="p-4 mt-[32] rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-white mb-3">
                <Flame className="w-5 h-5 text-amber-500" />
                Nutrition per Serving
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <div className="text-center p-2 rounded-lg bg-white dark:bg-zinc-800/50">
                  <p className="text-xl font-bold text-amber-600 dark:text-amber-400">
                    {Math.round(recipe.nutritionPerServing.calories)}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Calories</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-white dark:bg-zinc-800/50">
                  <p className="text-xl font-bold text-zinc-900 dark:text-white">
                    {recipe.nutritionPerServing.proteinGrams.toFixed(0)}g
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Protein</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-white dark:bg-zinc-800/50">
                  <p className="text-xl font-bold text-zinc-900 dark:text-white">
                    {recipe.nutritionPerServing.carbsGrams.toFixed(0)}g
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Carbs</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-white dark:bg-zinc-800/50">
                  <p className="text-xl font-bold text-zinc-900 dark:text-white">
                    {recipe.nutritionPerServing.fatGrams.toFixed(0)}g
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Fat</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-white dark:bg-zinc-800/50 col-span-2 sm:col-span-1">
                  <p className="text-xl font-bold text-zinc-900 dark:text-white">
                    {recipe.nutritionPerServing.fiberGrams.toFixed(0)}g
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Fiber</p>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Right column: Ingredients and Instructions */}
        <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          {/* Ingredients */}
          <section className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-white mb-3">
              <ListChecks className="w-5 h-5 text-amber-500" />
              Ingredients
            </h2>
            <ul className="space-y-1">
              {recipe.ingredients?.map((ing) => (
                <li
                  key={ing.id}
                  className="flex items-start gap-2 text-zinc-700 dark:text-zinc-300"
                >
                  <span className="text-amber-500 mt-0.5">•</span>
                  <span>
                    {ing.displayQuantity
                      ? `${ing.displayQuantity} ${ing.name}`
                      : ing.quantityGrams > 0
                      ? `${ing.quantityGrams}g ${ing.name}`
                      : ing.name}
                  </span>
                </li>
              ))}
              {(!recipe.ingredients || recipe.ingredients.length === 0) && (
                <li className="text-zinc-500 dark:text-zinc-400">No ingredients listed.</li>
              )}
            </ul>
          </section>

          {/* Instructions */}
          <section className="p-4 mt-[32] rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-white mb-3">
              <UtensilsCrossed className="w-5 h-5 text-amber-500" />
              Instructions
            </h2>
            <ol className="space-y-2">
              {recipe.instructions?.map((step, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="shrink-0 w-7 h-7 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-medium flex items-center justify-center text-sm">
                    {idx + 1}
                  </span>
                  <span className="text-zinc-700 dark:text-zinc-300 pt-0.5">{step}</span>
                </li>
              ))}
              {(!recipe.instructions || recipe.instructions.length === 0) && (
                <li className="text-zinc-500 dark:text-zinc-400">No instructions yet.</li>
              )}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
