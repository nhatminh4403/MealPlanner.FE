import { VisibilityLevel } from "./shared";

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
