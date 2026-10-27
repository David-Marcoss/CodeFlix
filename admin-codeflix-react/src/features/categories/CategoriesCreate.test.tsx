import { screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, Link } from "react-router-dom";
import { renderWithProviders } from "../../utils/test-utils";
import CategoriesCreate from "./CategoriesCreate";

test("creates consecutive categories with unique IDs and returns to the list", async () => {
  const { user, store } = renderWithProviders(
    <MemoryRouter initialEntries={["/categories/create"]}>
      <Routes>
        <Route path="/categories/create" element={<CategoriesCreate />} />
        <Route path="/categories" element={<Link to="/categories/create">Nova categoria</Link>} />
      </Routes>
    </MemoryRouter>,
    { preloadedState: { category: [] } },
  );

  for (const name of ["Documentário", "Animação"]) {
    await user.type(screen.getByLabelText(/Nome/), name);
    await user.type(screen.getByLabelText(/Descrição/), `Descrição de ${name}`);
    await user.click(screen.getByLabelText("Active"));
    await user.click(screen.getByRole("button", { name: "Salvar" }));
    expect(screen.getByRole("link", { name: "Nova categoria" })).toBeInTheDocument();
    if (name === "Documentário") {
      await user.click(screen.getByRole("link", { name: "Nova categoria" }));
    }
  }

  const categories = store.getState().category;
  expect(categories.map(category => category.name)).toEqual(["Documentário", "Animação"]);
  expect(categories.every(category => category.category_id.length > 0 && category.is_active)).toBe(true);
  expect(new Set(categories.map(category => category.category_id)).size).toBe(2);
});
