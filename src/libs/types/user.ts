export interface UserStats {
  recipesCreated: number;
  recipesLiked: number;
  mealsPlanned: number;
  shoppingListsGenerated: number;
  followers: number;
  following: number;
  specialty?: string;
}

export interface UserProfile {
  id: string;
  userName: string;
  name?: string;
  surname?: string;
  email: string;
  avatarUrl?: string;
  stats: UserStats;
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
