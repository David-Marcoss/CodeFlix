import type { RenderOptions } from "@testing-library/react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { PropsWithChildren, ReactElement } from "react";
import { Provider } from "react-redux";
import type { AppStore, RootState } from "../../app/store";
import { makeStore } from "../../app/store";
import { SnackbarProvider } from "notistack";
import { BrowserRouter } from "react-router-dom";

type ExtendedRenderOptions = Omit<RenderOptions, "queries"> & {
  preloadedState?: Partial<RootState>;
  store?: AppStore;
};

export const renderWithProviders = (
  ui: ReactElement,
  extendedRenderOptions: ExtendedRenderOptions = {},
) => {
  const {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = makeStore(preloadedState),
    ...renderOptions
  } = extendedRenderOptions;

  const Wrapper = ({ children }: PropsWithChildren) => (
    <Provider store={store}>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
      />

      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );

  // Return an object with the store and all of RTL's query functions
  return {
    store,
    user: userEvent.setup(),
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
};
