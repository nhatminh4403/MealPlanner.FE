import { api } from "./axios";
import { PagedRequest, PagedResult, Recipe, CreateRecipeDto, UpdateRecipeDto, MealPlan, MealPlanEntry, AddMealPlanEntryDto, ShoppingList, ShoppingListItem, AddShoppingItemDto, UserNotification, UserProfile, UpdateProfileInfoDto, UpdatePreferencesDto, ChangePasswordDto, DashboardStats, IngredientNutritionDto, ExternalFoodCandidateDto, IngredientNutritionSearchResultDto, CreateIngredientNutritionDto } from "./interfaceDTO";



export const recipes = {
  getList: (params?: PagedRequest & { filter?: string }) =>
    api.get<PagedResult<Recipe>>("/app/recipe", { params }),

  get: (id: string) => api.get<Recipe>(`/app/recipe/${id}`),

  create: (data: CreateRecipeDto) => api.post<Recipe>("/app/recipe", data),

  update: (id: string, data: UpdateRecipeDto) =>
    api.put<Recipe>(`/app/recipe/${id}`, data),

  delete: (id: string) => api.delete(`/app/recipe/${id}`),
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
  getList: () => api.get<PagedResult<ShoppingList>>("/app/shoppinglist"),

  get: (id: string) => api.get<ShoppingList>(`/app/shoppinglist/${id}`),

  create: (data: { name: string }) =>
    api.post<ShoppingList>("/app/shoppinglist", data),

  delete: (id: string) => api.delete(`/app/shoppinglist/${id}`),

  addItem: (listId: string, data: AddShoppingItemDto) =>
    api.post<ShoppingList>(`/app/shoppinglist/${listId}/items`, data),

  toggleItem: (listId: string, itemId: string) =>
    api.patch<ShoppingListItem>(
      `/app/shoppinglist/${listId}/items/${itemId}/toggle`
    ),

  removeItem: (listId: string, itemId: string) =>
    api.delete(`/app/shoppinglist/${listId}/items/${itemId}`),
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
