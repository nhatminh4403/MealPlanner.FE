"use client";

import React, { useEffect, useState } from "react";
import { userProfiles, recipes as recipeApi } from "@/libs/api";
import { UserProfile, RecipeSummary } from "@/libs/interfaceDTO";
import { useLocalization } from "@/libs/LocalizationProvider";
import {
  Settings,
  Mail,
  ChefHat,
  Loader2,
  Calendar,
  Grid,
  Heart,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import RecipeCard from "@/components/recipes/base/RecipeCard";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
  const { L } = useLocalization();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [myRecipes, setMyRecipes] = useState<RecipeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"recipes" | "likes">("recipes");

  useEffect(() => {
    async function fetchProfileData() {
      try {
        setLoading(true);
        const profileRes = await userProfiles.getMe();
        setProfile(profileRes.data);

        const recipesRes = await recipeApi.getByAuthor(profileRes.data.id);
        setMyRecipes(recipesRes.data.items || []);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
        toast.error(L("MealPlannerAPI", "FailedToLoadProfile"));
      } finally {
        setLoading(false);
      }
    }
    fetchProfileData();
  }, [L]);

  if (loading && !profile) {
    return (
      <div className="w-full max-w-6xl mx-auto px-6 pt-32 pb-12 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mb-4" />
        <p className="text-zinc-500">{L("MealPlannerAPI", "LoadingProfile")}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-6 pt-24 pb-20 animate-page-in">
      {/* Profile Header / Banner */}
      <div className="relative mb-24">
        {/* Cover Image */}
        <div className="h-64 sm:h-80 w-full rounded-3xl bg-primary-secondary-hero border border-primary/10 relative shadow-brand-glow overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <ChefHat size={200} aria-hidden="true" />
          </div>
          {/* Decorative gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full bg-primary-secondary-90 blur-3xl opacity-40 pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-primary-secondary-270 blur-3xl opacity-40 pointer-events-none" />
        </div>

        {/* Profile Info Overlay */}
        <div className="absolute -bottom-16 left-8 right-8 flex flex-col md:flex-row items-end md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="w-32 h-32 sm:w-40 sm:h-40 border-8 border-background shadow-2xl">
                <AvatarImage src={profile?.avatarUrl} />
                <AvatarFallback className="text-3xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400">
                  {profile?.name?.charAt(0) ||
                    profile?.userName?.charAt(0) ||
                    "?"}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-2 right-2 p-2.5 bg-emerald-500 text-white rounded-xl shadow-lg hover:bg-emerald-600 transition-colors border-2 border-background">
                <Pencil size={18} />
              </button>
            </div>

            <div className="mb-2">
              <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
                {profile?.name || profile?.userName}
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 font-medium flex items-center gap-2 mt-1">
                <Mail size={16} />
                {profile?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-2">
            <Button
              variant="outline"
              className="rounded-2xl h-12 px-6 border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
              onClick={() => router.push(`/profile/${profile?.id}/settings`)}
            >
              <Settings className="w-4 h-4 mr-2" />
              {L("MealPlannerAPI", "ProfileSettings")}
            </Button>
            <Button className="rounded-2xl h-12 px-8 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 shadow-xl transition-all active:scale-95">
              {L("MealPlannerAPI", "EditProfile")}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-12">
        {/* Sidebar: Stats & Info */}
        <div className="lg:col-span-1 space-y-8">
          <Card className="border-none bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-xl overflow-hidden rounded-3xl">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
                <div className="text-center">
                  <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                    {profile?.followersCount || 0}
                  </p>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">
                    {L("MealPlannerAPI", "Followers")}
                  </p>
                </div>
                <div className="w-px h-8 bg-zinc-100 dark:bg-zinc-800" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                    {profile?.followingCount || 0}
                  </p>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">
                    {L("MealPlannerAPI", "Following")}
                  </p>
                </div>
                <div className="w-px h-8 bg-zinc-100 dark:bg-zinc-800" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                    {myRecipes.length}
                  </p>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">
                    {L("MealPlannerAPI", "Recipes")}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
                  <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800">
                    <Calendar size={18} />
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-zinc-900 dark:text-white">
                      {L("MealPlannerAPI", "MemberSince")}
                    </p>
                    <p>April 2024</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
                  <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800">
                    <ChefHat size={18} />
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-zinc-900 dark:text-white">
                      {L("MealPlannerAPI", "CookingLevel")}
                    </p>
                    <p>Intermediate Chef</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="p-6 rounded-3xl bg-primary-secondary-45 border border-primary/10 shadow-brand-glow-sm text-foreground">
            <h3 className="font-bold text-lg mb-2">
              {L("MealPlannerAPI", "CulinaryJourney")}
            </h3>
            <p className="text-foreground/70 text-sm leading-relaxed mb-4">
              {L("MealPlannerAPI", "CulinaryJourneyDesc")}
            </p>
            <Button
              variant="outline"
              className="w-full bg-card hover:bg-muted transition-colors rounded-xl font-bold border-border"
            >
              {L("MealPlannerAPI", "ViewMilestones")}
            </Button>
          </div>
        </div>

        {/* Main Section: Tabs & Content */}
        <div className="lg:col-span-3 space-y-8">
          <div className="flex items-center gap-2 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-2xl w-fit">
            <button
              onClick={() => setActiveTab("recipes")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === "recipes"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm"
                  : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              }`}
            >
              <Grid size={18} />
              {L("MealPlannerAPI", "MyRecipes")}
            </button>
            <button
              onClick={() => setActiveTab("likes")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === "likes"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm"
                  : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              }`}
            >
              <Heart size={18} />
              {L("MealPlannerAPI", "LikedRecipes")}
            </button>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-4/3 w-full rounded-2xl" />
                  <Skeleton className="h-6 w-3/4 rounded-lg" />
                  <Skeleton className="h-4 w-1/2 rounded-lg" />
                </div>
              ))
            ) : activeTab === "recipes" ? (
              myRecipes.length > 0 ? (
                myRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))
              ) : (
                <div className="col-span-full py-20 text-center bg-zinc-50/50 dark:bg-zinc-900/50 rounded-[2.5rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                  <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-zinc-400">
                    <ChefHat size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                    {L("MealPlannerAPI", "NoRecipesYet")}
                  </h3>
                  <p className="text-zinc-500 mb-6">
                    {L("MealPlannerAPI", "NoRecipesYetDesc")}
                  </p>
                  <Button
                    onClick={() => router.push("/recipe/add")}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-8 font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                  >
                    {L("MealPlannerAPI", "CreateYourFirstRecipe")}
                  </Button>
                </div>
              )
            ) : (
              <div className="col-span-full py-20 text-center bg-zinc-50/50 dark:bg-zinc-900/50 rounded-[2.5rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-zinc-400">
                  <Heart size={32} />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                  {L("MealPlannerAPI", "NoLikedRecipes")}
                </h3>
                <p className="text-zinc-500 mb-6">
                  {L("MealPlannerAPI", "NoLikedRecipesDesc")}
                </p>
                <Button
                  variant="outline"
                  onClick={() => router.push("/recipe")}
                  className="rounded-xl px-8 font-bold transition-all border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 active:scale-95"
                >
                  {L("MealPlannerAPI", "ExploreRecipes")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
