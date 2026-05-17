import { DifficultyLevel } from "./shared";

export interface RecipeSummary {
  id: string;
  name: string;
  cuisine: string;
  difficulty: DifficultyLevel;
  totalTimeMinutes: number;
  servings: number;
  rating: number;
  reviewCount: number;
  imageUrl?: string;
  description: string;
  tags: string[];
}

export interface TrendingRecipe {
  id: string;
  name: string;
  imageUrl?: string;
  rating: number;
  reviewCount: number;
  trendingScore: number;
  trendingSince: string;
}

export interface RecipeAuthor {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface NutritionalInfo {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams: number;
}

export interface RecipeIngredient {
  id: string;
  name: string;
  quantityGrams: number;
  displayQuantity?: string;
  nutrition?: NutritionalInfo;
}

export interface Recipe extends RecipeSummary {
  cookingTimeMinutes: number;
  prepTimeMinutes: number;
  instructions: string[];
  author: RecipeAuthor;
  ingredients: RecipeIngredient[];
  nutritionPerServing?: NutritionalInfo;
}

export interface CreateRecipeDto {
  name: string;
  cuisine: string;
  difficulty: DifficultyLevel;
  cookingTimeMinutes: number;
  prepTimeMinutes: number;
  servings: number;
  description: string;
  imageUrl?: string;
  tags: string[];
  instructions: string[];
  ingredients: { name: string; quantity: number; unit: string }[];
}

export type UpdateRecipeDto = Partial<CreateRecipeDto>;

export interface CreateRecipeIngredientDto {
  name: string;
  quantity: number;
  unit: string;
  nutritionId?: string;
}
