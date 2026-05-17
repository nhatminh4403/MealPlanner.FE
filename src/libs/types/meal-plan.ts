import { PagedRequest } from "./shared";

export interface GetMealPlansInput extends PagedRequest {
  weekStartDate?: string;
  userId?: string;
}

export interface MealPlanEntry {
  id: string;
  recipeId: string;
  recipeName: string;
  mealType: number;
  scheduledTime?: string;
  mealName: string;
  dayOfWeek: number;
}

export interface MealPlanDay {
  dayOfWeek: number;
  meals: MealPlanEntry[];
}

export interface MealPlan {
  id: string;
  userId: string;
  weekStartDate: string;
  days: MealPlanDay[];
}

export interface AddMealPlanEntryDto {
  recipeId: string;
  mealType: number;
  dayOfWeek: number;
  mealName: string;
}

export interface AutoGenerateMealPlanDto {
  weekStartDate?: string;
  cuisinePreferences?: string[];
  dietaryRestrictions?: string[];
  maxTotalTimeMinutes?: number;
  maxDifficulty?: number;
  mealTypes?: number[];
}
