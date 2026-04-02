"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { recipes as recipeApi } from "@/libs/api";
import type { Recipe, CreateRecipeDto } from "@/libs/interfaceDTO";
import { toast } from "sonner";
import axios from "axios";
import { useLocalization } from "@/libs/localization";
import {
  Loader2,
  ArrowLeft,
  Save,
  ChefHat,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BasicInfoSection } from "@/components/recipes/add/BasicInfoSection";
import { IngredientsSection } from "@/components/recipes/add/IngredientsSection";
import { InstructionsSection } from "@/components/recipes/add/InstructionsSection";
import { createEmptyRow, resolveRow } from "@/libs/ingredient-row-helpers";
import { IngredientRow } from "@/libs/recipe-form-types";
import { UNITS } from "@/libs/unit-conversion";

// ── helpers ───────────────────────────────────────────────────────────────────

function emptyForm(): CreateRecipeDto {
  return {
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
    ingredients: [],
  };
}

/**
 * Converts API Recipe Ingredients back into UI IngredientRows
 */
function recipeToRows(recipe: Recipe): IngredientRow[] {
  if (!recipe.ingredients?.length) return [createEmptyRow()];

  return recipe.ingredients.map((ing) => {
    // 1. Determine Unit (default to Grams if not found)
    const display = ing.displayQuantity || "";
    const parts = display.trim().split(" ");
    const lastPart = parts[parts.length - 1];
    const unit = UNITS.find((u) => u.label === lastPart) || UNITS.find((u) => u.label === "g")!;

    // 2. Determine original Input Quantity
    // If it was "2 tbsp", parts[0] is "2". If just "150", use grams.
    const qtyInput = parts.length >= 2 ? parseFloat(parts[0]) : ing.quantityGrams;

    const row: IngredientRow = {
      key: ing.id,
      name: ing.name,
      quantityInput: qtyInput || 0,
      unit: unit,
      densityGPerMl: 1.0, 
      gramsOverride: unit.category === "count" ? ing.quantityGrams : 0,
      quantityGrams: ing.quantityGrams,
      displayQuantity: ing.displayQuantity ?? `${ing.quantityGrams} g`,
      nutritionId: ing.nutrition ? ing.id : null, // Assuming ID mapping or external ID
      nutritionData: null, // This would be fetched/linked if needed for preview
      conversionStatus: "ok",
      searchOpen: false,
    };
    
    // resolving ensures density/factors are pre-calculated for the UI
    return resolveRow(row);
  });
}

// ── page ──────────────────────────────────────────────────────────────────────

export default function EditRecipePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { L } = useLocalization();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [form, setForm] = useState<CreateRecipeDto>(emptyForm());
  const [tagInput, setTagInput] = useState("");
  const [ingredients, setIngredients] = useState<IngredientRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── fetch existing recipe ──────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await recipeApi.get(id);
        const data = res.data;
        
        setRecipe(data);
        setForm({
          name: data.name,
          cuisine: data.cuisine,
          difficulty: data.difficulty,
          cookingTimeMinutes: data.cookingTimeMinutes,
          prepTimeMinutes: data.prepTimeMinutes,
          servings: data.servings,
          description: data.description,
          imageUrl: data.imageUrl ?? "",
          tags: data.tags ?? [],
          instructions: data.instructions?.length ? data.instructions : [""],
          ingredients: [], // We use the 'ingredients' state instead
        });
        setIngredients(recipeToRows(data));
      } catch {
        setError("Failed to load recipe.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // ── form helpers ──────────────────────────────────────────────────────────
  const set = <K extends keyof CreateRecipeDto>(key: K, value: CreateRecipeDto[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

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
    if (tag && !form.tags.includes(tag)) set("tags", [...form.tags, tag]);
    setTagInput("");
  };

  const removeTag = (tag: string) =>
    set("tags", form.tags.filter((t) => t !== tag));

  // FIX: resolveRow inside setIngredients to prevent "rice vs brown rice" naming bug
  const updateIngredient = (key: string, patch: Partial<IngredientRow>) =>
    setIngredients((prev) =>
      prev.map((r) => (r.key === key ? resolveRow({ ...r, ...patch }) : r)),
    );

  const addIngredient = () =>
    setIngredients((prev) => [...prev, createEmptyRow()]);

  const removeIngredient = (key: string) =>
    setIngredients((prev) => prev.filter((r) => r.key !== key));

  // ── validation ────────────────────────────────────────────────────────────
  const validate = (): string | null => {
    if (!form.name.trim()) return "Recipe name is required.";
    if (!form.cuisine.trim()) return "Cuisine is required.";
    if (!form.description.trim()) return "Description is required.";
    if (form.instructions.some((s) => !s.trim())) return "All instruction steps must be filled in.";
    
    for (const row of ingredients) {
      if (!row.name.trim()) return "Every ingredient needs a name.";
      if (row.conversionStatus === "needs-density")
        return `Select a density for "${row.name}".`;
      if (row.conversionStatus === "needs-grams")
        return `Enter a gram equivalent for "${row.name}".`;
      if (!row.quantityGrams || row.quantityGrams <= 0)
        return `Quantity for "${row.name}" must be greater than 0.`;
    }
    return null;
  };

  // ── submit ────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    const err = validate();
    if (err) { toast.error(err); return; }

    const payload: CreateRecipeDto = {
      ...form,
      imageUrl: form.imageUrl?.trim() || undefined,
      instructions: form.instructions.map((s) => s.trim()).filter(Boolean),
      tags: form.tags.map((t) => t.trim()).filter(Boolean),
      ingredients: ingredients.map((row) => ({
        name: row.name.trim(),
        quantity: row.quantityGrams!,
        unit: row.displayQuantity,
        nutritionId: row.nutritionId ?? undefined,
      })),
    };

    setSubmitting(true);
    try {
      await recipeApi.update(id, payload);
      toast.success("Recipe updated successfully!");
      router.push(`/recipe/${id}`);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.error?.message ?? "Failed to update recipe.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-20">
        <Loader2 className="size-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 pt-20">
        <p className="text-muted-foreground">{error ?? "Recipe not found."}</p>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="size-4 mr-2" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen px-4 sm:px-6 pt-24 pb-20 animate-page-in bg-gradient-mesh overflow-hidden">
      
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 size-130 rounded-full bg-primary/20 blur-3xl opacity-40" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 size-105 rounded-full bg-secondary/20 blur-3xl opacity-40" />

      {/* Header Area */}
      <div className="relative z-10 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
            <ArrowLeft className="size-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-widest mb-1">
              <Sparkles className="size-3" /> Editing Mode
            </div>
            <h1 className="text-3xl font-black tracking-tight leading-none text-foreground">
              {form.name || "Untitled Recipe"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => router.back()} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={submitting} className="min-w-32 shadow-lg shadow-primary/20">
            {submitting ? <Loader2 className="size-4 animate-spin mr-2" /> : <Save className="size-4 mr-2" />}
            Save Changes
          </Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="relative z-10 rounded-3xl border border-white/20 dark:border-white/10 bg-white/60 dark:bg-zinc-900/55 backdrop-blur-xl shadow-2xl p-4 sm:p-6">
        <div className="grid gap-6 lg:grid-cols-3">
          
          {/* Column 1: Basic Info */}
          <div className="lg:col-span-1">
            <BasicInfoSection
              form={form}
              set={set}
              tagInput={tagInput}
              setTagInput={setTagInput}
              commitTag={commitTag}
              removeTag={removeTag}
            />
          </div>

          {/* Column 2 & 3: Ingredients & Instructions (Scrollable) */}
          <div className="lg:col-span-2 flex flex-col gap-6 max-h-[calc(100vh-280px)] overflow-y-auto pr-2 custom-scrollbar">
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
        </div>
      </div>
    </div>
  );
}