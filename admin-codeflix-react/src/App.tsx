import { Box, CssBaseline } from "@mui/material";
import "./App.css";
import Header from "./components/Header";
import Layout from "./components/Layout";
import { BrowserRouter } from "react-router-dom";
import RoutesApp from "./router";
import { SnackbarProvider } from "notistack";
import { AppThemeProvider } from "./shared/contexts/AppThemeProvider";

export const App = () => {
  return (
    <AppThemeProvider>
      <CssBaseline />
      <Box sx={{ height: "100vh", width: "100vw" }}>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ horizontal: "right", vertical: "top" }}
        />
        <Header />
        <BrowserRouter>
          <Layout>
            <RoutesApp />
          </Layout>
        </BrowserRouter>
      </Box>
    </AppThemeProvider>
  );
};
