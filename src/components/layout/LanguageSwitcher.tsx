"use client";

import { useLocalization } from "@/libs/LocalizationProvider";
import { AvailableLanguage } from "@/libs/enums";
import { Globe, Loader2 } from "lucide-react";

const LANGUAGE_LABELS: Record<AvailableLanguage, string> = {
  [AvailableLanguage.en]: "English",
  [AvailableLanguage.vi]: "Tiếng Việt",
};

export function LanguageSwitcher() {
  const { locale, setLocale, isLoading } = useLocalization();

  return (
    <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <Globe className="h-4 w-4 shrink-0" aria-hidden="true" />
      )}
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as AvailableLanguage)}
        disabled={isLoading}
        aria-label="Select language"
        className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent px-2 py-1 text-sm text-zinc-600 dark:text-zinc-300 transition-colors hover:border-zinc-300 dark:hover:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {Object.values(AvailableLanguage).map((lang) => (
          <option key={lang} value={lang}>
            {LANGUAGE_LABELS[lang]}
          </option>
        ))}
      </select>
    </div>
  );
}
