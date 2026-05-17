import { PagedRequest } from "./shared";

export interface ShoppingListItem {
  id: string;
  name: string;
  quantity?: string;
  isChecked: boolean;
  category: number;
  unit: string;
}

export interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingListItem[];
  creationTime: string;
}

export interface GetShoppingListsInput extends PagedRequest {
  keyword?: string;
  UserId?: string;
}

export interface AddShoppingItemDto {
  name: string;
  quantity?: string;
  category?: number;
}

export interface IngredientNutritionDto {
  id: string;
  name: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  fiberPer100g: number;
  isVerified: boolean;
}

export interface ExternalFoodCandidateDto {
  name: string;
  brand?: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  fiberPer100g: number;
  completenessScore: number;
  externalId?: string;
  source: string;
}

export interface IngredientNutritionSearchResultDto {
  dbResults: IngredientNutritionDto[];
  externalCandidates: ExternalFoodCandidateDto[];
}

export interface CreateIngredientNutritionDto {
  name: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  fiberPer100g: number;
  sourceExternalId?: string;
}

export type UnitCategory = "weight" | "volume" | "count";

export interface Unit {
  label: string; // display label e.g. "tbsp"
  fullName: string; // e.g. "Tablespoon"
  category: UnitCategory;
  /** Grams per unit for weight; ml per unit for volume; null for count */
  factor: number | null;
}
