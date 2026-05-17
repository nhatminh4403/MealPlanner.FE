import { AvailableLanguage } from "../enums";

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

export interface AbpApplicationConfiguration {
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
  setting: {
    values: Record<string, string>;
  };
}
