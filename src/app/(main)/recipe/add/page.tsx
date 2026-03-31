"use client";

import React, { useState } from "react";
import { recipes } from "@/libs/api";
import { CreateRecipeDto } from "@/libs/interfaceDTO";
import { toast } from "sonner";
import { useLocalization } from "@/libs/localization";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { RecipeHeader } from "@/components/recipes/add/RecipeHeader";
import { BasicInfoSection } from "@/components/recipes/add/BasicInfoSection";
import { IngredientsSection } from "@/components/recipes/add/IngredientsSection";
import { InstructionsSection } from "@/components/recipes/add/InstructionsSection";
import { createEmptyRow, resolveRow } from "@/libs/ingredient-row-helpers";
import { IngredientRow } from "@/libs/recipe-form-types";

const emptyForm = (): CreateRecipeDto => ({
  name: "",
  cuisine: "",
  difficulty: 0,
  cookingTimeMinutes: 0,
  prepTimeMinutes: 0,
  servings: 4,
  description: "",
  imageUrl: "",
  tags: [],
  instructions: [""],
  ingredients: [{ name: "", quantity: 0, unit: "" }],
});

export default function AddRecipePage() {
  const [form, setForm] = useState<CreateRecipeDto>(emptyForm);
  const [tagInput, setTagInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ingredients, setIngredients] = useState<IngredientRow[]>([
    createEmptyRow(),
  ]);

  const { L } = useLocalization();
  const router = useRouter();

  const set = <K extends keyof CreateRecipeDto>(
    key: K,
    value: CreateRecipeDto[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const updateInstruction = (index: number, value: string) =>
    setForm((prev) => {
      const next = [...prev.instructions];
      next[index] = value;
      return { ...prev, instructions: next };
    });

  const addInstruction = () =>
    setForm((prev) => ({ ...prev, instructions: [...prev.instructions, ""] }));

  const removeInstruction = (index: number) =>
    setForm((prev) => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index),
    }));

  const commitTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !form.tags.includes(tag)) {
      set("tags", [...form.tags, tag]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) =>
    set(
      "tags",
      form.tags.filter((t) => t !== tag),
    );

  const updateIngredient = (key: string, patch: Partial<IngredientRow>) =>
    setIngredients((prev) =>
      prev.map((r) => (r.key === key ? { ...r, ...patch } : r)),
    );

  const addIngredient = () =>
    setIngredients((prev) => [...prev, createEmptyRow()]);

  const removeIngredient = (key: string) =>
    setIngredients((prev) => prev.filter((r) => r.key !== key));

  const validate = (): string | null => {
    if (!form.name.trim())
      return (
        L("MealPlannerAPI", "RecipeNameIsRequired") ||
        "Recipe name is required."
      );
    if (!form.cuisine.trim())
      return L("MealPlannerAPI", "CuisineIsRequired") || "Cuisine is required.";
    if (!form.description.trim())
      return (
        L("MealPlannerAPI", "DescriptionIsRequired") ||
        "Description is required."
      );
    if (form.instructions.some((s) => !s.trim()))
      return (
        L("MealPlannerAPI", "AllInstructionStepsMustBeFilled") ||
        "All instruction steps must be filled in."
      );
    if (form.instructions.length === 0)
      return (
        L("MealPlannerAPI", "AtLeastOneInstructionIsRequired") ||
        "At least one instruction step is required."
      );
    if (form.ingredients.length === 0)
      return (
        L("MealPlannerAPI", "AtLeastOneIngredientIsRequired") ||
        "At least one ingredient is required."
      );
    for (const ing of form.ingredients) {
      if (!ing.name.trim())
        return (
          L("MealPlannerAPI", "EveryIngredientNeedsAName") ||
          "Every ingredient needs a name."
        );
      if (ing.quantity <= 0)
        return (
          L("MealPlannerAPI", "IngredientQuantityMustBeGreaterThanZero") ||
          "Ingredient quantity must be greater than 0."
        );
      if (!ing.unit.trim())
        return (
          L("MealPlannerAPI", "EveryIngredientNeedsAUnit") ||
          "Every ingredient needs a unit."
        );
    }
    for (const row of ingredients) {
      if (!row.name.trim()) return "Every ingredient needs a name.";
      if (row.conversionStatus === "needs-density")
        return `Select a density for "${row.name}" (volume unit requires it to calculate grams).`;
      if (row.conversionStatus === "needs-grams")
        return `Enter a gram equivalent for "${row.name}" (count unit).`;
      if (!row.quantityGrams || row.quantityGrams <= 0)
        return `Quantity for "${row.name}" must be greater than 0.`;
      if (!row.unit) return `Select a unit for "${row.name}".`;
    }
    return null;
  };

  const handleAddingRecipe = async () => {
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    const payload: CreateRecipeDto = {
      ...form,
      imageUrl: form.imageUrl?.trim() || undefined,
      instructions: form.instructions.map((s) => s.trim()).filter(Boolean),
      tags: form.tags.map((t) => t.trim()).filter(Boolean),
      ingredients: ingredients.map((row) => ({
        name: row.name.trim(),
        quantity: row.quantityGrams!, // already in grams
        unit: row.displayQuantity, // "2 tbsp", "150 g", etc.
        nutritionId: row.nutritionId ?? undefined,
      })),
    };

    setSubmitting(true);
    try {
      const response = await recipes.create(payload);
      toast.success(
        L("MealPlannerAPI", "RecipeCreatedSuccessfully") ||
          "Recipe created successfully!",
      );
      router.push(`/recipe/${response.data.id}`);
      setForm(emptyForm());
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(
          err.response?.data?.error?.message ??
            L("MealPlannerAPI", "FailToAddRecipe") ??
            "Failed to add recipe",
        );
      } else {
        toast.error(
          L("AbpUi", "UnexpectedErrorOccurred") ??
            "An unexpected error occurred",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 pt-24 pb-16 min-h-screen animate-page-in">
      <RecipeHeader />

      <div className="grid gap-6">
        <BasicInfoSection
          form={form}
          set={set}
          tagInput={tagInput}
          setTagInput={setTagInput}
          commitTag={commitTag}
          removeTag={removeTag}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <IngredientsSection
            ingredients={ingredients}
            onAdd={addIngredient}
            onRemove={removeIngredient}
            onUpdate={updateIngredient}
          />

          <InstructionsSection
            instructions={form.instructions}
            addInstruction={addInstruction}
            removeInstruction={removeInstruction}
            updateInstruction={updateInstruction}
          />
        </div>

        <div className="mt-4 flex justify-end gap-3 pb-12">
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={submitting}
          >
            {L("AbpUi", "Cancel") || "Cancel"}
          </Button>
          <Button
            onClick={handleAddingRecipe}
            disabled={submitting}
            className="min-w-32 bg-primary dark:bg-primary shadow-lg shadow-primary/20"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <span className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                {L("MealPlannerAPI", "Creating") || "Creating..."}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="size-4" />
                {L("MealPlannerAPI", "CreateRecipe") || "Create Recipe"}
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
