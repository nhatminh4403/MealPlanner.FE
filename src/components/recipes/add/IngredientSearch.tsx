"use client";

import React, { useState, useEffect, useRef } from "react";
import { ingredientNutritions } from "@/libs/api";
import {
  IngredientNutritionDto,
  ExternalFoodCandidateDto,
} from "@/libs/interfaceDTO";
import { Input } from "@/components/ui/input";
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
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Debounced DB search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    if (!query.trim() || query.length < 2) {
      setDbResults([]);
      setOpen(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await ingredientNutritions.search(query, false);
        setDbResults(res.data.dbResults ?? []);
        setOpen(true);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, [query]);

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

  // User selects a DB result — link it directly
  const handleSelectDb = (item: IngredientNutritionDto) => {
    onNameChange(item.name);
    setQuery(item.name);
    onNutritionLinked(item);
    setOpen(false);
  };

  // User selects a USDA result — save it to DB first, then link
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="relative flex-1">
      <div className="relative">
        <Input
          className="h-9 pr-8"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onNameChange(e.target.value);
            if (linkedNutrition) onNutritionUnlinked(); // unlink if user renames
          }}
          placeholder="Ingredient name"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          {loading ? (
            <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
          ) : linkedNutrition ? (
            <Check className="size-3.5 text-green-500" />
          ) : (
            <Search className="size-3.5 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Linked nutrition badge */}
      {linkedNutrition && (
        <div className="mt-1 flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
          <Database className="size-3" />
          <span>Linked: {linkedNutrition.name}</span>
          <span className="text-muted-foreground">
            · {linkedNutrition.caloriesPer100g} kcal/100g
          </span>
          <button
            type="button"
            onClick={onNutritionUnlinked}
            className="ml-auto text-muted-foreground hover:text-destructive"
          >
            <Link2Off className="size-3" />
          </button>
        </div>
      )}

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg">
          {/* DB Results */}
          {dbResults.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground border-b">
                <Database className="size-3" /> From database
              </div>
              {dbResults.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectDb(item)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-accent text-left"
                >
                  <span>{item.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {item.caloriesPer100g} kcal · {item.proteinPer100g}g P ·{" "}
                    {item.carbsPer100g}g C · {item.fatPer100g}g F
                  </span>
                </button>
              ))}
            </div>
          )}

          {dbResults.length === 0 && !showExternal && (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              No local results for &quot;{query}&quot;
            </div>
          )}

          {/* USDA results */}
          {showExternal && (
            <div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground border-b border-t">
                <Globe className="size-3" /> USDA FoodData
              </div>
              {loadingExternal ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="size-4 animate-spin text-muted-foreground" />
                </div>
              ) : externalResults.length === 0 ? (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  No USDA results found.
                </div>
              ) : (
                externalResults.map((item) => (
                  <button
                    key={item.externalId}
                    type="button"
                    onClick={() => handleSelectExternal(item)}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-accent text-left gap-2"
                  >
                    <div>
                      <div>{item.name}</div>
                      {item.brand && (
                        <div className="text-xs text-muted-foreground">
                          {item.brand}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {item.caloriesPer100g} kcal · {item.completenessScore}%
                      complete
                    </span>
                  </button>
                ))
              )}
            </div>
          )}

          {/* Search USDA button */}
          {!showExternal && (
            <button
              type="button"
              onClick={handleSearchUsda}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs text-primary hover:bg-accent border-t"
            >
              <Globe className="size-3" />
              Search USDA FoodData
            </button>
          )}
        </div>
      )}
    </div>
  );
}
