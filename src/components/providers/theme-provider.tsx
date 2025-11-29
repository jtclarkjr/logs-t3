"use client";

import { useEffect } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Function to update theme based on system preference
    const updateTheme = (e: MediaQueryList | MediaQueryListEvent) => {
      const root = document.documentElement;
      if (e.matches) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    // Create media query to detect dark mode preference
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    // Set initial theme
    updateTheme(mediaQuery);

    // Listen for changes to system theme
    mediaQuery.addEventListener("change", updateTheme);

    // Cleanup
    return () => mediaQuery.removeEventListener("change", updateTheme);
  }, []);

  return <>{children}</>;
}
