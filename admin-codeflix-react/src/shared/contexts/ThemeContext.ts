import { createContext } from "react";
import type { Theme } from "@mui/material";

export type ThemeOptions = "light" | "dark";

type ThemeContextValue = {
  theme: ThemeOptions;
  appTheme: Theme;
  onThremeChange: (theme: ThemeOptions) => void;
};

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
