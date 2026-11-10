import "@testing-library/jest-dom";
import { createElement } from "react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { Route, Routes } from "react-router-dom";

import CategoriesEdit from "../GenreEdit";
import { renderWithProviders } from "../../../shared/utils/test-utils";
import { Enviroment } from "../../../shared/environments/environment";
import { fireEvent } from "@testing-library/dom";
import type { Category } from "../../../shared/types/category";

const API_URL = Enviroment.API_URL;

const category: Category = {
  category_id: "1",
  name: "John Doe",
  description: "A sample category",
  is_active: true,
  created_at: "2023-01-01T00:00:00Z",
};

describe("CategoriesEdit", () => {
  const handlers = [
    http.get(`${API_URL}/categories/1`, () => {
      return HttpResponse.json({ data: category }, { status: 200 });
    }),
    http.patch(`${API_URL}/categories/1`, () => {
      return HttpResponse.json({ data: category }, { status: 200 });
    }),
  ];

  const server = setupServer(...handlers);

  function renderEditPage() {
    window.history.replaceState({}, "", "/categories/edit/1");
    return renderWithProviders(
      createElement(
        Routes,
        null,
        createElement(Route, {
          path: "/categories/edit/:id",
          element: createElement(CategoriesEdit),
        }),
        createElement(Route, { path: "/categories", element: null }),
      ),
    );
  }

  beforeAll(() => server.listen({ onUnhandledFrame: "error" }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  test("should render category edit page", async () => {
    const { findByText } = renderEditPage();

    expect(await findByText("Editar Categorias")).toBeInTheDocument();
  });

  test("should update a category with success", async () => {
    const { findByText, findByDisplayValue, getByTestId, getByRole, user } =
      renderEditPage();

    expect(await findByText("Editar Categorias")).toBeInTheDocument();

    const nameInput = await findByDisplayValue(category.name);
    const descriptionInput = getByTestId("description-input");
    const isActiveInput = getByRole("switch", { name: "Active" });

    expect(nameInput).toHaveValue(category.name);
    expect(descriptionInput).toHaveValue(category.description);
    expect(isActiveInput).toBeChecked();

    await user.click(isActiveInput);

    fireEvent.change(nameInput, {
      target: { value: "Action update" },
    });

    fireEvent.change(descriptionInput, {
      target: { value: "Action category update" },
    });

    await user.click(getByTestId("submit-button"));
    expect(
      await findByText("Categoria atualizada com sucesso!"),
    ).toBeInTheDocument();
  });

  test("should not update a category with success", async () => {
    server.use(
      http.patch(`${API_URL}/categories/1`, () => {
        return HttpResponse.json(null, { status: 400 });
      }),
    );

    const { findByText, findByDisplayValue, getByTestId, user } =
      renderEditPage();

    expect(await findByText("Editar Categorias")).toBeInTheDocument();

    const nameInput = await findByDisplayValue(category.name);
    const descriptionInput = getByTestId("description-input");

    fireEvent.change(nameInput, {
      target: { value: "Action" },
    });

    fireEvent.change(descriptionInput, {
      target: { value: "Action category" },
    });

    await user.click(getByTestId("submit-button"));
    expect(
      await findByText("Erro ao atualizar categoria!"),
    ).toBeInTheDocument();
  });
});
