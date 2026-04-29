"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLocalization } from "@/libs/LocalizationProvider";
import {
  Sparkles,
  ArrowRight,
  ChefHat,
  Calendar,
  ShoppingCart,
} from "lucide-react";

const PERKS = [
  { icon: ChefHat, key: "Home:CTA:Perk1" },
  { icon: Calendar, key: "Home:CTA:Perk2" },
  { icon: ShoppingCart, key: "Home:CTA:Perk3" },
];

export default function CTASection() {
  const { L } = useLocalization();

  return (
    <section className="animate-fade-in-up">
      <div className="relative overflow-hidden rounded-3xl bg-primary-secondary-205 shadow-brand-glow">
        {/* Gradient border */}
        <div className="gradient-border-static absolute inset-0 rounded-3xl pointer-events-none" />

        {/* Decorative blobs */}
        <div
          className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-primary/15 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-secondary/15 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10 p-10 sm:p-14 lg:p-16">
          {/* Left: copy */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3 py-1.5 text-xs font-semibold text-primary mb-5">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              {L("MealPlannerAPI", "Home:CTA:Badge")}
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground mb-4 leading-tight">
              {L("MealPlannerAPI", "Auth:CreateAnAccount")}
            </h2>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8">
              {L("MealPlannerAPI", "Auth:RegisterDescription")}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Button
                asChild
                size="lg"
                className="group gap-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Link href="/register">
                  {L("MealPlannerAPI", "Auth:Register")}
                  <ArrowRight
                    className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Link href="/login">{L("MealPlannerAPI", "User:SignIn")}</Link>
              </Button>
            </div>
          </div>

          {/* Right: perks list */}
          <div className="shrink-0 w-full lg:w-72 flex flex-col gap-3">
            {PERKS.map(({ icon: Icon, key }) => (
              <div
                key={key}
                className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/50 backdrop-blur-sm px-4 py-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="w-4 h-4 text-primary" aria-hidden="true" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  {L("MealPlannerAPI", key)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
