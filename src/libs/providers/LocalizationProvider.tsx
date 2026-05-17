"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { abpDefaultApis } from "@/libs/api";
import { AvailableLanguage } from "@/libs/enums";
import { ApplicationLocalizationResponse } from "../types";

const LOCALE_STORAGE_KEY = "preferred_locale";
type ResourceMap = Record<string, Record<string, string>>;

interface LocalizationContextValue {
  L: (resourceName: string, key: string) => string;
  locale: AvailableLanguage;
  setLocale: (lang: AvailableLanguage) => void;
  isLoading: boolean;
}

const LocalizationContext = createContext<LocalizationContextValue>({
  L: (_, key) => key,
  locale: AvailableLanguage.en,
  setLocale: () => {},
  isLoading: true,
});

interface LocalizationProviderProps {
  children: React.ReactNode;
  initialData?: ApplicationLocalizationResponse | null;
  initialLocale?: AvailableLanguage;
}

function buildResourceMap(data: ApplicationLocalizationResponse): ResourceMap {
  const map: ResourceMap = {};
  Object.entries(data.resources).forEach(([name, resource]) => {
    map[name] = (resource as { texts: Record<string, string> }).texts;
  });
  return map;
}

export function LocalizationProvider({
  children,
  initialData,
  initialLocale,
}: LocalizationProviderProps) {
  const [locale, setLocaleState] = useState<AvailableLanguage>(
    initialLocale ?? AvailableLanguage.en,
  );
  const [resourceMap, setResourceMap] = useState<ResourceMap>(() =>
    initialData ? buildResourceMap(initialData) : {},
  );
  // Tracks which locale is in-flight; null = idle
  const [fetchingLocale, setFetchingLocale] = useState<AvailableLanguage | null>(
    initialData ? null : (initialLocale ?? AvailableLanguage.en),
  );

  const isLoading = fetchingLocale !== null;

  const setLocale = useCallback((lang: AvailableLanguage) => {
    localStorage.setItem(LOCALE_STORAGE_KEY, lang);
    document.cookie = `preferred_locale=${lang}; path=/; max-age=31536000; SameSite=Lax`;
    setLocaleState(lang);
    
    if (lang === initialLocale && initialData) {
      // Avoid triggering the fetch effect entirely, and restore original data
      setResourceMap(buildResourceMap(initialData));
      setFetchingLocale(null);
    } else {
      setFetchingLocale(lang);
    }
  }, [initialLocale, initialData]);

  useEffect(() => {
    if (fetchingLocale === null) return;

    let cancelled = false;

    abpDefaultApis
      .localization(fetchingLocale)
      .then((res) => {
        if (cancelled) return;
        setResourceMap(buildResourceMap(res.data));
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setFetchingLocale(null);
      });

    return () => {
      cancelled = true;
    };
  }, [fetchingLocale, initialLocale, initialData]);

  const L = useCallback(
    (resourceName: string, key: string) =>
      resourceMap[resourceName]?.[key] ?? key,
    [resourceMap],
  );

  return (
    <LocalizationContext.Provider value={{ L, locale, setLocale, isLoading }}>
      {children}
    </LocalizationContext.Provider>
  );
}

export const useLocalization = () => useContext(LocalizationContext);