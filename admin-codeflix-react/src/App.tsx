import "./App.css";
import Layout from "./components/Layout";
import { BrowserRouter } from "react-router-dom";
import RoutesApp from "./router";
import { SnackbarProvider } from "notistack";
import { UploadList } from "./features/uploads/UploadList";
import { KeycloakProvider } from "./shared/auth/keycloakProvider";

export const App = () => {
  return (
    <KeycloakProvider>
      <BrowserRouter>
        <Layout>
          <SnackbarProvider
            maxSnack={3}
            anchorOrigin={{ horizontal: "right", vertical: "top" }}
          />
          <RoutesApp />

          <UploadList />
        </Layout>
      </BrowserRouter>
    </KeycloakProvider>
  );
};
