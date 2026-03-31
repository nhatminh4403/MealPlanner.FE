import { getApiInstance } from "./axios";
import { AvailableLanguage } from "./enums";

const http = () => getApiInstance();

import {
  PagedRequest,
  PagedResult,
  Recipe,
  RecipeSummary,
  TrendingRecipe,
  CreateRecipeDto,
  UpdateRecipeDto,
  MealPlan,
  AddMealPlanEntryDto,
  AutoGenerateMealPlanDto,
  ShoppingList,
  ShoppingListItem,
  AddShoppingItemDto,
  UserNotification,
  UserProfile,
  UpdateProfileInfoDto,
  UpdatePreferencesDto,
  ChangePasswordDto,
  DashboardStats,
  IngredientNutritionDto,
  IngredientNutritionSearchResultDto,
  CreateIngredientNutritionDto,
  UserSettings,
  CreateUpdateUserSettingsDto,
  GetMealPlansInput,
  ApplicationLocalizationResponse,
  ApplicationConfigurationResponse,
} from "./interfaceDTO";

export const abpDefaultApis = {
  localization: (cultureName: AvailableLanguage) =>
    http().get<ApplicationLocalizationResponse>(
      "/abp/application-localization",
      { params: { cultureName } },
    ),

  configuration: (includeLocalizationResources = false) =>
    http().get<ApplicationConfigurationResponse>(
      "/abp/application-configuration",
      {
        params: { IncludeLocalizationResources: includeLocalizationResources },
      },
    ),
};

export const recipes = {
  getList: (
    params?: PagedRequest & {
      searchTerm?: string;
      cuisine?: string;
      difficulty?: number;
      maxTotalTimeMinutes?: number;
      vegetarian?: boolean;
      sorting?: string;
    },
  ) => http().get<PagedResult<RecipeSummary>>("/app/recipe", { params }),

  get: (id: string) => http().get<Recipe>(`/app/recipe/${id}`),

  getTopRated: (count = 10) =>
    http().get<{ items: RecipeSummary[] }>(`/app/recipe/top-rated`, {
      params: { count },
    }),

  getByAuthor: (authorId: string) =>
    http().get<{ items: RecipeSummary[] }>(`/app/recipe/by-author/${authorId}`),

  create: (data: CreateRecipeDto) => http().post<Recipe>("/app/recipe", data),

  update: (id: string, data: UpdateRecipeDto) =>
    http().put<Recipe>(`/app/recipe/${id}`, data),

  delete: (id: string) => http().delete(`/app/recipe/${id}`),
};

// ── Meal Plans ────────────────────────────────────────────────────────────────

export const mealPlans = {
  getMine: () => http().get<MealPlan>("/app/meal-plans"),

  getListByUserId: (params?: GetMealPlansInput) =>
    http().get<PagedResult<MealPlan>>("/app/meal-plans", { params }),

  addEntry: (mealPlanId: string, data: AddMealPlanEntryDto) =>
    http().put<MealPlan>(`/app/meal-plans/${mealPlanId}/entries`, data),

  removeEntry: (entryId: string, mealPlanId: string) =>
    http().delete<MealPlan>(`/app/meal-plans/${mealPlanId}/entries/${entryId}`),

  autoGenerate: (data?: AutoGenerateMealPlanDto) =>
    http().post<MealPlan>("/app/meal-plans/auto-generate", data ?? {}),
};

// ── Shopping Lists ────────────────────────────────────────────────────────────

export const shoppingLists = {
  getList: () => http().get<PagedResult<ShoppingList>>("/app/shopping-lists"),

  get: (id: string) => http().get<ShoppingList>(`/app/shopping-lists/${id}`),

  create: (data: { name: string }) =>
    http().post<ShoppingList>("/app/shopping-lists", data),

  delete: (id: string) => http().delete(`/app/shopping-lists/${id}`),

  addItem: (listId: string, data: AddShoppingItemDto) =>
    http().post<ShoppingList>(`/app/shopping-lists/${listId}/items`, data),

  toggleItem: (listId: string, itemId: string) =>
    http().patch<ShoppingListItem>(
      `/app/shopping-lists/${listId}/items/${itemId}/toggle`,
    ),

  removeItem: (listId: string, itemId: string) =>
    http().delete(`/app/shopping-lists/${listId}/items/${itemId}`),
};

// ── Notifications ─────────────────────────────────────────────────────────────

export const notifications = {
  getList: (params?: PagedRequest) =>
    http().get<PagedResult<UserNotification>>("/app/notification", { params }),

  // getUnreadNotificationCount: () =>
  //   api.get<number>("/app/notification/unread-count"),

  markRead: (id: string) => http().patch(`/app/notification/${id}/read`),

  markUnread: (id: string) => http().patch(`/app/notification/${id}/unread`),

  markAllRead: () => http().patch("/app/notification/read-all"),

  delete: (id: string) => http().delete(`/app/notification/${id}`),
};

// ── User Profiles ─────────────────────────────────────────────────────────────

export const userProfiles = {
  getMe: (config?: { signal?: AbortSignal }) =>
    http().get<UserProfile>("/app/user/me", config),

  getUser: (userId: string) => http().get<UserProfile>(`/app/user/${userId}`),

  updateProfile: (data: UpdateProfileInfoDto) =>
    http().patch<UserProfile>("/app/user/me", data),

  updateAvatar: (avatarUrl: string) =>
    http().patch<UserProfile>("/app/user/me/avatar", { avatarUrl }),

  updatePreferences: (data: UpdatePreferencesDto) =>
    http().patch<UserProfile>("/app/user/me/preferences", data),

  changePassword: (data: ChangePasswordDto) =>
    http().patch("/app/user/me/password", data),

  follow: (userId: string) => http().post(`/app/user/${userId}/follow`),

  unfollow: (userId: string) => http().delete(`/app/user/${userId}/follow`),
};

// ── Dashboard ─────────────────────────────────────────────────────────────────

export const dashboard = {
  getStats: () => http().get<DashboardStats>("/app/dashboard/stats"),

  getTrending: () =>
    http().get<{ items: TrendingRecipe[] }>("/app/dashboard/trending"),
};

// ── Endpoint functions ────────────────────────────────────────────────────────

export const ingredientNutritions = {
  search: (query: string, includeExternal = false) =>
    http().get<IngredientNutritionSearchResultDto>(
      "/app/ingredient-nutritions/search",
      { params: { query, includeExternal } },
    ),

  create: (data: CreateIngredientNutritionDto) =>
    http().post<IngredientNutritionDto>("/app/ingredient-nutritions", data),

  getList: (params?: { skipCount?: number; maxResultCount?: number }) =>
    http().get<{ items: IngredientNutritionDto[]; totalCount: number }>(
      "/app/ingredient-nutritions",
      { params },
    ),
};

// ── User Settings ─────────────────────────────────────────────────────────────

export const userSettings = {
  get: () => http().get<UserSettings>("/app/user/settings"),
  update: (data: CreateUpdateUserSettingsDto) =>
    http().put<UserSettings>("/app/user/settings", data),
};

// ── Docker Services ───────────────────────────────────────────────────────────

// Example of how to add specific docker API endpoints:
// export const dockerServices = {
//   getDockerData: () => dockerApi.get("/some/docker-only-endpoint"),
// };
