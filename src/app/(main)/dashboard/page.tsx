"use client";

import React, { useEffect, useState } from "react";
import { dashboard } from "@/libs/api";
import { DashboardStats, TrendingRecipe } from "@/libs/interfaceDTO";
import { useLocalization } from "@/libs/LocalizationProvider";
import {
  ChefHat,
  Users,
  Star,
  TrendingUp,
  Plus,
  Calendar,
  ShoppingCart,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const StatsCard = ({
  title,
  value,
  icon: Icon,
  color,
  loading,
}: {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  loading?: boolean;
}) => (
  <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:shadow-brand-glow-sm transition-all duration-300 group p-6">
    <div
      className={`absolute top-0 right-0 p-3 opacity-[0.06] group-hover:opacity-[0.1] transition-opacity pointer-events-none ${color}`}
    >
      <Icon size={80} aria-hidden="true" />
    </div>
    <div className="relative z-10">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        {title}
      </p>
      {loading ? (
        <Skeleton className="h-9 w-20" />
      ) : (
        <div className="text-3xl font-extrabold tracking-tight text-foreground tabular-nums">
          {value}
        </div>
      )}
    </div>
  </div>
);

const QuickAction = ({
  title,
  description,
  icon: Icon,
  href,
  color,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color: string;
}) => (
  <Link href={href}>
    <div className="h-full rounded-2xl border border-border bg-card hover:bg-primary-secondary-65 transition-all group overflow-hidden gradient-border shadow-sm hover:shadow-brand-glow-sm">
      <div className="p-5 flex items-start gap-4">
        <div
          className={`p-3 rounded-xl ${color} text-white shadow-sm group-hover:scale-110 transition-transform shrink-0`}
        >
          <Icon size={22} aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors text-sm">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {description}
          </p>
        </div>
        <ArrowRight
          size={16}
          className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 mt-0.5"
          aria-hidden="true"
        />
      </div>
    </div>
  </Link>
);

export default function DashboardPage() {
  const { L } = useLocalization();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [trending, setTrending] = useState<TrendingRecipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        const [statsRes, trendingRes] = await Promise.all([
          dashboard.getStats(),
          dashboard.getTrending(),
        ]);
        setStats(statsRes.data);
        setTrending(trendingRes.data.items);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        toast.error(L("MealPlannerAPI", "Common:UnexpectedErrorOccurred"));
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, [L]);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 pt-24 pb-20 animate-page-in">
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight flex items-center gap-4">
          <span className="text-gradient-brand">
            {L("MealPlannerAPI", "Dashboard:Title")}
          </span>
          <div className="h-1 w-12 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
        </h1>
        <p className="mt-3 text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
          {L("MealPlannerAPI", "Common:AppIntroduction")}
        </p>
      </header>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        <StatsCard
          title={L("MealPlannerAPI", "Recipes:TotalCount")}
          value={stats?.totalRecipes ?? 0}
          icon={ChefHat}
          color="text-emerald-500"
          loading={loading}
        />
        <StatsCard
          title={L("MealPlannerAPI", "Dashboard:Overview")}
          value={stats?.totalFollowers ?? 0}
          icon={Users}
          color="text-blue-500"
          loading={loading}
        />
        <StatsCard
          title={L("MealPlannerAPI", "Following")}
          value={stats?.totalFollowing ?? 0}
          icon={Users}
          color="text-indigo-500"
          loading={loading}
        />
        <StatsCard
          title={L("MealPlannerAPI", "Recipes:Rating")}
          value={stats?.averageRating ? stats.averageRating.toFixed(1) : "—"}
          icon={Star}
          color="text-amber-500"
          loading={loading}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Main Section: Trending Recipes */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
              <TrendingUp className="text-primary" />
              {L("MealPlannerAPI", "Recipes:Trending")}
            </h2>
            <Link
              href="/recipe"
              className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1 group"
            >
              {L("MealPlannerAPI", "Recipes:Browse")}
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {loading
              ? [...Array(4)].map((_, i) => (
                  <Card
                    key={i}
                    className="overflow-hidden border-none bg-zinc-100 dark:bg-zinc-800 animate-pulse h-80"
                  />
                ))
              : trending.slice(0, 4).map((recipe) => (
                  <Link key={recipe.id} href={`/recipe/${recipe.id}`}>
                    <Card className="overflow-hidden border-none group bg-zinc-50 dark:bg-zinc-900 h-full hover:shadow-2xl transition-all duration-500">
                      <div className="relative aspect-4/3 overflow-hidden">
                        <Image
                          src={
                            recipe.imageUrl ||
                            "https://placehold.co/600x400/e2e8f0/64748b?text=Recipe"
                          }
                          alt={recipe.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                          <div className="flex items-center gap-2 text-white">
                            <Star
                              size={16}
                              className="fill-amber-400 text-amber-400"
                            />
                            <span className="font-bold">
                              {recipe.rating.toFixed(1)}
                            </span>
                            <span className="text-white/70 text-sm">
                              ({recipe.reviewCount})
                            </span>
                          </div>
                        </div>
                      </div>
                      <CardHeader className="p-5">
                        <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-1">
                          {recipe.name}
                        </CardTitle>
                        <p className="text-xs text-zinc-400 uppercase tracking-widest font-semibold mt-1">
                          {L("MealPlannerAPI", "Recipes:TrendingLabel")}{" "}
                          {new Date(recipe.trendingSince).toLocaleDateString()}
                        </p>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
            {!loading && trending.length === 0 && (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2.5rem]">
                <p className="text-zinc-500">
                  {L("MealPlannerAPI", "Recipes:NoTrendingRecipes")}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Quick Actions & Tips */}
        <div className="space-y-8">
          <div>
            <h2 className="font-bold text-zinc-900 dark:text-white mb-6 uppercase tracking-widest text-sm">
              {L("MealPlannerAPI", "QuickActions")}
            </h2>
            <div className="space-y-4">
              <QuickAction
                title={L("MealPlannerAPI", "Recipes:Add")}
                description={L("MealPlannerAPI", "Recipes:BasicInfoDesc")}
                icon={Plus}
                href="/recipe/add"
                color="bg-emerald-500"
              />
              <QuickAction
                title={L("MealPlannerAPI", "MealPlan:Title")}
                description={L("MealPlannerAPI", "MealPlan:Description")}
                icon={Calendar}
                href="/meal-plans"
                color="bg-blue-500"
              />
              <QuickAction
                title={L("MealPlannerAPI", "ShoppingList:Title")}
                description={L("MealPlannerAPI", "ShoppingList:Description")}
                icon={ShoppingCart}
                href="/shopping-lists"
                color="bg-amber-500"
              />
            </div>
          </div>

          <Card className="border-none bg-primary-secondary-155 overflow-hidden relative gradient-border shadow-brand-glow-sm">
            <div className="absolute -right-8 -bottom-8 text-primary/5 -rotate-12 pointer-events-none">
              <Star size={180} aria-hidden="true" />
            </div>
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Star className="text-amber-500 fill-amber-500" size={20} />
                {L("MealPlannerAPI", "ProTip")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed relative z-10">
                {L("MealPlannerAPI", "Common:AppIntroduction")}
              </p>
              <Button
                variant="link"
                className="p-0 h-auto mt-4 text-primary hover:text-primary/80 font-bold group"
              >
                {L("MealPlannerAPI", "LearnMore")}
                <ArrowRight
                  size={14}
                  className="ml-1 group-hover:translate-x-1 transition-transform"
                />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
