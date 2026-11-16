"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type SiteTheme = "dark" | "light";

type ThemeContextValue = {
  theme: SiteTheme;
  setTheme: (theme: SiteTheme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Public website theme only — never used by admin CRM. */
const STORAGE_KEY = "gocozy-site-theme";
const LEGACY_STORAGE_KEY = "gocozy-theme";

function readSavedTheme(): SiteTheme {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === "light" || saved === "dark") return saved;
  const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY);
  if (legacy === "light" || legacy === "dark") return legacy;
  return "dark";
}

function applyPublicTheme(theme: SiteTheme) {
  const root = document.documentElement;
  root.dataset.siteTheme = theme;
  root.classList.toggle("light", theme === "light");
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;

  const publicRoot = document.querySelector<HTMLElement>("[data-public]");
  if (publicRoot) {
    publicRoot.dataset.siteTheme = theme;
  }
}

function getBootTheme(): SiteTheme {
  if (typeof document === "undefined") return "dark";
  const boot = document.documentElement.dataset.siteTheme;
  if (boot === "light" || boot === "dark") return boot;
  return readSavedTheme();
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<SiteTheme>(getBootTheme);

  useEffect(() => {
    const initial = readSavedTheme();
    setThemeState(initial);
    applyPublicTheme(initial);
  }, []);

  const setTheme = useCallback((next: SiteTheme) => {
    setThemeState(next);
    applyPublicTheme(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [setTheme, theme]);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return {
      theme: "dark" as SiteTheme,
      setTheme: (_theme: SiteTheme) => undefined,
      toggleTheme: () => undefined,
    };
  }
  return ctx;
}
