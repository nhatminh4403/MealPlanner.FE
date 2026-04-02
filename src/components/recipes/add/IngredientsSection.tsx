"use client";

import React from "react";
import { useLocalization } from "@/libs/localization";
import { Plus, Trash2, AlertCircle, Scale } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IngredientRow } from "@/libs/recipe-form-types";
import { IngredientNutritionDto } from "@/libs/interfaceDTO";
import { Unit } from "@/libs/interfaceDTO";
import { UnitSelect } from "./UnitSelect";
import { IngredientSearch } from "./IngredientSearch";
import { DensitySelector } from "./DensitySelector";
import { resolveRow } from "@/libs/ingredient-row-helpers";
import { cn } from "@/lib/utils";

interface IngredientsSectionProps {
  ingredients: IngredientRow[];
  onAdd: () => void;
  onRemove: (key: string) => void;
  onUpdate: (key: string, patch: Partial<IngredientRow>) => void;
}

export function IngredientsSection({
  ingredients,
  onAdd,
  onRemove,
  onUpdate,
}: IngredientsSectionProps) {
  const { L } = useLocalization();

  const update = (key: string, patch: Partial<IngredientRow>) => {
    // Always re-resolve after any patch so grams stay in sync
    // const current = ingredients.find((r) => r.key === key)!;
    // const merged = { ...current, ...patch };
    // const resolved = resolveRow(merged);
    onUpdate(key, patch);
  };

  return (
    <Card className="border-none shadow-premium dark:shadow-premium-dark">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>
            {L("MealPlannerAPI", "Ingredients") || "Ingredients"}
          </CardTitle>
          <CardDescription>
            {L("MealPlannerAPI", "IngredientsDescription") ||
              "List all items needed"}
          </CardDescription>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-input bg-background hover:bg-accent"
        >
          <Plus className="size-4" />
        </button>
      </CardHeader>

      <CardContent className="grid gap-5">
        {ingredients.map((row) => (
          <div
            key={row.key}
            className="rounded-lg border border-border/60 p-3 flex flex-col gap-2"
          >
            {/* Row 1 — name search + quantity + unit + remove */}
            <div className="flex items-start gap-2">
              <IngredientSearch
                value={row.name}
                linkedNutrition={row.nutritionData}
                onNameChange={(name) => update(row.key, { name })}
                onNutritionLinked={(n: IngredientNutritionDto) =>
                  update(row.key, { nutritionId: n.id, nutritionData: n })
                }
                onNutritionUnlinked={() =>
                  update(row.key, { nutritionId: null, nutritionData: null })
                }
              />

              <Input
                type="number"
                className="h-9 w-20 shrink-0"
                value={row.quantityInput || ""}
                min={0.001}
                step={0.1}
                onChange={(e) =>
                  update(row.key, { quantityInput: Number(e.target.value) })
                }
                placeholder="Qty"
              />

              <div className="w-28 shrink-0">
                <UnitSelect
                  value={row.unit}
                  onChange={(unit: Unit) => update(row.key, { unit })}
                />
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => onRemove(row.key)}
                disabled={ingredients.length === 1}
                className="text-muted-foreground hover:text-destructive shrink-0"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>

            {/* Row 2 — density selector for volume units */}
            {row.unit?.category === "volume" && (
              <DensitySelector
                value={row.densityGPerMl}
                onChange={(density) =>
                  update(row.key, { densityGPerMl: density })
                }
              />
            )}

            {/* Row 2 — gram override for count units */}
            {row.unit?.category === "count" && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground shrink-0">
                  Gram equivalent:
                </span>
                <Input
                  type="number"
                  className="h-7 w-24 text-xs"
                  min={0.1}
                  step={1}
                  value={row.gramsOverride || ""}
                  onChange={(e) =>
                    update(row.key, { gramsOverride: Number(e.target.value) })
                  }
                  placeholder="e.g. 50"
                />
                <span className="text-xs text-muted-foreground">
                  g per {row.unit.label}
                </span>
              </div>
            )}

            {/* Row 3 — resolved grams preview / warning */}
            <div className="flex items-center gap-2">
              {row.conversionStatus === "ok" && row.quantityGrams !== null && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Scale className="size-3" />
                  {row.displayQuantity} ={" "}
                  <span className="font-medium text-foreground">
                    {row.quantityGrams.toFixed(1)} g
                  </span>
                  {row.nutritionData && (
                    <span className="ml-2 text-green-600 dark:text-green-400">
                      ≈{" "}
                      {(
                        (row.nutritionData.caloriesPer100g *
                          row.quantityGrams) /
                        100
                      ).toFixed(0)}{" "}
                      kcal
                    </span>
                  )}
                </div>
              )}
              {(row.conversionStatus === "needs-density" ||
                row.conversionStatus === "needs-grams") && (
                <div className="flex items-center gap-1 text-xs text-amber-600">
                  <AlertCircle className="size-3" />
                  {row.conversionStatus === "needs-density"
                    ? "Select a density to calculate grams"
                    : "Enter gram equivalent for this unit"}
                </div>
              )}
            </div>
          </div>
        ))}

        {ingredients.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-8 text-center">
            <p className="text-sm text-muted-foreground">
              No ingredients added
            </p>
            <Button variant="link" size="sm" onClick={onAdd} className="mt-2">
              <Plus className="mr-1 size-3" /> Add Ingredient
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
