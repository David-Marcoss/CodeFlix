import "@testing-library/jest-dom";
import { createElement } from "react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

import GenreCreate from "../GenreCreate";
import { renderWithProviders } from "../../../shared/utils/test-utils";
import { Enviroment } from "../../../shared/environments/environment";
import { categoriesListMock } from "../../../shared/mock/categoriesMock";

const API_URL = Enviroment.API_URL;

describe("GenreCreate", () => {
  const handlers = [
    http.post(`${API_URL}/genres`, () => {
      return HttpResponse.json(null, { status: 201 });
    }),
    http.get(`${API_URL}/categories`, () => {
      return HttpResponse.json(categoriesListMock);
    }),
  ];

  const server = setupServer(...handlers);

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  test("should render genre create page", async () => {
    const { findByText } = renderWithProviders(createElement(GenreCreate));

    expect(await findByText("Criar Gênero")).toBeInTheDocument();
  });

  test("should create a genre with success", async () => {
    const requestBody = jest.fn();
    server.use(
      http.post(`${API_URL}/genres`, async ({ request }) => {
        requestBody(await request.json());
        return HttpResponse.json(null, { status: 201 });
      }),
    );

    const { findByText, getByRole, user, findByRole } = renderWithProviders(
      createElement(GenreCreate),
    );

    await user.type(getByRole("textbox", { name: "Nome" }), "Action");
    await user.click(getByRole("combobox", { name: "Categorias" }));

    for (const category of categoriesListMock.data.slice(0, 2)) {
      const option = await findByRole("option", { name: category.name });
      await user.click(option);
      expect(option).toHaveAttribute("aria-selected", "true");
    }

    await user.keyboard("{Escape}");
    await user.click(getByRole("switch", { name: "Active" }));
    await user.click(getByRole("button", { name: "Salvar" }));

    expect(await findByText("Gênero criada com sucesso!")).toBeInTheDocument();
    expect(requestBody).toHaveBeenCalledTimes(1);
    expect(requestBody).toHaveBeenCalledWith({
      name: "Action",
      categories_id: categoriesListMock.data
        .slice(0, 2)
        .map((category) => category.category_id),
      is_active: true,
    });
  });

  test("should show an error when creating a genre fails", async () => {
    const requestBody = jest.fn();
    server.use(
      http.post(`${API_URL}/genres`, async ({ request }) => {
        requestBody(await request.json());
        return HttpResponse.json(null, { status: 400 });
      }),
    );

    const { findByText, getByRole, user, findByRole } = renderWithProviders(
      createElement(GenreCreate),
    );

    await user.type(getByRole("textbox", { name: "Nome" }), "Action");
    await user.click(getByRole("combobox", { name: "Categorias" }));
    await user.click(
      await findByRole("option", { name: categoriesListMock.data[0].name }),
    );
    await user.keyboard("{Escape}");
    await user.click(getByRole("button", { name: "Salvar" }));

    expect(await findByText("Erro ao criar genero!")).toBeInTheDocument();
    expect(requestBody).toHaveBeenCalledTimes(1);
    expect(requestBody).toHaveBeenCalledWith({
      name: "Action",
      categories_id: [categoriesListMock.data[0].category_id],
      is_active: false,
    });
    expect(getByRole("button", { name: "Salvar" })).toBeEnabled();
    expect(getByRole("textbox", { name: "Nome" })).toHaveValue("Action");
  });
});
