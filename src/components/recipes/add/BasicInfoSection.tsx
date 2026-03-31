"use client";

import React from "react";
import { CreateRecipeDto } from "@/libs/interfaceDTO";
import { useLocalization } from "@/libs/localization";
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
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

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

  return (
    <Card className="border-none shadow-premium dark:shadow-premium-dark">
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
              value={form.cuisine}
              onChange={(e) => set("cuisine", e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>
              {L("MealPlannerAPI", "Difficulty") || "Difficulty"}
            </FieldLabel>
            <NativeSelect
              className="w-full"
              value={form.difficulty}
              onChange={(e) =>
                set("difficulty", Number(e.target.value) as 0 | 1 | 2)
              }
            >
              <NativeSelectOption value={0}>
                {L("MealPlannerAPI", "Easy") || "Easy"}
              </NativeSelectOption>
              <NativeSelectOption value={1}>
                {L("MealPlannerAPI", "Medium") || "Medium"}
              </NativeSelectOption>
              <NativeSelectOption value={2}>
                {L("MealPlannerAPI", "Hard") || "Hard"}
              </NativeSelectOption>
            </NativeSelect>
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field>
            <FieldLabel className="flex items-center gap-2">
              <Clock className="size-4 text-muted-foreground" />
              {L("MealPlannerAPI", "PrepTime") || "Prep Time (min)"}
            </FieldLabel>
            <Input
              type="number"
              min={0}
              value={form.prepTimeMinutes}
              onChange={(e) => set("prepTimeMinutes", Number(e.target.value))}
            />
          </Field>
          <Field>
            <FieldLabel className="flex items-center gap-2">
              <Clock className="size-4 text-muted-foreground" />
              {L("MealPlannerAPI", "CookingTime") || "Cooking Time (min)"}
            </FieldLabel>
            <Input
              type="number"
              min={0}
              value={form.cookingTimeMinutes}
              onChange={(e) =>
                set("cookingTimeMinutes", Number(e.target.value))
              }
            />
          </Field>
          <Field>
            <FieldLabel className="flex items-center gap-2">
              <Users className="size-4 text-muted-foreground" />
              {L("MealPlannerAPI", "Servings") || "Servings"}
            </FieldLabel>
            <Input
              type="number"
              min={1}
              value={form.servings}
              onChange={(e) => set("servings", Number(e.target.value))}
            />
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
          <div className="flex flex-col gap-3 rounded-lg border border-input p-3 bg-muted/20">
            <div className="flex flex-wrap gap-2">
              {form.tags.length === 0 && (
                <p className="text-xs text-muted-foreground italic">
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
            <Input
              placeholder={
                L("MealPlannerAPI", "AddTagPlaceholder") ||
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
              className="h-9 border-none bg-transparent px-1 focus-visible:ring-0"
            />
          </div>
        </Field>
      </CardContent>
    </Card>
  );
}
