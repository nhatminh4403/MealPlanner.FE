"use client";

import type React from "react";
import {
  createContext,
  useContext,
  startTransition,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const applyTheme = (newTheme: Theme) => {
  const root = document.documentElement;
  if (newTheme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  localStorage.setItem("theme", newTheme);
};

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem("theme") as Theme | null;
  if (stored) return stored;
  return "light";
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Always use "light" for initial SSR + first client render to avoid hydration mismatch.
  // Real theme is applied by the inline script in layout.tsx and synced here after mount.
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const initial = getInitialTheme();
    startTransition(() => {
      setTheme(initial);
    });
    applyTheme(initial);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    // flushSync forces React to commit the state update synchronously,
    // so both the DOM class mutation and React re-render happen in the
    // same browser paint frame — no more staggered header/body flash.
    flushSync(() => {
      setTheme(newTheme);
    });
    applyTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: "light" as const,
      toggleTheme: () => {},
    };
  }
  return context;
}
