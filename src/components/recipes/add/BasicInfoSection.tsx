"use client";

import React from "react";
import { CreateRecipeDto } from "@/libs/interfaceDTO";
import { useLocalization } from "@/libs/LocalizationProvider";
import { Clock, Tag as TagIcon, Image as ImageIcon, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { ChevronUp, ChevronDown } from "lucide-react";
interface BasicInfoSectionProps {
  form: CreateRecipeDto;
  set: <K extends keyof CreateRecipeDto>(
    key: K,
    value: CreateRecipeDto[K],
  ) => void;
  tagInput: string;
  setTagInput: (value: string) => void;
  commitTag: () => void;
  removeTag: (tag: string) => void;
}

export function BasicInfoSection({
  form,
  set,
  tagInput,
  setTagInput,
  commitTag,
  removeTag,
}: BasicInfoSectionProps) {
  const { L } = useLocalization();
  const [value, setValue] = React.useState();

  return (
    <Card className="bg-transparent border-none shadow-premium dark:shadow-premium-dark">
      <CardHeader>
        <CardTitle>
          {L("MealPlannerAPI", "BasicInformation") || "Basic Information"}
        </CardTitle>
        <CardDescription>
          {L("MealPlannerAPI", "BasicInfoDescription") ||
            "Start with the core details of your recipe"}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <Field>
          <FieldLabel>
            {L("MealPlannerAPI", "RecipeName") || "Recipe Name"}
          </FieldLabel>
          <Input
            placeholder={
              L("MealPlannerAPI", "RecipeNamePlaceholder") ||
              "e.g. Classic Beef Stroganoff"
            }
            className="border border-black dark:border-white/60"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel>
              {L("MealPlannerAPI", "Cuisine") || "Cuisine"}
            </FieldLabel>
            <Input
              placeholder={
                L("MealPlannerAPI", "CuisinePlaceholder") ||
                "e.g. Italian, Thai, French"
              }
              className="border border-black dark:border-white/60"
              value={form.cuisine}
              onChange={(e) => set("cuisine", e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>
              {L("MealPlannerAPI", "Difficulty") || "Difficulty"}
            </FieldLabel>
            <Select
              value={String(form.difficulty)}
              onValueChange={(value) =>
                set("difficulty", Number(value) as 0 | 1 | 2)
              }
            >
              <SelectTrigger className="w-full border border-black dark:border-white/60">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>

              <SelectContent className="w-full border border-black dark:border-white/60">
                <SelectItem value="0">Easy</SelectItem>
                <SelectItem value="1">Medium</SelectItem>
                <SelectItem value="2">Hard</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field>
            <FieldLabel className="flex items-center gap-2">
              <Clock className="size-4 text-muted-foreground" />
              {L("MealPlannerAPI", "PrepTime") || "Prep Time (min)"}
            </FieldLabel>
            <div className="relative">
              <Input
                type="number"
                className=" border-black dark:border-white/60"
                min={0}
                value={form.prepTimeMinutes}
                onChange={(e) => set("prepTimeMinutes", Number(e.target.value))}
              />
              <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col">
                <button
                  type="button"
                  onClick={() =>
                    set(
                      "prepTimeMinutes",
                      Math.max(0, form.prepTimeMinutes + 1),
                    )
                  }
                  className="px-1 text-[10px] text-[var(--muted-fg)] hover:text-foreground"
                >
                  <ChevronUp className="size-3" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    set(
                      "prepTimeMinutes",
                      Math.max(0, form.prepTimeMinutes - 1),
                    )
                  }
                  className="px-1 text-[10px] text-[var(--muted-fg)] hover:text-foreground"
                >
                  <ChevronDown className="size-3" />
                </button>
              </div>
            </div>
          </Field>
          <Field>
            <FieldLabel className="flex items-center gap-2">
              <Clock className="size-4 text-muted-foreground" />
              {L("MealPlannerAPI", "CookingTime") || "Cooking Time (min)"}
            </FieldLabel>
            <div className="relative">
              <Input
                type="number"
                min={0}
                className=" border-black dark:border-white/60"
                value={form.cookingTimeMinutes}
                onChange={(e) =>
                  set("cookingTimeMinutes", Number(e.target.value))
                }
              />
              <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col">
                <button
                  type="button"
                  onClick={() =>
                    set(
                      "cookingTimeMinutes",
                      Math.max(0, form.cookingTimeMinutes + 1),
                    )
                  }
                  className="px-1 text-[10px] text-[var(--muted-fg)] hover:text-foreground"
                >
                  <ChevronUp className="size-3" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    set(
                      "cookingTimeMinutes",
                      Math.max(0, form.cookingTimeMinutes - 1),
                    )
                  }
                  className="px-1 text-[10px] text-[var(--muted-fg)] hover:text-foreground"
                >
                  <ChevronDown className="size-3" />
                </button>
              </div>
            </div>
          </Field>
          <Field>
            <FieldLabel className="flex items-center gap-2">
              <Users className="size-4 text-muted-foreground" />
              {L("MealPlannerAPI", "Servings") || "Servings"}
            </FieldLabel>
            <div className="relative">
              <Input
                className=" border-black dark:border-white/60"
                type="number"
                min={1}
                value={form.servings}
                onChange={(e) => set("servings", Number(e.target.value))}
              />
              <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col">
                <button
                  type="button"
                  onClick={() =>
                    set("servings", Math.max(1, form.servings + 1))
                  }
                  className="px-1 text-[10px] text-[var(--muted-fg)] hover:text-foreground"
                >
                  <ChevronUp className="size-3" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    set("servings", Math.max(1, form.servings - 1))
                  }
                  className="px-1 text-[10px] text-[var(--muted-fg)] hover:text-foreground"
                >
                  <ChevronDown className="size-3" />
                </button>
              </div>
            </div>
          </Field>
        </div>

        <Field>
          <FieldLabel>
            {L("MealPlannerAPI", "Description") || "Description"}
          </FieldLabel>
          <Textarea
            placeholder={
              L("MealPlannerAPI", "DescriptionPlaceholder") ||
              "A short story or overview of this dish..."
            }
            className=" border-black dark:border-white/60"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={4}
          />
        </Field>

        <Field>
          <FieldLabel className="flex items-center gap-2">
            <ImageIcon className="size-4 text-muted-foreground" />
            {L("MealPlannerAPI", "ImageUrl") || "Image URL"}
          </FieldLabel>
          <Input
            className=" border-black dark:border-white/60"
            placeholder="https://images.unsplash.com/photo..."
            value={form.imageUrl}
            onChange={(e) => set("imageUrl", e.target.value)}
          />
        </Field>

        <Field>
          <FieldLabel className="flex items-center gap-2">
            <TagIcon className="size-4 text-muted-foreground" />
            {L("MealPlannerAPI", "Tags") || "Tags"}
          </FieldLabel>
          <div className="flex flex-col bg-transparent gap-3 rounded-lg border  p-3  border-black dark:border-white/60">
            <div className="flex flex-wrap gap-2">
              {form.tags.length === 0 && (
                <p className="text-xs text-muted-foreground italic cursor-default select-none">
                  {L("MealPlannerAPI", "NoTagsAdded") || "No tags added yet"}
                </p>
              )}
              {form.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="gap-1 rounded-full px-3 py-1 text-xs transition-all hover:pr-2"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="rounded-full p-0.5 hover:bg-muted-foreground/20"
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="border border-emerald-600"></div>
            <Input
              placeholder={
                L("MealPlannerAPI", "AddTagPlaceholderHere") ||
                "Add tag, press Enter"
              }
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  commitTag();
                }
              }}
              className="h-9 bg-transparent px-1 focus-visible:ring-0  border-black dark:border-white/60"
            />
          </div>
        </Field>
      </CardContent>
    </Card>
  );
}
