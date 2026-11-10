import "@testing-library/jest-dom";
import { createElement } from "react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

import CategoriesList from "../GenreList";
import { renderWithProviders } from "../../../shared/utils/test-utils";
import { Enviroment } from "../../../shared/environments/environment";
import {
  categoriesListMock,
  categoriesListMockPage2,
} from "../../../shared/mock/categoriesMock";
import { fireEvent } from "@testing-library/dom";

const API_URL = Enviroment.API_URL;

describe("CategoryList", () => {
  const handlers = [
    http.get(`${API_URL}/categories`, ({ request }) => {
      const url = new URL(request.url);
      const page = url.searchParams.get("page");
      const search = url.searchParams.get("search");

      if (search) {
        return HttpResponse.json({
          ...categoriesListMock,
          data: categoriesListMock.data.filter((category) =>
            category.name.includes(search),
          ),
        });
      }

      if (page === "2") {
        return HttpResponse.json(categoriesListMockPage2);
      }
      return HttpResponse.json(categoriesListMock);
    }),

    http.delete(
      `${API_URL}/categories/${categoriesListMock.data[0].category_id}`,
      () => {
        return HttpResponse.json({
          message: "Categoria removida com sucesso!",
        });
      },
    ),
  ];

  const server = setupServer(...handlers);

  beforeAll(() => server.listen({ onUnhandledFrame: "error" }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  test("should render categoy list", async () => {
    const { findByText, getByRole } = renderWithProviders(
      createElement(CategoriesList),
    );

    expect(getByRole("heading", { name: "Categorias" })).toBeInTheDocument();
    expect(
      await findByText(categoriesListMock.data[0].name),
    ).toBeInTheDocument();
  });

  test("should render category list for page 2", async () => {
    const { findByText, getByRole, getByTestId, user } = renderWithProviders(
      createElement(CategoriesList),
    );

    expect(getByRole("heading", { name: "Categorias" })).toBeInTheDocument();

    await findByText(categoriesListMock.data[0].name);
    expect(getByRole("button", { name: "Go to previous page" })).toBeDisabled();
    await user.click(getByTestId("KeyboardArrowRightIcon"));

    expect(
      await findByText(categoriesListMockPage2.data[0].name),
    ).toBeInTheDocument();
  });

  test("should search a category", async () => {
    const { findByText, getByRole, getByPlaceholderText } = renderWithProviders(
      createElement(CategoriesList),
    );

    expect(getByRole("heading", { name: "Categorias" })).toBeInTheDocument();

    await findByText(categoriesListMock.data[0].name);

    const searchInput = await getByPlaceholderText("Search…");

    await fireEvent.change(searchInput, {
      target: { value: categoriesListMock.data[0].name },
    });

    expect(
      await findByText(categoriesListMock.data[0].name),
    ).toBeInTheDocument();
  });

  test("should delete a category with success", async () => {
    const { findByText, getByRole, getByTestId, user } = renderWithProviders(
      createElement(CategoriesList),
    );

    expect(getByRole("heading", { name: "Categorias" })).toBeInTheDocument();
    expect(
      await findByText(categoriesListMock.data[0].name),
    ).toBeInTheDocument();

    const deleteButton = await getByTestId(
      `delete-category-${categoriesListMock.data[0].category_id}`,
    );

    await user.click(deleteButton);

    expect(
      await findByText("Categoria removida com sucesso!"),
    ).toBeInTheDocument();
  });

  test("should not delete a category with success", async () => {
    const { findByText, getByRole, getByTestId, user } = renderWithProviders(
      createElement(CategoriesList),
    );

    server.use(
      http.delete(
        `${API_URL}/categories/${categoriesListMock.data[0].category_id}`,
        () => {
          return HttpResponse.json(
            {
              message: "Erro ao remover categoria!",
              status: 404,
            },
            { status: 404 },
          );
        },
      ),
    );

    expect(getByRole("heading", { name: "Categorias" })).toBeInTheDocument();
    expect(
      await findByText(categoriesListMock.data[0].name),
    ).toBeInTheDocument();

    const deleteButton = await getByTestId(
      `delete-category-${categoriesListMock.data[0].category_id}`,
    );

    await user.click(deleteButton);

    expect(await findByText("Erro ao remover categoria!")).toBeInTheDocument();
  });
});
