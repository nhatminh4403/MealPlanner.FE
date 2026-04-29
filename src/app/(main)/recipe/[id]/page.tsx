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
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLocalization } from "@/libs/LocalizationProvider";
import { userProfiles } from "@/libs/api";
import type { UserProfile } from "@/libs/interfaceDTO";
import { isAuthenticated } from "@/libs/axios";

const getDifficultyLabels = (
  L: (resourceName: string, key: string) => string,
): Record<number, string> => ({
  0: L("MealPlannerAPI", "Unit:Easy"),
  1: L("MealPlannerAPI", "Unit:Medium"),
  2: L("MealPlannerAPI", "Unit:Hard"),
});

const PLACEHOLDER_IMAGE =
  "https://placehold.co/1200x600/e2e8f0/64748b?text=Recipe";

export default function RecipeDetailPage() {
  const { L } = useLocalization();
  const DIFFICULTY_LABELS = getDifficultyLabels(L);
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
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
        setError(
          err && typeof err === "object" && "response" in err
            ? L("MealPlannerAPI", "RecipeNotFound")
            : L("MealPlannerAPI", "FailedToLoadRecipe"),
        );
      } finally {
        setLoading(false);
      }
    }
    fetchRecipe();

    if (isAuthenticated()) {
      userProfiles
        .getMe()
        .then((res) => {
          if (res.data) setCurrentUser(res.data);
        })
        .catch(() => {
          // Silently fail if failing to get user profile
        });
    }
  }, [id, L]);

  const handleDelete = async () => {
    if (!id || !recipe) return;
    if (
      !confirm(
        L("MealPlannerAPI", "DeleteRecipeConfirmation") ||
          "Are you sure you want to delete this recipe?",
      )
    )
      return;

    try {
      await recipeApi.delete(id);
      toast.success(
        L("MealPlannerAPI", "RecipeDeleted") || "Recipe deleted successfully",
      );
      router.push("/recipe");
    } catch {
      toast.error(
        L("MealPlannerAPI", "FailedToDeleteRecipe") ||
          "Failed to delete recipe",
      );
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-12 h-12 animate-spin text-amber-500 mb-4" />
        <p className="text-muted-foreground">
          {L("MealPlannerAPI", "Recipes:Loading")}
        </p>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16 text-center">
        <p className="text-muted-foreground mb-4">
          {error ?? L("MealPlannerAPI", "Recipes:NotFound")}
        </p>
        <Button variant="outline" onClick={() => router.push("/recipe")}>
          <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
          {L("MealPlannerAPI", "Recipes:BackToList")}
        </Button>
      </div>
    );
  }

  const totalTime =
    (recipe.prepTimeMinutes ?? 0) + (recipe.cookingTimeMinutes ?? 0);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-8 animate-page-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 -ml-2"
            onClick={() => router.push("/recipe")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
            {L("MealPlannerAPI", "Recipes:BackToList")}
          </Button>{" "}
        </div>

        {currentUser &&
          recipe.author &&
          currentUser.id === recipe.author.id && (
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 backdrop-blur-md">
                {L("MealPlannerAPI", "YourRecipe") || "Your Recipe"}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/recipe/${id}/edit`)}
                className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400"
              >
                <Pencil className="w-4 h-4" />
                {L("AbpUi", "Edit") || "Edit"}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                className="flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                {L("AbpUi", "Delete") || "Delete"}
              </Button>
            </div>
          )}
      </div>

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
              <h1 className="text-2xl sm:text-3xl font-bold drop-shadow-lg">
                {recipe.name}
              </h1>
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
                  <span className="text-sm font-medium">
                    {recipe.author.name}
                  </span>
                </Link>
              )}
            </div>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span className="font-medium text-zinc-900 dark:text-white">
                {recipe.rating?.toFixed(1) ?? "—"}
              </span>
              <span>
                {L("MealPlannerAPI", "Recipes:ReviewsCount").replace(
                  "{0}",
                  (recipe.reviewCount ?? 0).toString(),
                )}
              </span>
            </div>
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
              <Clock className="w-5 h-5" />
              <span>
                {L("MealPlannerAPI", "Recipes:MinTotal").replace(
                  "{0}",
                  totalTime.toString(),
                )}
              </span>
              {recipe.prepTimeMinutes > 0 && (
                <span className="text-zinc-400 dark:text-zinc-500">
                  {L("MealPlannerAPI", "Recipes:PrepAndCookTime")
                    .replace("{0}", (recipe.prepTimeMinutes ?? 0).toString())
                    .replace(
                      "{1}",
                      (recipe.cookingTimeMinutes ?? 0).toString(),
                    )}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
              <Users className="w-5 h-5" />
              <span>
                {L("MealPlannerAPI", "Recipes:ServingsCount").replace(
                  "{0}",
                  (recipe.servings ?? 0).toString(),
                )}
              </span>
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
            <section className="p-5 rounded-2xl bg-primary-secondary-45 border border-primary/10 shadow-brand-glow-sm">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-4">
                <Flame className="w-5 h-5 text-amber-500" aria-hidden="true" />
                {L("MealPlannerAPI", "Recipes:NutritionPerServing")}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  {
                    label: L("MealPlannerAPI", "Recipes:Calories"),
                    value: Math.round(recipe.nutritionPerServing.calories),
                    unit: "",
                    color: "text-amber-600 dark:text-amber-400",
                  },
                  {
                    label: L("MealPlannerAPI", "Recipes:Protein"),
                    value: recipe.nutritionPerServing.proteinGrams.toFixed(0),
                    unit: "g",
                    color: "text-blue-600 dark:text-blue-400",
                  },
                  {
                    label: L("MealPlannerAPI", "Recipes:Carbs"),
                    value: recipe.nutritionPerServing.carbsGrams.toFixed(0),
                    unit: "g",
                    color: "text-emerald-600 dark:text-emerald-400",
                  },
                  {
                    label: L("MealPlannerAPI", "Recipes:Fat"),
                    value: recipe.nutritionPerServing.fatGrams.toFixed(0),
                    unit: "g",
                    color: "text-rose-600 dark:text-rose-400",
                  },
                  {
                    label: L("MealPlannerAPI", "Recipes:Fiber"),
                    value: recipe.nutritionPerServing.fiberGrams.toFixed(0),
                    unit: "g",
                    color: "text-violet-600 dark:text-violet-400",
                  },
                ].map((n) => (
                  <div
                    key={n.label}
                    className="text-center p-3 rounded-xl bg-card border border-border"
                  >
                    <p className={`text-xl font-bold ${n.color}`}>
                      {n.value}
                      {n.unit}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {n.label}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right column: Ingredients and Instructions */}
        <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          {/* Ingredients */}
          <section className="p-5 rounded-2xl bg-primary-secondary-135 border border-secondary/10 shadow-brand-glow-sm">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-4">
              <ListChecks
                className="w-5 h-5 text-secondary"
                aria-hidden="true"
              />
              {L("MealPlannerAPI", "Recipes:Ingredients")}
            </h2>
            <ul className="space-y-2">
              {recipe.ingredients?.map((ing) => (
                <li
                  key={ing.id}
                  className="flex items-start gap-2.5 text-foreground"
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-sm">
                    {ing.displayQuantity
                      ? `${ing.displayQuantity} ${ing.name}`
                      : ing.quantityGrams > 0
                        ? `${ing.quantityGrams}g ${ing.name}`
                        : ing.name}
                  </span>
                </li>
              ))}
              {(!recipe.ingredients || recipe.ingredients.length === 0) && (
                <li className="text-muted-foreground text-sm">
                  {L("MealPlannerAPI", "Recipes:NoIngredients")}
                </li>
              )}
            </ul>
          </section>

          {/* Instructions */}
          <section className="p-5 rounded-2xl bg-primary-secondary-225 border border-primary/10 shadow-brand-glow-sm">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-4">
              <UtensilsCrossed
                className="w-5 h-5 text-primary"
                aria-hidden="true"
              />
              {L("MealPlannerAPI", "Recipes:Instructions")}
            </h2>
            <ol className="space-y-3">
              {recipe.instructions?.map((step, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="shrink-0 w-7 h-7 rounded-full bg-brand-gradient text-white font-bold flex items-center justify-center text-xs shadow-brand-glow-sm">
                    {idx + 1}
                  </span>
                  <span className="text-sm text-foreground/80 pt-1 leading-relaxed">
                    {step}
                  </span>
                </li>
              ))}
              {(!recipe.instructions || recipe.instructions.length === 0) && (
                <li className="text-muted-foreground text-sm">
                  {L("MealPlannerAPI", "Recipes:NoInstructions")}
                </li>
              )}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
