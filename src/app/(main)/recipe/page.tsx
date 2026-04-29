"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { recipes as recipeApi } from "@/libs/api";
import { userProfiles } from "@/libs/api";
import { getAccessToken } from "@/libs/axios";
import RecipeCard from "../../../components/recipes/base/RecipeCard";
import type { RecipeSummary } from "@/libs/interfaceDTO";
import { User, Search, LayoutGrid } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { useLocalization } from "@/libs/LocalizationProvider";

const PAGE_SIZE = 10;

export default function RecipePage() {
  const router = useRouter();
  const { L } = useLocalization();
  const [userRecipes, setUserRecipes] = useState<RecipeSummary[]>([]);
  const [allRecipes, setAllRecipes] = useState<RecipeSummary[]>([]);
  const [allRecipesTotal, setAllRecipesTotal] = useState(0);
  const [allRecipesPage, setAllRecipesPage] = useState(1);
  const [loading, setLoading] = useState({
    userRecipes: true,
    allRecipes: true,
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!getAccessToken());
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading((p) => ({ ...p, userRecipes: false }));
      return;
    }
    async function fetchUserRecipes() {
      try {
        const me = await userProfiles.getMe();
        const res = await recipeApi.getByAuthor(me.data.id);
        setUserRecipes(res.data.items ?? []);
      } catch {
        setUserRecipes([]);
      } finally {
        setLoading((p) => ({ ...p, userRecipes: false }));
      }
    }
    fetchUserRecipes();
  }, [isLoggedIn]);

  useEffect(() => {
    async function fetchAllRecipes() {
      setLoading((p) => ({ ...p, allRecipes: true }));
      try {
        const res = await recipeApi.getList({
          maxResultCount: PAGE_SIZE,
          skipCount: (allRecipesPage - 1) * PAGE_SIZE,
          searchTerm: searchTerm || undefined,
          sorting: searchTerm ? undefined : "rating desc",
        });
        setAllRecipes(res.data.items ?? []);
        setAllRecipesTotal(res.data.totalCount ?? 0);
      } catch {
        setAllRecipes([]);
        setAllRecipesTotal(0);
      } finally {
        setLoading((p) => ({ ...p, allRecipes: false }));
        // Let the new data paint first, THEN fade back in
        setTimeout(() => setIsPageTransitioning(false), 80);
      }
    }
    fetchAllRecipes();
  }, [allRecipesPage, searchTerm]);

  const handleSearch = (e: React.SubmitEvent) => {
    e.preventDefault();
    setSearchTerm(searchInput);
    setAllRecipesPage(1); // Reset to first page when search changes
  };
  const changePage = (newPage: number) => {
    if (newPage === allRecipesPage) return;
    setIsPageTransitioning(true);
    setTimeout(() => {
      setAllRecipesPage(newPage);
    }, 500); // short delay before fetch triggers
  };

  const totalAllPages = Math.ceil(allRecipesTotal / PAGE_SIZE) || 1;
  const hasPrevPage = allRecipesPage > 1;
  const hasNextPage = allRecipesPage < totalAllPages;

  const getPageNumbers = () => {
    if (totalAllPages <= 7)
      return [...Array(totalAllPages)].map((_, i) => i + 1);
    const pages: (number | "ellipsis")[] = [];
    if (allRecipesPage <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push("ellipsis", totalAllPages);
    } else if (allRecipesPage >= totalAllPages - 3) {
      pages.push(1, "ellipsis");
      for (let i = totalAllPages - 4; i <= totalAllPages; i++) pages.push(i);
    } else {
      pages.push(
        1,
        "ellipsis",
        allRecipesPage - 1,
        allRecipesPage,
        allRecipesPage + 1,
        "ellipsis",
        totalAllPages,
      );
    }
    return pages;
  };

  const SectionSkeleton = ({ count = 4 }: { count?: number }) => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-8 gap-6 animate-pulse p-1">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800"
        >
          <div className="aspect-4/3 bg-zinc-200 dark:bg-zinc-700" />
          <div className="p-4 space-y-2">
            <div className="h-5 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4" />
            <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full max-w-480 mx-auto px-6 lg:px-12 2xl:px-20 pt-24 pb-16 flex flex-col gap-12 animate-page-in">
      {/* Search Header */}
      <div className="shrink-0">
        <div className="relative overflow-hidden rounded-3xl bg-primary-secondary-180 shadow-brand-glow-sm mb-8 p-8 sm:p-10">
          <div className="gradient-border-static absolute inset-0 rounded-3xl pointer-events-none" />
          <LayoutGrid
            className="absolute -right-6 -bottom-6 w-40 h-40 opacity-[0.05] dark:opacity-[0.04] pointer-events-none"
            aria-hidden="true"
          />
          <div className="relative z-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gradient-brand mb-6">
              {L("MealPlannerAPI", "Recipes:Browse")}
            </h1>
            <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  placeholder={L("MealPlannerAPI", "Recipes:SearchPlaceholder")}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10 h-11 border-border/80"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="px-8 transition-all active:scale-95 bg-brand-gradient border-0 text-white hover:opacity-90"
              >
                {L("MealPlannerAPI", "Common:Search")}
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {/* My Creations Section - Contained Scroll */}
        {isLoggedIn && (
          <section className="flex flex-col">
            <div className="flex items-center justify-between  gap-3 mb-4 shrink-0 px-1">
              <div className="flex items-center gap-3 p-1.5 rounded-lg bg-primary/10 text-primary">
                <User className="w-5 h-5" aria-hidden="true" />
                <h2 className="text-xl font-bold text-foreground">
                  {L("MealPlannerAPI", "Recipes:MyCreations")}
                </h2>
              </div>

              <Button
                onClick={() => router.push("/recipe/add")}
                className="flex items-center justify-center gap-2 bg-brand-gradient text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-brand-glow-sm hover:shadow-brand-glow active:scale-[0.98] border-0 hover:opacity-90"
              >
                {L("MealPlannerAPI", "Recipes:Add")}
              </Button>
            </div>
            <div className="pr-2 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/20 p-4">
              {loading.userRecipes ? (
                <SectionSkeleton count={10} />
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-8 gap-6 p-1">
                  {userRecipes.slice(0, 10).map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))}
                  {userRecipes.length === 0 && (
                    <div className="col-span-full py-12 text-center">
                      <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                        {L("MealPlannerAPI", "Recipes:NoUserRecipes")}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {/* All Recipes Section - Contained Scroll */}
        <section className="flex flex-col">
          <div className="flex items-center justify-between mb-4 shrink-0 px-1">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-secondary/10 text-secondary">
                <LayoutGrid className="w-5 h-5" aria-hidden="true" />
              </div>
              <h2 className="text-xl font-bold text-foreground">
                {searchTerm
                  ? L("MealPlannerAPI", "Recipes:ResultsFor").replace(
                      "{0}",
                      searchTerm,
                    )
                  : L("MealPlannerAPI", "Recipes:All")}
              </h2>
            </div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {L("MealPlannerAPI", "Recipes:Found").replace(
                "{0}",
                allRecipesTotal.toString(),
              )}
            </p>
          </div>

          <div className="flex flex-col rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/20">
            <div className="p-4 relative">
              {/* Skeleton overlay during load */}
              <div
                className={`absolute inset-0 z-10 bg-white/40 dark:bg-black/40 backdrop-blur-[1px] transition-opacity duration-300 pointer-events-none rounded-2xl ${
                  isPageTransitioning ? "opacity-100" : "opacity-0"
                }`}
              />

              {/* Actual content fades in */}
              <div
                className={`transition-opacity duration-300 ${
                  isPageTransitioning ? "opacity-30" : "opacity-100"
                }`}
              >
                <div
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-8 gap-6 p-1"
                  key={allRecipesPage}
                >
                  {allRecipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Pagination - Stationary below the scrollable container */}
          {totalAllPages > 1 && (
            <div className="shrink-0 pt-8 flex justify-center">
              <Pagination className="w-auto mx-0">
                <div className="gradient-border-static rounded-full p-1 px-2 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md shadow-lg shadow-primary/5">
                  <PaginationContent className="gap-1">
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (hasPrevPage) changePage(allRecipesPage - 1);
                        }}
                        className={
                          !hasPrevPage
                            ? "pointer-events-none opacity-40"
                            : "cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                        }
                      >
                        {L("MealPlannerAPI", "Previous")}
                      </PaginationPrevious>
                    </PaginationItem>

                    {getPageNumbers().map((page, idx) => (
                      <PaginationItem key={idx}>
                        {page === "ellipsis" ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            href="#"
                            isActive={page === allRecipesPage}
                            onClick={(e) => {
                              e.preventDefault();
                              changePage(page as number);
                            }}
                            className={`rounded-full transition-all duration-300 ${
                              page === allRecipesPage
                                ? "bg-linear-to-br from-primary to-secondary text-white border-none shadow-md shadow-primary/20 scale-105"
                                : "cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            }`}
                          >
                            {page}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (hasNextPage) changePage(allRecipesPage + 1);
                        }}
                        className={
                          !hasNextPage
                            ? "pointer-events-none opacity-40"
                            : "cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                        }
                      >
                        {L("MealPlannerAPI", "Next")}
                      </PaginationNext>
                    </PaginationItem>
                  </PaginationContent>
                </div>
              </Pagination>
            </div>
          )}
        </section>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.2);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
