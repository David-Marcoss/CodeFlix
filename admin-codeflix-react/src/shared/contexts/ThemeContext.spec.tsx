import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useTheme } from "@mui/material";
import Header from "../../components/Header";
import { useToogleThreme } from "../hooks/useToogleThreme";
import { AppThemeProvider } from "./AppThemeProvider";

function ThemeStatus() {
  const { theme } = useToogleThreme();
  const muiTheme = useTheme();
  return <output aria-label="Tema atual">{theme}/{muiTheme.palette.mode}</output>;
}

function renderTheme() {
  return render(
    <AppThemeProvider>
      <Header />
      <ThemeStatus />
    </AppThemeProvider>,
  );
}

beforeEach(() => window.localStorage.clear());
afterEach(() => window.localStorage.clear());

test("compartilha a alternância do Header e restaura a preferência ao montar novamente", async () => {
  const user = userEvent.setup();
  const view = renderTheme();
  expect(screen.getByLabelText("Tema atual")).toHaveTextContent("dark/dark");

  await user.click(screen.getByRole("button", { name: "Alternar tema" }));
  expect(screen.getByLabelText("Tema atual")).toHaveTextContent("light/light");
  expect(window.localStorage.getItem("CURRENT_THEME")).toBe("light");

  view.unmount();
  renderTheme();
  expect(screen.getByLabelText("Tema atual")).toHaveTextContent("light/light");

  await user.click(screen.getByRole("button", { name: "Alternar tema" }));
  expect(screen.getByLabelText("Tema atual")).toHaveTextContent("dark/dark");
  expect(window.localStorage.getItem("CURRENT_THEME")).toBe("dark");
});

test.each([
  ["ligth", "light"],
  ["invalid", "dark"],
])("normaliza a preferência salva %s para %s", (savedTheme, expectedTheme) => {
  window.localStorage.setItem("CURRENT_THEME", savedTheme);
  renderTheme();
  expect(screen.getByLabelText("Tema atual")).toHaveTextContent(`${expectedTheme}/${expectedTheme}`);
  expect(window.localStorage.getItem("CURRENT_THEME")).toBe(expectedTheme);
});
