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

export function LocalizationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [locale, setLocale] = useState<AvailableLanguage>(AvailableLanguage.en);
  const [resourceMap, setResourceMap] = useState<ResourceMap>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    abpDefaultApis
      .localization(locale)
      .then((res) => {
        if (cancelled) return;
        const map: ResourceMap = {};
        Object.entries(res.data.resources).forEach(([name, resource]) => {
          map[name] = (resource as { texts: Record<string, string> }).texts;
        });
        setResourceMap(map);
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true; // cleanup if locale changes mid-fetch
    };
  }, [locale]);

  // L("MealPlannerAPI", "MealPlan") → "Meal Plan" (falls back to key)
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
