import { useEffect, useState, useCallback } from "react";
import { Locale, isRTL, translate, LOCALES } from "@/lib/i18n";

const STORAGE_KEY = "cups_locale";
const listeners = new Set<(l: Locale) => void>();
let currentLocale: Locale = (() => {
  if (typeof window === "undefined") return "en";
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === "en" || saved === "ar") return saved;
  return "en";
})();

function applyDir(locale: Locale) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = locale;
  document.documentElement.dir = isRTL(locale) ? "rtl" : "ltr";
}

if (typeof document !== "undefined") {
  applyDir(currentLocale);
}

export function setLocale(locale: Locale) {
  if (locale === currentLocale) return;
  currentLocale = locale;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, locale);
  }
  applyDir(locale);
  listeners.forEach((l) => l(locale));
}

export function getLocale(): Locale {
  return currentLocale;
}

export function useTranslation() {
  const [locale, setLocaleState] = useState<Locale>(currentLocale);

  useEffect(() => {
    const listener = (l: Locale) => setLocaleState(l);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const t = useCallback((key: string) => translate(locale, key), [locale]);

  const switchLocale = useCallback((next: Locale) => setLocale(next), []);

  return { t, locale, setLocale: switchLocale, locales: LOCALES, rtl: isRTL(locale) };
}
