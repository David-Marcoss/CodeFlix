import "@testing-library/jest-dom";
import { createElement } from "react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { Route, Routes } from "react-router-dom";

import GenreEdit from "../GenreEdit";
import { renderWithProviders } from "../../../shared/utils/test-utils";
import { Enviroment } from "../../../shared/environments/environment";
import { fireEvent } from "@testing-library/dom";
import type { Genre } from "../../../shared/types/genre";
import { genresListMock } from "../../../shared/mock/genresMock";
import { categoriesListMock } from "../../../shared/mock/categoriesMock";

const API_URL = Enviroment.API_URL;

const genre: Genre = genresListMock.data[0];

describe("GenreEdit", () => {
  const handlers = [
    http.get(`${API_URL}/genres/1`, () => {
      return HttpResponse.json({ data: genre }, { status: 200 });
    }),
    http.patch(`${API_URL}/genres/1`, () => {
      return HttpResponse.json({ data: genre }, { status: 200 });
    }),
    http.get(`${API_URL}/categories`, () => {
      return HttpResponse.json(categoriesListMock);
    }),
  ];

  const server = setupServer(...handlers);

  function renderEditPage() {
    window.history.replaceState({}, "", "/genres/edit/1");
    return renderWithProviders(
      createElement(
        Routes,
        null,
        createElement(Route, {
          path: "/genres/edit/:id",
          element: createElement(GenreEdit),
        }),
        createElement(Route, { path: "/genres", element: null }),
      ),
    );
  }

  beforeAll(() => server.listen({ onUnhandledFrame: "error" }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  test("should render genre edit page", async () => {
    const { findByText } = renderEditPage();

    expect(await findByText("Editar Gênero")).toBeInTheDocument();
  });

  test("should update a genre with success", async () => {
    const {
      findByText,
      findByDisplayValue,
      getByTestId,
      getByRole,
      findByRole,
      user,
    } = renderEditPage();

    expect(await findByText("Editar Gênero")).toBeInTheDocument();

    const nameInput = await findByDisplayValue(genre.name);
    const isActiveInput = getByRole("switch", { name: "Active" });

    expect(nameInput).toHaveValue(genre.name);
    expect(isActiveInput).toBeChecked();

    await user.click(isActiveInput);

    fireEvent.change(nameInput, {
      target: { value: "Action update" },
    });

    await user.click(getByTestId("submit-button"));
    expect(
      await findByText("Gênero atualizado com sucesso!"),
    ).toBeInTheDocument();
  });

  test("should not update a genre with success", async () => {
    server.use(
      http.patch(`${API_URL}/genres/1`, () => {
        return HttpResponse.json(null, { status: 400 });
      }),
    );

    const { findByText, findByDisplayValue, getByTestId, user } =
      renderEditPage();

    expect(await findByText("Editar Gênero")).toBeInTheDocument();

    const nameInput = await findByDisplayValue(genre.name);

    fireEvent.change(nameInput, {
      target: { value: "Action" },
    });

    await user.click(getByTestId("submit-button"));
    expect(await findByText("Erro ao atualizar gênero!")).toBeInTheDocument();
  });
});
