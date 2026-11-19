import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

export type { ThemeOptions } from "../contexts/ThemeContext";

export function useToogleThreme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useToogleThreme deve ser usado dentro de AppThemeProvider.");
  }

  return context;
}
