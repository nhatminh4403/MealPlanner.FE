import { useLocalization } from "@/libs/LocalizationProvider";
import { AvailableLanguage } from "@/libs/enums";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocalization();
  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4" />
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as AvailableLanguage)}
        className="rounded-lg border px-3 py-1.5 text-sm"
      >
        <option value={AvailableLanguage.en}>English</option>
        <option value={AvailableLanguage.vi}>Tiếng Việt</option>
      </select>
    </div>
  );
}
