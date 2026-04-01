"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChefHat, Trophy, Flame, Globe } from "lucide-react";
import { recipes, mealPlans, userProfiles, dashboard } from "@/libs/api";
import { RecipeSummary, TrendingRecipe } from "@/libs/interfaceDTO";
import { toast } from "sonner";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { MealType, DayOfWeek } from "@/libs/enums";
import RecipeSelectionGrid from "@/components/recipes/selection/RecipeSelectionGrid";
import RecipeSelectionSkeleton from "@/components/recipes/selection/RecipeSelectionSkeleton";
import EmptyRecipesState from "@/components/recipes/base/EmptyRecipesState";
import AddMealPlanHeader from "@/components/meal-plans/selection/AddMealPlanHeader";
import RecipeSelectionToolbar from "@/components/recipes/selection/RecipeSelectionToolbar";

const MEAL_TYPES = [
  { label: "Breakfast", value: MealType.Breakfast },
  { label: "Lunch", value: MealType.Lunch },
  { label: "Dinner", value: MealType.Dinner },
  { label: "Snack", value: MealType.Snack },
];
const DAYS = [
  { label: "Sunday", value: DayOfWeek.Sunday },
  { label: "Monday", value: DayOfWeek.Monday },
  { label: "Tuesday", value: DayOfWeek.Tuesday },
  { label: "Wednesday", value: DayOfWeek.Wednesday },
  { label: "Thursday", value: DayOfWeek.Thursday },
  { label: "Friday", value: DayOfWeek.Friday },
  { label: "Saturday", value: DayOfWeek.Saturday },
];

const MEAL_COLORS: Record<
  number,
  { accent: string; pill: string; glow: string }
> = {
  0: {
    accent: "text-amber-400",
    pill: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    glow: "shadow-amber-500/20",
  },
  1: {
    accent: "text-teal-400",
    pill: "bg-teal-500/15 text-teal-400 border-teal-500/20",
    glow: "shadow-teal-500/20",
  },
  2: {
    accent: "text-violet-400",
    pill: "bg-violet-500/15 text-violet-400 border-violet-500/20",
    glow: "shadow-violet-500/20",
  },
  3: {
    accent: "text-rose-400",
    pill: "bg-rose-500/15 text-rose-400 border-rose-500/20",
    glow: "shadow-rose-500/20",
  },
};

const SELECTION_TABS = [
  { value: "top-rated", icon: Trophy, label: "Top Rated" },
  { value: "trending", icon: Flame, label: "Trending" },
  { value: "all", icon: Globe, label: "Browse All" },
  { value: "my-recipes", icon: ChefHat, label: "My Recipes" },
];

export default function AddMealPlanEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();

  const typeParam = searchParams.get("type");
  const dayParam = searchParams.get("day");

  const day = dayParam ? parseInt(dayParam) : 0;
  const type = typeParam ? parseInt(typeParam) : 0;
  const mealTypeMap = Object.fromEntries(
    MEAL_TYPES.map((item) => [item.value, item.label]),
  );

  const dayMap = Object.fromEntries(
    DAYS.map((item) => [item.value, item.label]),
  );

  const mealName = `${dayMap[day]} - ${mealTypeMap[type]}`;
  const colors = MEAL_COLORS[type] ?? MEAL_COLORS[0];

  const [myRecipes, setMyRecipes] = useState<RecipeSummary[]>([]);
  const [trendingRecipes, setTrendingRecipes] = useState<TrendingRecipe[]>([]);
  const [topRatedRecipes, setTopRatedRecipes] = useState<RecipeSummary[]>([]);
  const [allRecipes, setAllRecipes] = useState<RecipeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [meRes, trendingRes, topRatedRes, allRes] = await Promise.all([
          userProfiles.getMe(),
          dashboard.getTrending(),
          recipes.getTopRated(10),
          recipes.getList({ maxResultCount: 20 }),
        ]);
        const recipesRes = await recipes.getByAuthor(meRes.data.id);
        setMyRecipes(recipesRes.data.items || []);
        setTrendingRecipes(trendingRes.data.items || []);
        setTopRatedRecipes(topRatedRes.data.items || []);
        setAllRecipes(allRes.data.items || []);
      } catch {
        toast.error("Could not load recipes.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleAddRecipe = async (recipe: RecipeSummary | TrendingRecipe) => {
    try {
      setAdding(recipe.id);

      await mealPlans.addEntry(id, {
        recipeId: recipe.id,
        mealType: type,
        dayOfWeek: day,
        mealName: mealName,
      });
      toast.success(
        `Added ${recipe.name} to ${DAYS[day]?.label}'s ${MEAL_TYPES[type]?.label}.`,
      );
      router.push("/meal-plans");
    } catch {
      toast.error("Failed to add recipe to meal plan.");
    } finally {
      setAdding(null);
    }
  };

  return (
    <Tabs defaultValue="top-rated" className="w-full flex flex-col">
      <div className="flex-1 w-full min-h-screen pt-24 pb-16 px-6 lg:px-12 2xl:px-20 flex flex-col animate-page-in">
        <div className="w-full max-w-450 mx-auto">
          {/* ── Header ── */}
          <div className="flex flex-col gap-8">
            <AddMealPlanHeader
              dayName={DAYS[day]?.label || ""}
              mealTypeLabel={MEAL_TYPES[type]?.label || ""}
              colors={colors}
            />

            <RecipeSelectionToolbar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              tabs={SELECTION_TABS}
            />
          </div>

          {/* ── Tab Content ── */}
          <div className="mt-8 min-h-125">
            {loading ? (
              <RecipeSelectionSkeleton />
            ) : (
              <>
                <TabsContent value="my-recipes">
                  <RecipeSelectionGrid
                    recipes={myRecipes}
                    listType="my"
                    searchTerm={searchTerm}
                    addingId={adding}
                    onAdd={handleAddRecipe}
                    emptyState={<EmptyRecipesState />}
                  />
                </TabsContent>

                <TabsContent value="top-rated">
                  <RecipeSelectionGrid
                    recipes={topRatedRecipes}
                    listType="top"
                    searchTerm={searchTerm}
                    addingId={adding}
                    onAdd={handleAddRecipe}
                  />
                </TabsContent>

                <TabsContent value="trending">
                  <RecipeSelectionGrid
                    recipes={trendingRecipes}
                    listType="trending"
                    searchTerm={searchTerm}
                    addingId={adding}
                    onAdd={handleAddRecipe}
                  />
                </TabsContent>

                <TabsContent value="all">
                  <RecipeSelectionGrid
                    recipes={allRecipes}
                    listType="all"
                    searchTerm={searchTerm}
                    addingId={adding}
                    onAdd={handleAddRecipe}
                  />
                </TabsContent>
              </>
            )}
          </div>
        </div>
      </div>
    </Tabs>
  );
}
