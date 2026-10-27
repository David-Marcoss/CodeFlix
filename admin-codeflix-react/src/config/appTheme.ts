import { createTheme } from "@mui/material";

const AppTheme = createTheme({
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

export default AppTheme;
