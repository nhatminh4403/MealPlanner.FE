import { api } from "./axios";
import { PagedRequest, PagedResult, Recipe, RecipeSummary, TrendingRecipe, CreateRecipeDto, UpdateRecipeDto, MealPlan, AddMealPlanEntryDto, ShoppingList, ShoppingListItem, AddShoppingItemDto, UserNotification, UserProfile, UpdateProfileInfoDto, UpdatePreferencesDto, ChangePasswordDto, DashboardStats, IngredientNutritionDto, ExternalFoodCandidateDto, IngredientNutritionSearchResultDto, CreateIngredientNutritionDto } from "./interfaceDTO";

export const recipes = {
  getList: (params?: PagedRequest & { searchTerm?: string; cuisine?: string; difficulty?: number; maxTotalTimeMinutes?: number; vegetarian?: boolean; sorting?: string }) =>
    api.get<PagedResult<RecipeSummary>>("/app/recipe", { params }),

  get: (id: string) => api.get<Recipe>(`/app/recipe/${id}`),

  getTopRated: (count = 10) =>
    api.get<{ items: RecipeSummary[] }>(`/app/recipe/top-rated`, { params: { count } }),

  getByAuthor: (authorId: string) =>
    api.get<{ items: RecipeSummary[] }>(`/app/recipe/by-author/${authorId}`),

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
    api.get<PagedResult<UserNotification>>("/app/notification", { params }),

  markRead: (id: string) =>
    api.patch(`/app/notification/${id}/mark-read`),

  markAllRead: () => api.patch("/app/notification/mark-all-read"),

  delete: (id: string) => api.delete(`/app/notification/${id}`),
};

// ── User Profiles ─────────────────────────────────────────────────────────────

export const userProfiles = {
  getMe: () => api.get<UserProfile>("/app/user/me"),

  getUser: (userId: string) => api.get<UserProfile>(`/app/user/${userId}`),

  updateProfile: (data: UpdateProfileInfoDto) =>
    api.patch<UserProfile>("/app/user/me", data),

  updateAvatar: (avatarUrl: string) =>
    api.patch<UserProfile>("/app/user/me/avatar", { avatarUrl }),

  updatePreferences: (data: UpdatePreferencesDto) =>
    api.patch<UserProfile>("/app/user/me/preferences", data),

  changePassword: (data: ChangePasswordDto) =>
    api.patch("/app/user/me/password", data),

  follow: (userId: string) =>
    api.post(`/app/user/${userId}/follow`),

  unfollow: (userId: string) =>
    api.delete(`/app/user/${userId}/follow`),
};

// ── Dashboard ─────────────────────────────────────────────────────────────────

export const dashboard = {
  getStats: () => api.get<DashboardStats>("/app/dashboard/stats"),

  getTrending: () =>
    api.get<{ items: TrendingRecipe[] }>("/app/dashboard/trending"),
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
