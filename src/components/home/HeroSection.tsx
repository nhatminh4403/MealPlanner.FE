"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLocalization } from "@/libs/LocalizationProvider";
import { ChefHat, Sparkles, ArrowRight } from "lucide-react";

export interface HeroSectionProps {
  isAuthenticated: boolean;
}

const FOOD_EMOJIS = [
  "🍜",
  "🥗",
  "🍕",
  "🥩",
  "🍣",
  "🥘",
  "🍱",
  "🧆",
  "🥑",
  "🍝",
  "🫕",
  "🥞",
];

export default function HeroSection({ isAuthenticated }: HeroSectionProps) {
  const { L } = useLocalization();

  return (
    <section className="animate-page-in relative overflow-hidden rounded-3xl bg-primary-secondary-hero shadow-brand-glow">
      {/* Gradient border */}
      <div className="gradient-border-static absolute inset-0 rounded-3xl pointer-events-none" />

      {/* Floating food emoji grid — decorative */}
      <div
        className="absolute inset-0 pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        {FOOD_EMOJIS.map((emoji, i) => (
          <span
            key={i}
            className="absolute text-2xl opacity-[0.07] dark:opacity-[0.05]"
            style={{
              top: `${10 + ((i * 37) % 80)}%`,
              left: `${5 + ((i * 53) % 90)}%`,
              transform: `rotate(${(i % 2 === 0 ? 1 : -1) * (8 + (i % 5) * 4)}deg)`,
              fontSize: `${1.4 + (i % 3) * 0.4}rem`,
            }}
          >
            {emoji}
          </span>
        ))}
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row items-center gap-8 sm:gap-12 p-8 sm:p-12 lg:p-16">
        {/* Left column */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-primary/20 bg-primary/8 px-3 py-1.5 text-xs font-semibold text-primary">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            {L("MealPlannerAPI", "Home:Badge")}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1]">
            <span className="text-gradient-brand">
              {L("MealPlannerAPI", "Common:WelcomeToMealPlanner")}
            </span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg">
            {L("MealPlannerAPI", "Common:AppIntroduction")}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <Button
              asChild
              size="lg"
              className="group gap-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Link href="/recipe">
                <ChefHat className="w-4 h-4" aria-hidden="true" />
                {L("MealPlannerAPI", "Recipes:Browse")}
                <ArrowRight
                  className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </Button>

            {isAuthenticated ? (
              <Button
                asChild
                variant="outline"
                size="lg"
                className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Link href="/dashboard">
                  {L("MealPlannerAPI", "Dashboard:Title")}
                </Link>
              </Button>
            ) : (
              <Button
                asChild
                variant="outline"
                size="lg"
                className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Link href="/register">
                  {L("MealPlannerAPI", "Auth:CreateAccount")}
                </Link>
              </Button>
            )}
          </div>

          {/* Social proof strip */}
          <div className="flex items-center gap-3 pt-2">
            <div className="flex -space-x-2" aria-hidden="true">
              {["🧑‍🍳", "👩‍🍳", "🧑‍🍳", "👨‍🍳"].map((emoji, i) => (
                <span
                  key={i}
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-sm"
                >
                  {emoji}
                </span>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                {L("MealPlannerAPI", "Home:SocialProofCount")}
              </span>{" "}
              {L("MealPlannerAPI", "Home:SocialProofLabel")}
            </p>
          </div>
        </div>

        {/* Right column — stacked recipe preview cards */}
        <div
          className="shrink-0 relative w-52 h-52 sm:w-72 sm:h-72"
          aria-hidden="true"
        >
          {/* Back card */}
          <div className="absolute inset-4 rounded-2xl bg-primary/10 dark:bg-primary/15 border border-primary/15 rotate-6 shadow-lg" />
          {/* Middle card */}
          <div className="absolute inset-2 rounded-2xl bg-secondary/10 dark:bg-secondary/15 border border-secondary/15 -rotate-3 shadow-lg" />
          {/* Front card */}
          <div className="absolute inset-0 rounded-2xl bg-card border border-border shadow-xl flex flex-col items-center justify-center gap-3 p-6">
            <span className="text-5xl sm:text-6xl">🍽️</span>
            <div className="text-center">
              <p className="text-sm font-bold text-foreground">
                {L("MealPlannerAPI", "Home:HeroCardTitle")}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {L("MealPlannerAPI", "Home:HeroCardSubtitle")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
