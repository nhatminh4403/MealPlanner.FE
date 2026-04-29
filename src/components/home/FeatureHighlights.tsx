"use client";

import Link from "next/link";
import { ChefHat, Calendar, ShoppingCart, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useLocalization } from "@/libs/LocalizationProvider";

interface FeatureCard {
  titleKey: string;
  descriptionKey: string;
  hintKey: string;
  href: string;
  icon: LucideIcon;
  emoji: string;
  accentColor: string;
  bgColor: string;
}

export const FEATURES: FeatureCard[] = [
  {
    titleKey: "Menu:Recipes",
    descriptionKey: "Home:Feature:RecipesDesc",
    hintKey: "Recipes:Browse",
    href: "/recipe",
    icon: ChefHat,
    emoji: "🍳",
    accentColor: "text-emerald-500",
    bgColor: "bg-emerald-500/10 dark:bg-emerald-500/15",
  },
  {
    titleKey: "Menu:MealPlans",
    descriptionKey: "Home:Feature:MealPlansDesc",
    hintKey: "MealPlan:Title",
    href: "/meal-plans",
    icon: Calendar,
    emoji: "📅",
    accentColor: "text-blue-500",
    bgColor: "bg-blue-500/10 dark:bg-blue-500/15",
  },
  {
    titleKey: "Menu:ShoppingLists",
    descriptionKey: "Home:Feature:ShoppingDesc",
    hintKey: "ShoppingList:Title",
    href: "/shopping-lists",
    icon: ShoppingCart,
    emoji: "🛒",
    accentColor: "text-violet-500",
    bgColor: "bg-violet-500/10 dark:bg-violet-500/15",
  },
];

export default function FeatureHighlights() {
  const { L } = useLocalization();

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">
          {L("MealPlannerAPI", "Home:FeaturesTitle")}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {FEATURES.map((feature) => {
          const Icon = feature.icon;

          return (
            <Link
              key={feature.href}
              href={feature.href}
              className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl"
            >
              <article className="gradient-border relative overflow-hidden rounded-2xl p-6 h-full bg-card border border-border transition-all duration-300 group-hover:shadow-brand-glow group-hover:-translate-y-0.5">
                {/* Background emoji watermark */}
                <span
                  className="pointer-events-none absolute -right-3 -bottom-3 text-7xl opacity-[0.06] dark:opacity-[0.05] select-none"
                  aria-hidden="true"
                >
                  {feature.emoji}
                </span>

                <div className="relative z-10 flex flex-col gap-4">
                  {/* Icon */}
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.bgColor}`}
                    aria-label={L("MealPlannerAPI", feature.titleKey)}
                  >
                    <Icon
                      className={`w-6 h-6 ${feature.accentColor}`}
                      aria-hidden="true"
                    />
                  </div>

                  {/* Text */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground mb-1.5">
                      {L("MealPlannerAPI", feature.titleKey)}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {L("MealPlannerAPI", feature.descriptionKey)}
                    </p>
                  </div>

                  {/* CTA hint */}
                  <div
                    className={`flex items-center gap-1.5 text-sm font-semibold ${feature.accentColor} mt-1`}
                  >
                    {L("MealPlannerAPI", feature.hintKey)}
                    <ArrowRight
                      className="w-4 h-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
