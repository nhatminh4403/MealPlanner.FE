// ── Imports ───────────────────────────────────────────────────────────────────

import { AvailableLanguage } from "./enums";

// ── Base / Shared Types ───────────────────────────────────────────────────────

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
}

export interface PagedRequest {
  skipCount?: number;
  maxResultCount?: number;
  sorting?: string;
}

export type DifficultyLevel = 0 | 1 | 2; // 0=Easy, 1=Medium, 2=Hard
export type VisibilityLevel = 0 | 1 | 2; // 0=Private, 1=FriendsOnly, 2=Public

// ── Recipes ───────────────────────────────────────────────────────────────────

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

// ── Meal Plans ────────────────────────────────────────────────────────────────

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

// ── Shopping List ─────────────────────────────────────────────────────────────

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

export interface AddShoppingItemDto {
  name: string;
  quantity?: string;
  category?: number;
}

// ── Nutrition ─────────────────────────────────────────────────────────────────

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

// ── User ──────────────────────────────────────────────────────────────────────

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

// ── Notifications ─────────────────────────────────────────────────────────────

export interface UserNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  creationTime: string;
}

// ── Settings ──────────────────────────────────────────────────────────────────

export interface UserPrivacy {
  profileVisibility: VisibilityLevel;
  recipesVisibility: VisibilityLevel;
  shoppingListVisibility: VisibilityLevel;
}

export interface UserNotificationPreferences {
  mealReminders: boolean;
  recipeUpdates: boolean;
  communityActivity: boolean;
  shoppingListAlerts: boolean;
}

export interface UserSettings {
  privacy: UserPrivacy;
  notifications: UserNotificationPreferences;
}

export interface CreateUpdateUserSettingsDto {
  privacy: UserPrivacy;
  notifications: UserNotificationPreferences;
}

// ── Localization & Configuration ──────────────────────────────────────────────

export interface ApplicationLocalization {
  cultureName: AvailableLanguage;
  onlyDynamics?: boolean;
}

export interface ApplicationLocalizationResponse {
  resources: Record<string, { texts: Record<string, string> }>;
}

export interface ApplicationConfigurationResponse {
  currentUser: {
    id: string | null;
    userName: string | null;
    isAuthenticated: boolean;
  };
  auth: {
    grantedPolicies: Record<string, boolean>;
  };
  localization: {
    currentCulture: { name: string; displayName: string };
    languages: { cultureName: string; displayName: string }[];
    values?: Record<string, Record<string, string>>;
  };
}
export type UnitCategory = "weight" | "volume" | "count";
export interface CreateRecipeIngredientDto {
  name: string;
  quantity: number;
  unit: string;
  nutritionId?: string;
}

export interface Unit {
  label: string; // display label e.g. "tbsp"
  fullName: string; // e.g. "Tablespoon"
  category: UnitCategory;
  /** Grams per unit for weight; ml per unit for volume; null for count */
  factor: number | null;
}

export  interface AbpApplicationConfiguration  {
  localization: {
   values: Record<string, Record<string, string>>;
  };
  auth: {
    grantedPolicies: Record<string, boolean>;
  };
  currentUser: {
    id: string | null;
    userName: string | null;
    isAuthenticated: boolean;
  };
  setting:{
    values: Record<string, string>;
  };
}