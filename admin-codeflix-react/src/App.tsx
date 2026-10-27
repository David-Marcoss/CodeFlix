import { Box, ThemeProvider } from "@mui/material";
import "./App.css";
import Header from "./components/Header";
import Layout from "./components/Layout";
import AppTheme from "./config/appTheme";
import { BrowserRouter } from "react-router-dom";
import RoutesApp from "./router";

export const App = () => (
  <ThemeProvider theme={AppTheme}>
    <Box sx={{ height: "100vh", width: "100vw" }}>
      <Header />
      <BrowserRouter>
        <Layout>
          <RoutesApp />
        </Layout>
      </BrowserRouter>
    </Box>
  </ThemeProvider>
);
