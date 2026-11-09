import "@testing-library/jest-dom";
import { createElement } from "react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

import CategoriesCreate from "../CategoriesCreate";
import { renderWithProviders } from "../../../shared/utils/test-utils";
import { Enviroment } from "../../../shared/environments/environment";
import { fireEvent } from "@testing-library/dom";

const API_URL = Enviroment.API_URL;

describe("CategoryCreate", () => {
  const handlers = [
    http.post(`${API_URL}/categories`, () => {
      return HttpResponse.json(null, { status: 201 });
    }),
  ];

  const server = setupServer(...handlers);

  beforeAll(() => server.listen({ onUnhandledFrame: "error" }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  test("should render categoy create  page", async () => {
    const { findByText } = renderWithProviders(createElement(CategoriesCreate));

    expect(await findByText("Criar Categoria")).toBeInTheDocument();
  });

  test("should create a category with success", async () => {
    const { findByText, getByTestId, user } = renderWithProviders(
      createElement(CategoriesCreate),
    );

    expect(await findByText("Criar Categoria")).toBeInTheDocument();

    const nameInput = await getByTestId("name-input");
    const descriptionInput = await getByTestId("description-input");
    const isActiveInput = await getByTestId("is_active");

    user.click(isActiveInput);

    await fireEvent.change(nameInput, {
      target: { value: "Action" },
    });

    await fireEvent.change(descriptionInput, {
      target: { value: "Action category" },
    });

    await user.click(await getByTestId("submit-button"));
    expect(
      await findByText("Categoria criada com sucesso!"),
    ).toBeInTheDocument();
  });

  test("should not create a category with success", async () => {
    server.use(
      http.post(`${API_URL}/categories`, () => {
        return HttpResponse.json(null, { status: 400 });
      }),
    );

    const { findByText, getByTestId, user } = renderWithProviders(
      createElement(CategoriesCreate),
    );

    expect(await findByText("Criar Categoria")).toBeInTheDocument();

    const nameInput = await getByTestId("name-input");
    const descriptionInput = await getByTestId("description-input");

    await fireEvent.change(nameInput, {
      target: { value: "Action" },
    });

    await fireEvent.change(descriptionInput, {
      target: { value: "Action category" },
    });

    await user.click(await getByTestId("submit-button"));
    expect(
      await findByText("Erro ao criar categoria!"),
    ).toBeInTheDocument();
  });
});
