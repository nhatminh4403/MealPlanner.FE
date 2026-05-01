"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { recipes as recipeApi, userProfiles } from "@/libs/api";
import { isAuthenticated } from "@/libs/axios";
import { useLocalization } from "@/libs/LocalizationProvider";
import { toast } from "sonner";

interface RecipeOwnerActionsProps {
  recipeId: string;
  authorId: string;
}

export default function RecipeOwnerActions({
  recipeId,
  authorId,
}: RecipeOwnerActionsProps) {
  const { L } = useLocalization();
  const router = useRouter();
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) return;
    userProfiles
      .getMe()
      .then((res) => {
        if (res.data?.id === authorId) setIsOwner(true);
      })
      .catch(() => {});
  }, [authorId]);

  const handleDelete = async () => {
    if (
      !confirm(
        L("MealPlannerAPI", "DeleteRecipeConfirmation") ||
          "Are you sure you want to delete this recipe?",
      )
    )
      return;
    try {
      await recipeApi.delete(recipeId);
      toast.success(
        L("MealPlannerAPI", "RecipeDeleted") || "Recipe deleted successfully",
      );
      router.push("/recipe");
    } catch {
      toast.error(
        L("MealPlannerAPI", "FailedToDeleteRecipe") ||
          "Failed to delete recipe",
      );
    }
  };

  if (!isOwner) return null;

  return (
    <div className="flex items-center gap-2">
      <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 backdrop-blur-md">
        {L("MealPlannerAPI", "YourRecipe") || "Your Recipe"}
      </Badge>
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push(`/recipe/${recipeId}/edit`)}
        className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400"
      >
        <Pencil className="w-4 h-4" />
        {L("AbpUi", "Edit") || "Edit"}
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={handleDelete}
        className="flex items-center gap-2"
      >
        <Trash2 className="w-4 h-4" />
        {L("AbpUi", "Delete") || "Delete"}
      </Button>
    </div>
  );
}
