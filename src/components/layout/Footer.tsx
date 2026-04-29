"use client";

import Link from "next/link";
import React from "react";
import { useLocalization } from "@/libs/LocalizationProvider";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ChefHat } from "lucide-react";

const FOOTER_LINKS = [
  { labelKey: "Footer:About", href: "#" },
  { labelKey: "Footer:Privacy", href: "#" },
  { labelKey: "Footer:Terms", href: "#" },
  { labelKey: "Footer:Contact", href: "#" },
];

export default function Footer() {
  const { L } = useLocalization();

  return (
    <footer className="mt-auto border-t border-zinc-200 bg-white/80 backdrop-blur-md transition-colors duration-300 dark:border-zinc-800 dark:bg-black/80">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
              <ChefHat className="h-4 w-4 text-primary" aria-hidden="true" />
            </div>
            <span className="text-sm font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
              MealPlanner
            </span>
          </div>

          {/* Nav links */}
          <nav
            className="flex flex-wrap justify-center gap-x-6 gap-y-2"
            aria-label="Footer navigation"
          >
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.labelKey}
                href={link.href}
                className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              >
                {L("MealPlannerAPI", link.labelKey)}
              </Link>
            ))}
          </nav>

          {/* Right: language + copyright */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <LanguageSwitcher />
            <p className="text-sm text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
              &copy; {new Date().getFullYear()} MealPlanner.{" "}
              {L("MealPlannerAPI", "Footer:AllRightsReserved")}
            </p>
          </div>
        </div>

        {/* Crafted with love */}
        <p className="mt-6 text-center text-xs text-zinc-400 dark:text-zinc-600">
          {L("MealPlannerAPI", "Footer:CraftedWithLove").replace("{0}", "❤️")}
        </p>
      </div>
    </footer>
  );
}
