import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { recipes as recipeApi } from "@/libs/api";
import {
  Star,
  Clock,
  ChefHat,
  Users,
  ArrowLeft,
  UtensilsCrossed,
  ListChecks,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import RecipeOwnerActions from "@/components/recipes/base/RecipeOwnerActions";

const DIFFICULTY_LABELS: Record<number, string> = {
  0: "Easy",
  1: "Medium",
  2: "Hard",
};

const PLACEHOLDER_IMAGE =
  "https://placehold.co/1200x600/e2e8f0/64748b?text=Recipe";

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let recipe;
  try {
    const res = await recipeApi.get(id);
    recipe = res.data;
  } catch {
    notFound();
  }

  const totalTime =
    (recipe.prepTimeMinutes ?? 0) + (recipe.cookingTimeMinutes ?? 0);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-8 animate-page-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <Button variant="ghost" size="sm" className="mb-4 -ml-2" asChild>
          <Link href="/recipe">
            <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
            Back to Recipes
          </Link>
        </Button>

        {/* Client component — only renders if the current user owns this recipe */}
        {recipe.author && (
          <RecipeOwnerActions
            recipeId={id}
            authorId={recipe.author.id}
          />
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
              <span>({recipe.reviewCount ?? 0} reviews)</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
              <Clock className="w-5 h-5" />
              <span>{totalTime} min total</span>
              {recipe.prepTimeMinutes > 0 && (
                <span className="text-zinc-400 dark:text-zinc-500">
                  ({recipe.prepTimeMinutes} prep + {recipe.cookingTimeMinutes}{" "}
                  cook)
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
              <Users className="w-5 h-5" />
              <span>{recipe.servings ?? 0} servings</span>
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
                Nutrition per serving
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  {
                    label: "Calories",
                    value: Math.round(recipe.nutritionPerServing.calories),
                    unit: "",
                    color: "text-amber-600 dark:text-amber-400",
                  },
                  {
                    label: "Protein",
                    value: recipe.nutritionPerServing.proteinGrams.toFixed(0),
                    unit: "g",
                    color: "text-blue-600 dark:text-blue-400",
                  },
                  {
                    label: "Carbs",
                    value: recipe.nutritionPerServing.carbsGrams.toFixed(0),
                    unit: "g",
                    color: "text-emerald-600 dark:text-emerald-400",
                  },
                  {
                    label: "Fat",
                    value: recipe.nutritionPerServing.fatGrams.toFixed(0),
                    unit: "g",
                    color: "text-rose-600 dark:text-rose-400",
                  },
                  {
                    label: "Fiber",
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
              Ingredients
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
                  No ingredients listed.
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
              Instructions
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
                  No instructions provided.
                </li>
              )}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
