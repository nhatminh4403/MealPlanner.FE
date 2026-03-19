// ── Types (mirror your DTOs) ──────────────────────────────────────────────────

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
}

export interface PagedRequest {
  skipCount?: number;
  maxResultCount?: number;
  sorting?: string;
}

// ── Recipes ───────────────────────────────────────────────────────────────────// ── Stub types (replace with generated types or your DTO files) ───────────────
// These keep the file self-contained during development.

export interface Recipe {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  difficultyLevel: number;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  tags: string[];
  averageRating: number;
  creationTime: string;
}

export interface CreateRecipeDto extends Omit<Recipe, "id" | "averageRating" | "creationTime"> {
  ingredients: { name: string; quantity: string; unit: string }[];
}

export type UpdateRecipeDto = Partial<CreateRecipeDto>;

export interface MealPlan {
  id: string;
  userId: string;
  entries: MealPlanEntry[];
}

export interface MealPlanEntry {
  id: string;
  recipeId: string;
  recipeName: string;
  mealType: number;
  dayOfWeek: number;
}

export interface AddMealPlanEntryDto {
  recipeId: string;
  mealType: number;
  dayOfWeek: number;
}

export interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingListItem[];
  creationTime: string;
}

export interface ShoppingListItem {
  id: string;
  name: string;
  quantity?: string;
  isChecked: boolean;
  category: number;
}

export interface AddShoppingItemDto {
  name: string;
  quantity?: string;
  category?: number;
}

export interface UserNotification {
  id: string;
  message: string;
  type: number;
  isRead: boolean;
  creationTime: string;
}

export interface UserProfile {
  id: string;
  userName: string;
  name?: string;
  surname?: string;
  email: string;
  avatarUrl?: string;
  followersCount: number;
  followingCount: number;
}

export interface UpdateProfileInfoDto {
  userName?: string;
  name?: string;
  surname?: string;
  phoneNumber?: string;
}

export interface UpdatePreferencesDto {
  dietaryRestrictions?: string[];
  cuisinePreferences?: string[];
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface DashboardStats {
  totalRecipes: number;
  totalFollowers: number;
  totalFollowing: number;
  averageRating: number;
}
export interface IngredientNutritionDto {
  id:              string;
  name:            string;
  caloriesPer100g: number;
  proteinPer100g:  number;
  carbsPer100g:    number;
  fatPer100g:      number;
  fiberPer100g:    number;
  isVerified:      boolean;
}
 
export interface ExternalFoodCandidateDto {
  name:              string;
  brand?:            string;
  caloriesPer100g:   number;
  proteinPer100g:    number;
  carbsPer100g:      number;
  fatPer100g:        number;
  fiberPer100g:      number;
  completenessScore: number;
  externalId?:       string;
  source:            string; // "USDA"
}
 
export interface IngredientNutritionSearchResultDto {
  dbResults:          IngredientNutritionDto[];
  externalCandidates: ExternalFoodCandidateDto[];
}
 
export interface CreateIngredientNutritionDto {
  name:              string;
  caloriesPer100g:   number;
  proteinPer100g:    number;
  carbsPer100g:      number;
  fatPer100g:        number;
  fiberPer100g:      number;
  sourceExternalId?: string; // USDA fdcId
}