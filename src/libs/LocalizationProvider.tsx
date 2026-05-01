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

const LOCALE_STORAGE_KEY = "preferred_locale";

const VALID_LOCALES = new Set<string>(Object.values(AvailableLanguage));

function getSavedLocale(): AvailableLanguage {
  if (typeof window === "undefined") return AvailableLanguage.en;
  const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
  if (saved && VALID_LOCALES.has(saved)) return saved as AvailableLanguage;
  return AvailableLanguage.en;
}

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
  // Start with "en" for SSR, then sync from localStorage after mount
  const [locale, setLocaleState] = useState<AvailableLanguage>(AvailableLanguage.en);
  const [resourceMap, setResourceMap] = useState<ResourceMap>({});
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate locale from localStorage on first mount
  useEffect(() => {
    const saved = getSavedLocale();
    if (saved !== locale) setLocaleState(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist + apply locale changes
  const setLocale = useCallback((lang: AvailableLanguage) => {
    localStorage.setItem(LOCALE_STORAGE_KEY, lang);
    setLocaleState(lang);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

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
      cancelled = true;
    };
  }, [locale]);

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
