"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { userProfiles, recipes as recipeApi } from "@/libs/api";
import { UserProfile, RecipeSummary } from "@/libs/interfaceDTO";
import { useLocalization } from "@/libs/localization";
import {
  Mail,
  ChefHat,
  Loader2,
  Calendar,
  UserPlus,
  UserMinus,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import RecipeCard from "@/components/recipes/base/RecipeCard";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { isAuthenticated } from "@/libs/axios";

export default function UserProfilePage() {
  const { L } = useLocalization();
  const router = useRouter();
  const params = useParams();
  const userId = params?.userId as string;
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [myRecipes, setMyRecipes] = useState<RecipeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isMe, setIsMe] = useState(false);

  useEffect(() => {
    if (!userId) return;
    async function fetchProfileData() {
      try {
        setLoading(true);
        const [profileRes, recipesRes] = await Promise.all([
          userProfiles.getUser(userId),
          recipeApi.getByAuthor(userId)
        ]);
        
        setProfile(profileRes.data);
        setMyRecipes(recipesRes.data.items || []);
        
        if (isAuthenticated()) {
           const me = await userProfiles.getMe();
           setIsMe(me.data.id === userId);
           // NOTE: In a real app, 'isFollowing' would come from the profile or a separate check.
           // For now, let's just default to false or check a follow status if available.
        }
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
        toast.error(L("MealPlannerAPI", "FailedToLoadProfile"));
      } finally {
        setLoading(false);
      }
    }
    fetchProfileData();
  }, [userId, L]);

  const handleFollow = async () => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    try {
      if (isFollowing) {
        await userProfiles.unfollow(userId);
        setIsFollowing(false);
        setProfile(p => p ? { ...p, followersCount: p.followersCount - 1 } : null);
        toast.success(L("MealPlannerAPI", "Unfollowed"));
      } else {
        await userProfiles.follow(userId);
        setIsFollowing(true);
        setProfile(p => p ? { ...p, followersCount: p.followersCount + 1 } : null);
        toast.success(L("MealPlannerAPI", "Followed"));
      }
    } catch {
      toast.error(L("MealPlannerAPI", "FollowActionFailed"));
    }
  };

  if (loading && !profile) {
    return (
      <div className="w-full max-w-6xl mx-auto px-6 pt-32 pb-12 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mb-4" />
        <p className="text-zinc-500">{L("MealPlannerAPI", "LoadingProfile")}</p>
      </div>
    );
  }

  if (!profile) {
     return (
        <div className="w-full max-w-6xl mx-auto px-6 pt-32 pb-12 text-center">
           <h2 className="text-2xl font-bold mb-4">{L("MealPlannerAPI", "ProfileNotFound")}</h2>
           <Button onClick={() => router.back()} variant="outline" className="rounded-xl">
              <ArrowLeft size={18} className="mr-2" /> {L("MealPlannerAPI", "GoBack")}
           </Button>
        </div>
     );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-6 pt-24 pb-20 animate-page-in">
      {/* Profile Header / Banner */}
      <div className="relative mb-24">
        <div className="h-64 sm:h-80 w-full rounded-[2.5rem] bg-linear-to-br from-indigo-400/20 to-purple-500/20 dark:from-indigo-500/10 dark:to-purple-600/10 border border-zinc-200 dark:border-zinc-800 relative shadow-inner overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
              <ChefHat size={200} />
           </div>
        </div>
        
        <div className="absolute -bottom-16 left-8 right-8 flex flex-col md:flex-row items-end md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <Avatar className="w-32 h-32 sm:w-40 sm:h-40 border-8 border-background shadow-2xl">
              <AvatarImage src={profile?.avatarUrl} />
              <AvatarFallback className="text-3xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400">
                {profile?.name?.charAt(0) || profile?.userName?.charAt(0) || "?"}
              </AvatarFallback>
            </Avatar>
            
            <div className="mb-2">
              <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
                {profile?.name || profile?.userName}
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 font-medium flex items-center gap-2 mt-1">
                <ChefHat size={16} />
                {L("MealPlannerAPI", "CulinaryExpert")}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 mb-2">
            {!isMe && (
              <Button 
                onClick={handleFollow}
                className={`rounded-2xl h-12 px-8 font-bold transition-all active:scale-95 shadow-xl ${
                   isFollowing 
                   ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700" 
                   : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20"
                }`}
              >
                {isFollowing ? (
                  <><UserMinus size={18} className="mr-2" /> {L("MealPlannerAPI", "Unfollow")}</>
                ) : (
                  <><UserPlus size={18} className="mr-2" /> {L("MealPlannerAPI", "Follow")}</>
                )}
              </Button>
            )}
            <Button 
              variant="outline" 
              className="rounded-2xl h-12 px-6 border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md"
              onClick={() => {
                if (profile.email) {
                   window.location.href = `mailto:${profile.email}`;
                }
              }}
            >
              <Mail className="w-4 h-4 mr-2" />
              {L("MealPlannerAPI", "Contact")}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-12">
        {/* Sidebar: Stats */}
        <div className="lg:col-span-1 space-y-8">
          <Card className="border-none bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-xl overflow-hidden rounded-3xl">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
                 <div className="text-center">
                    <p className="text-2xl font-bold text-zinc-900 dark:text-white">{profile?.followersCount || 0}</p>
                    <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">{L("MealPlannerAPI", "Followers")}</p>
                 </div>
                 <div className="w-px h-8 bg-zinc-100 dark:bg-zinc-800" />
                 <div className="text-center">
                    <p className="text-2xl font-bold text-zinc-900 dark:text-white">{profile?.followingCount || 0}</p>
                    <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">{L("MealPlannerAPI", "Following")}</p>
                 </div>
                 <div className="w-px h-8 bg-zinc-100 dark:bg-zinc-800" />
                 <div className="text-center">
                    <p className="text-2xl font-bold text-zinc-900 dark:text-white">{myRecipes.length}</p>
                    <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">{L("MealPlannerAPI", "Recipes")}</p>
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
                    <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800">
                       <Calendar size={18} />
                    </div>
                    <div className="text-sm">
                       <p className="font-semibold text-zinc-900 dark:text-white">{L("MealPlannerAPI", "Joined")}</p>
                       <p>August 2024</p>
                    </div>
                 </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content: Recipes */}
        <div className="lg:col-span-3 space-y-8">
          <div className="flex items-center gap-3 mb-6">
             <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                <ChefHat size={20} />
             </div>
             <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                {L("MealPlannerAPI", "SharedRecipes")}
             </h2>
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
            ) : myRecipes.length > 0 ? (
              myRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-zinc-50/50 dark:bg-zinc-900/50 rounded-[2.5rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                 <p className="text-zinc-500">{L("MealPlannerAPI", "NoSharedRecipesYet")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
