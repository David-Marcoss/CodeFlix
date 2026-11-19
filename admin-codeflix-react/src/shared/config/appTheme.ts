import { createTheme } from "@mui/material";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: { default: "#222222" },
    primary: {
      main: "#F5F5F1",
    },
    secondary: {
      main: "#E50914",
    },
    text: {
      primary: "#F5F5F1",
    },
    success: {
      main: "#4CAF50",
    },
    error: {
      main: "#F44336",
    },
  },
});

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#F5F6F8",
      paper: "#FFFFFF",
    },
    primary: {
      main: "#252A34",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#E50914",
      contrastText: "#FFFFFF",
    },
    text: {
      primary: "#20242C",
      secondary: "#5C6370",
      disabled: "#717784",
    },
    divider: "#DDE1E7",
    success: {
      main: "#2E7D32",
    },
    error: {
      main: "#D32F2F",
    },
    warning: {
      main: "#9A5700",
    },
    info: {
      main: "#0277BD",
    },
  },
});

export default lightTheme;
