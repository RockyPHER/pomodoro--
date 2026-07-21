import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_LOCALE, DICTS, Locale } from "./translations";

const STORAGE_KEY = "pomodoro:locale";

type Vars = Record<string, string | number>;

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  /** Translate a key, interpolating `{var}` placeholders from `vars`. */
  t: (key: string, vars?: Vars) => string;
  /** Translate a pluralizable key: looks up `${key}.one` or `${key}.other` based on `count`. */
  tc: (key: string, count: number, vars?: Vars) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function interpolate(str: string, vars?: Vars): string {
  if (!vars) return str;
  return str.replace(/\{(\w+)\}/g, (match, key) =>
    key in vars ? String(vars[key]) : match,
  );
}

function detectLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  const stored = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
  if (stored && stored in DICTS) return stored;
  return navigator.language?.toLowerCase().startsWith("pt") ? "pt" : DEFAULT_LOCALE;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectLocale);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, locale);
  }, [locale]);

  const setLocale = useCallback((next: Locale) => setLocaleState(next), []);

  const t = useCallback(
    (key: string, vars?: Vars) => {
      const raw = DICTS[locale][key] ?? DICTS[DEFAULT_LOCALE][key] ?? key;
      return interpolate(raw, vars);
    },
    [locale],
  );

  const tc = useCallback(
    (key: string, count: number, vars?: Vars) =>
      t(`${key}.${count === 1 ? "one" : "other"}`, { count, ...vars }),
    [t],
  );

  const value = useMemo(() => ({ locale, setLocale, t, tc }), [locale, setLocale, t, tc]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within an I18nProvider");
  return ctx;
}
