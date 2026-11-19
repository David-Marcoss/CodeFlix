import "./App.css";
import Layout from "./components/Layout";
import { BrowserRouter } from "react-router-dom";
import RoutesApp from "./router";
import { SnackbarProvider } from "notistack";

export const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ horizontal: "right", vertical: "top" }}
        />
        <RoutesApp />
      </Layout>
    </BrowserRouter>
  );
};
