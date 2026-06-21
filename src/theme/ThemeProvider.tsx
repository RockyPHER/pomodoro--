import { useCallback, useEffect, useMemo, useState } from "react";
import { AppTheme, DEFAULT_THEME, THEMES } from "./themes";
import { ThemeContext } from "./context";

const STORAGE_KEY = "pomodoro:theme";

function readStoredTheme(): AppTheme {
  if (typeof window === "undefined") return DEFAULT_THEME;
  const stored = window.localStorage.getItem(STORAGE_KEY) as AppTheme | null;
  const known = THEMES.find((t) => t.id === stored && t.available);
  return known ? known.id : DEFAULT_THEME;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<AppTheme>(readStoredTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = useCallback((next: AppTheme) => setThemeState(next), []);

  const cycleTheme = useCallback(() => {
    const available = THEMES.filter((t) => t.available);
    setThemeState((current) => {
      const idx = available.findIndex((t) => t.id === current);
      return available[(idx + 1) % available.length].id;
    });
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme, cycleTheme }),
    [theme, setTheme, cycleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
