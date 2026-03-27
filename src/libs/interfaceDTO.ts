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

// ── Recipes ───────────────────────────────────────────────────────────────────

/** DifficultyLevel: 0=Easy, 1=Medium, 2=Hard */
export type DifficultyLevel = 0 | 1 | 2;
export type VisibilityLevel = 0 | 1 | 2; // 0=Private, 1=FriendsOnly, 2=Public
// public class GetMealPlansInput : PagedAndSortedResultRequestDto
// {
//     public DateTime? WeekStartDate { get; set; }
//     public Guid UserId { get; set; }
// }


export interface GetMealPlansInput extends PagedRequest {
  weekStartDate?: string;
  userId?: string;
}

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

export interface RecipeIngredient {
  id: string;
  name: string;
  quantityGrams: number;
  displayQuantity?: string;
  nutrition?: NutritionalInfo;
}

export interface NutritionalInfo {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams: number;
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

export interface MealPlan {
  id: string;
  userId: string;
  weekStartDate: string;
  entries: MealPlanEntry[];
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

export interface AddMealPlanEntryDto {
  recipeId: string;
  mealType: number;
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
  days: MealPlanDay[];   // ← matches backend MealPlanDto.Days
}
/** Input for auto-generating a meal plan based on user preferences */
export interface AutoGenerateMealPlanDto {
  weekStartDate?: string;
  cuisinePreferences?: string[];
  dietaryRestrictions?: string[];
  maxTotalTimeMinutes?: number;
  /** 0 = Easy, 1 = Medium, 2 = Hard */
  maxDifficulty?: number;
  /** Meal type enums: 0=Breakfast, 1=Lunch, 2=Dinner, 3=Snack */
  mealTypes?: number[];
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
  title: string;
  message: string;
  type: string;
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
  source: string; // "USDA"
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
  sourceExternalId?: string; // USDA fdcId
}

// ── User Settings ─────────────────────────────────────────────────────────────

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