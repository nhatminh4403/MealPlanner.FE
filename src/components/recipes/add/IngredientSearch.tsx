"use client";

import React, { useState, useEffect, useRef } from "react";
import { ingredientNutritions } from "@/libs/api";
import {
  IngredientNutritionDto,
  ExternalFoodCandidateDto,
} from "@/libs/interfaceDTO";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverAnchor,
} from "@/components/ui/popover";
import {
  Loader2,
  Search,
  Database,
  Globe,
  Check,
  Link2Off,
} from "lucide-react";
import { cn } from "@/libs/utils";

interface IngredientSearchProps {
  value: string;
  linkedNutrition: IngredientNutritionDto | null;
  onNameChange: (name: string) => void;
  onNutritionLinked: (nutrition: IngredientNutritionDto) => void;
  onNutritionUnlinked: () => void;
}

export function IngredientSearch({
  value,
  linkedNutrition,
  onNameChange,
  onNutritionLinked,
  onNutritionUnlinked,
}: IngredientSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const [dbResults, setDbResults] = useState<IngredientNutritionDto[]>([]);
  const [externalResults, setExternalResults] = useState<
    ExternalFoodCandidateDto[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [loadingExternal, setLoadingExternal] = useState(false);
  const [showExternal, setShowExternal] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced DB search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (linkedNutrition && query === linkedNutrition.name) {
      setOpen(false);
      return;
    }
    if (!query.trim() || query.length < 2) {
      setDbResults([]);
      setShowExternal(false); // Cleanup: Hide USDA box
      setExternalResults([]);
      setOpen(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await ingredientNutritions.search(query, false);
        const results = res.data.dbResults ?? [];
        setDbResults(results);
        setShowExternal(false);
        setOpen(true);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, [query, linkedNutrition]);

  const handleSearchUsda = async () => {
    setLoadingExternal(true);
    setShowExternal(true);
    try {
      const res = await ingredientNutritions.search(query, true);
      setExternalResults(res.data.externalCandidates ?? []);
    } finally {
      setLoadingExternal(false);
    }
  };

  const handleSelectDb = (item: IngredientNutritionDto) => {
    onNameChange(item.name);
    setQuery(item.name);
    onNutritionLinked(item);
    setOpen(false);
    setShowExternal(false);
  };

  const handleSelectExternal = async (item: ExternalFoodCandidateDto) => {
    setLoading(true);
    try {
      const res = await ingredientNutritions.create({
        name: item.name,
        caloriesPer100g: item.caloriesPer100g,
        proteinPer100g: item.proteinPer100g,
        carbsPer100g: item.carbsPer100g,
        fatPer100g: item.fatPer100g,
        fiberPer100g: item.fiberPer100g,
        sourceExternalId: item.externalId,
      });
      onNameChange(item.name);
      setQuery(item.name);
      onNutritionLinked(res.data);
      setOpen(false);
      setShowExternal(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex-1 min-w-0">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverAnchor asChild>
          <div className="relative">
            <Input
              className={cn(
                "h-9 pr-8 font-medium",
                "bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--foreground)]",
                "focus:border-primary focus:ring-[var(--input-ring)]",
                "transition-colors duration-150",
                linkedNutrition &&
                  "border-secondary/50 focus:border-secondary focus:ring-[rgba(16,185,129,0.18)]",
              )}
              value={query}
              onChange={(e) => {
                // const value = e.target.value;
                setQuery(e.target.value);
                onNameChange(e.target.value);

                if (linkedNutrition) onNutritionUnlinked();
                setShowExternal(false);
                setExternalResults([]);
              }}
              onBlur={() => setTimeout(() => setOpen(false), 150)}
              onFocus={() => {
                if (dbResults.length > 0 || showExternal) setOpen(true);
              }}
              placeholder="Ingredient name"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
              {loading ? (
                <Loader2 className="size-3.5 animate-spin text-[var(--muted-fg)]" />
              ) : linkedNutrition ? (
                <Check className="size-3.5 text-secondary" />
              ) : (
                <Search className="size-3.5 text-[var(--muted-fg)]" />
              )}
            </div>
          </div>
        </PopoverAnchor>

        <PopoverContent
          style={{ width: "var(--radix-popover-trigger-width)" }}
          className={cn(
            "p-0 overflow-hidden rounded-xl",
            "bg-popover border border-border",

            "shadow-xl shadow-black/40",
            "animate-in fade-in zoom-in-95 duration-150",
          )}
          onOpenAutoFocus={(e) => e.preventDefault()}
          sideOffset={4}
          align="start"
        >
          {/* ── DB Results ───────────────────────────────────── */}
          {dbResults.length > 0 && (
            <div>
              <div
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2",
                  "text-[10px] font-bold uppercase tracking-widest",
                  "text-primary bg-primary/15 dark:bg-primary/10",
                  "border-b border-[var(--popover-border)]",
                )}
              >
                <Database className="size-3" /> From database
              </div>
              {dbResults.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelectDb(item);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 text-sm text-left gap-3 dark:text-white/90 text-black",
                    "text-[var(--foreground)] hover:bg-primary/20 dark:hover:bg-primary/12",
                    "transition-colors duration-100",
                  )}
                >
                  <span className="font-medium truncate">{item.name}</span>
                  <span className="text-xs text-[var(--muted-fg)] shrink-0">
                    {item.caloriesPer100g} kcal · {item.proteinPer100g}g P ·{" "}
                    {item.carbsPer100g}g C · {item.fatPer100g}g F
                  </span>
                </button>
              ))}
            </div>
          )}

          {dbResults.length === 0 && !showExternal && (
            <div className="px-3 py-3 text-sm text-[var(--muted-fg)]">
              No local results for &quot;{query}&quot;
            </div>
          )}

          {/* ── USDA Results ─────────────────────────────────── */}
          {showExternal && (
            <div>
              <div
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2",
                  "text-[10px] font-bold uppercase tracking-widest",
                  "text-secondary bg-secondary/15 dark:bg-secondary/10",
                  "border-b border-t border-[var(--popover-border)]",
                )}
              >
                <Globe className="size-3" /> USDA FoodData
              </div>
              {loadingExternal ? (
                <div className="flex items-center justify-center py-5">
                  <Loader2 className="size-4 animate-spin text-[var(--muted-fg)]" />
                </div>
              ) : externalResults.length === 0 ? (
                <div className="px-3 py-3 text-sm text-[var(--muted-fg)]">
                  No USDA results found.
                </div>
              ) : (
                externalResults.map((item) => (
                  <button
                    key={item.externalId}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelectExternal(item);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 text-sm text-left gap-3",
                      "text-[var(--foreground)] hover:bg-secondary/20 dark:hover:bg-secondary/12",
                      "transition-colors duration-100",
                    )}
                  >
                    <div className="min-w-0">
                      <div className="font-medium truncate">{item.name}</div>
                      {item.brand && (
                        <div className="text-xs text-[var(--muted-fg)] truncate">
                          {item.brand}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-[var(--muted-fg)] shrink-0">
                      {item.caloriesPer100g} kcal · {item.completenessScore}%
                    </span>
                  </button>
                ))
              )}
            </div>
          )}

          {/* ── Search USDA button ───────────────────────────── */}
          {!showExternal && (
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleSearchUsda();
              }}
              className={cn(
                "w-full flex items-center justify-center gap-1.5 px-3 py-2.5",
                "text-xs font-medium text-secondary",
                "hover:bg-secondary/8 dark:hover:bg-secondary/12",
                "border-t border-[var(--popover-border)]",
                "transition-colors duration-100",
              )}
            >
              <Globe className="size-3" />
              Search USDA FoodData
            </button>
          )}
        </PopoverContent>
      </Popover>

      {/* Linked nutrition badge */}
      {linkedNutrition && (
        <div className="mt-1 flex items-center gap-1.5 text-xs">
          <Database className="size-3 text-secondary shrink-0" />
          <span className="text-secondary font-medium truncate">
            {linkedNutrition.name}
          </span>
          <span className="text-[var(--muted-fg)] shrink-0">
            · {linkedNutrition.caloriesPer100g} kcal/100g
          </span>
          <button
            type="button"
            onClick={onNutritionUnlinked}
            className="ml-auto text-[var(--muted-fg)] hover:text-red-500 dark:hover:text-red-400 transition-colors shrink-0"
          >
            <Link2Off className="size-3" />
          </button>
        </div>
      )}
    </div>
  );
}
