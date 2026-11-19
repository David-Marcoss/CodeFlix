import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { ThemeProvider } from "@mui/material";
import { darkTheme, lightTheme } from "../config/appTheme";
import { ThemeContext } from "./ThemeContext";
import type { ThemeOptions } from "./ThemeContext";

const CURRENT_THEME_KEY = "CURRENT_THEME";

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeOptions>(() => {
    const savedTheme = window.localStorage.getItem(CURRENT_THEME_KEY);
    return savedTheme === "light" || savedTheme === "ligth" ? "light" : "dark";
  });

  useEffect(() => {
    window.localStorage.setItem(CURRENT_THEME_KEY, theme);
  }, [theme]);

  const appTheme = theme === "dark" ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, appTheme, onThremeChange: setTheme }}>
      <ThemeProvider theme={appTheme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
}
