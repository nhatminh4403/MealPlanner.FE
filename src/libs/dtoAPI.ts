import { api } from "./axios";

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

export const recipes = {
  getList: (params?: PagedRequest & { filter?: string }) =>
    api.get<PagedResult<Recipe>>("/app/recipes", { params }),

  get: (id: string) => api.get<Recipe>(`/app/recipes/${id}`),

  create: (data: CreateRecipeDto) => api.post<Recipe>("/app/recipes", data),

  update: (id: string, data: UpdateRecipeDto) =>
    api.put<Recipe>(`/app/recipes/${id}`, data),

  delete: (id: string) => api.delete(`/app/recipes/${id}`),
};

// ── Meal Plans ────────────────────────────────────────────────────────────────

export const mealPlans = {
  getMine: () => api.get<MealPlan>("/app/meal-plans/my"),

  addEntry: (data: AddMealPlanEntryDto) =>
    api.post<MealPlan>("/app/meal-plans/entries", data),

  removeEntry: (entryId: string) =>
    api.delete<MealPlan>(`/app/meal-plans/entries/${entryId}`),
};

// ── Shopping Lists ────────────────────────────────────────────────────────────

export const shoppingLists = {
  getList: () => api.get<PagedResult<ShoppingList>>("/app/shopping-lists"),

  get: (id: string) => api.get<ShoppingList>(`/app/shopping-lists/${id}`),

  create: (data: { name: string }) =>
    api.post<ShoppingList>("/app/shopping-lists", data),

  delete: (id: string) => api.delete(`/app/shopping-lists/${id}`),

  addItem: (listId: string, data: AddShoppingItemDto) =>
    api.post<ShoppingList>(`/app/shopping-lists/${listId}/items`, data),

  toggleItem: (listId: string, itemId: string) =>
    api.patch<ShoppingListItem>(
      `/app/shopping-lists/${listId}/items/${itemId}/toggle`
    ),

  removeItem: (listId: string, itemId: string) =>
    api.delete(`/app/shopping-lists/${listId}/items/${itemId}`),
};

// ── Notifications ─────────────────────────────────────────────────────────────

export const notifications = {
  getList: (params?: PagedRequest) =>
    api.get<PagedResult<UserNotification>>("/app/notifications", { params }),

  markRead: (id: string) =>
    api.patch(`/app/notifications/${id}/mark-read`),

  markAllRead: () => api.patch("/app/notifications/mark-all-read"),

  delete: (id: string) => api.delete(`/app/notifications/${id}`),
};

// ── User Profiles ─────────────────────────────────────────────────────────────

export const userProfiles = {
  getMe: () => api.get<UserProfile>("/app/users/me"),

  getUser: (userId: string) => api.get<UserProfile>(`/app/users/${userId}`),

  updateProfile: (data: UpdateProfileInfoDto) =>
    api.patch<UserProfile>("/app/users/me", data),

  updateAvatar: (avatarUrl: string) =>
    api.patch<UserProfile>("/app/users/me/avatar", { avatarUrl }),

  updatePreferences: (data: UpdatePreferencesDto) =>
    api.patch<UserProfile>("/app/users/me/preferences", data),

  changePassword: (data: ChangePasswordDto) =>
    api.patch("/app/users/me/password", data),

  follow: (userId: string) =>
    api.post(`/app/users/${userId}/follow`),

  unfollow: (userId: string) =>
    api.delete(`/app/users/${userId}/follow`),
};

// ── Dashboard ─────────────────────────────────────────────────────────────────

export const dashboard = {
  getStats: () => api.get<DashboardStats>("/app/dashboard/stats"),

  getTrending: () => api.get<Recipe[]>("/app/dashboard/trending"),

  getRecent: () => api.get<Recipe[]>("/app/dashboard/recent"),
};
 
// ── Endpoint functions ────────────────────────────────────────────────────────
 
export const ingredientNutritions = {
  search: (query: string, includeExternal = false) =>
    api.get<IngredientNutritionSearchResultDto>(
      "/app/ingredient-nutritions/search",
      { params: { query, includeExternal } }
    ),
 
  create: (data: CreateIngredientNutritionDto) =>
    api.post<IngredientNutritionDto>("/app/ingredient-nutritions", data),
 
  getList: (params?: { skipCount?: number; maxResultCount?: number }) =>
    api.get<{ items: IngredientNutritionDto[]; totalCount: number }>(
      "/app/ingredient-nutritions",
      { params }
    ),
};
// ── Stub types (replace with generated types or your DTO files) ───────────────
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