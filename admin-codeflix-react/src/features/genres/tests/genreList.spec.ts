import "@testing-library/jest-dom";
import { createElement } from "react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

import GenreList from "../GenreList";
import { renderWithProviders } from "../../../shared/utils/test-utils";
import { Enviroment } from "../../../shared/environments/environment";
import {
  genresListMock,
  genresListMockPage2,
} from "../../../shared/mock/genresMock";
import { fireEvent } from "@testing-library/dom";

const API_URL = Enviroment.API_URL;

describe("GenreList", () => {
  const handlers = [
    http.get(`${API_URL}/genres`, ({ request }) => {
      const url = new URL(request.url);
      const page = url.searchParams.get("page");
      const search = url.searchParams.get("search");

      if (search) {
        return HttpResponse.json({
          ...genresListMock,
          data: genresListMock.data.filter((genre) =>
            genre.name.includes(search),
          ),
        });
      }

      if (page === "2") {
        return HttpResponse.json(genresListMockPage2);
      }
      return HttpResponse.json(genresListMock);
    }),

    http.delete(
      `${API_URL}/genres/${genresListMock.data[0].genre_id}`,
      () => {
        return HttpResponse.json({
          message: "Gênero removido com sucesso!",
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
      createElement(GenreList),
    );

    expect(getByRole("heading", { name: "Gêneros" })).toBeInTheDocument();
    expect(
      await findByText(genresListMock.data[0].name),
    ).toBeInTheDocument();
  });

  test("should render genre list for page 2", async () => {
    const { findByText, getByRole, getByTestId, user } = renderWithProviders(
      createElement(GenreList),
    );

    expect(getByRole("heading", { name: "Gêneros" })).toBeInTheDocument();

    await findByText(genresListMock.data[0].name);
    expect(getByRole("button", { name: "Go to previous page" })).toBeDisabled();
    await user.click(getByTestId("KeyboardArrowRightIcon"));

    expect(
      await findByText(genresListMockPage2.data[0].name),
    ).toBeInTheDocument();
  });

  test("should search a genre", async () => {
    const { findByText, getByRole, getByPlaceholderText } = renderWithProviders(
      createElement(GenreList),
    );

    expect(getByRole("heading", { name: "Gêneros" })).toBeInTheDocument();

    await findByText(genresListMock.data[0].name);

    const searchInput = await getByPlaceholderText("Search…");

    await fireEvent.change(searchInput, {
      target: { value: genresListMock.data[0].name },
    });

    expect(
      await findByText(genresListMock.data[0].name),
    ).toBeInTheDocument();
  });

  test("should delete a genre with success", async () => {
    const { findByText, getByRole, getByTestId, user } = renderWithProviders(
      createElement(GenreList),
    );

    expect(getByRole("heading", { name: "Gêneros" })).toBeInTheDocument();
    expect(
      await findByText(genresListMock.data[0].name),
    ).toBeInTheDocument();

    const deleteButton = await getByTestId(
      `delete-genre-${genresListMock.data[0].genre_id}`,
    );

    await user.click(deleteButton);

    expect(
      await findByText("Gênero removido com sucesso!"),
    ).toBeInTheDocument();
  });

  test("should not delete a genre with success", async () => {
    const { findByText, getByRole, getByTestId, user } = renderWithProviders(
      createElement(GenreList),
    );

    server.use(
      http.delete(
        `${API_URL}/genres/${genresListMock.data[0].genre_id}`,
        () => {
          return HttpResponse.json(
            {
              message: "Erro ao remover gênero!",
              status: 404,
            },
            { status: 404 },
          );
        },
      ),
    );

    expect(getByRole("heading", { name: "Gêneros" })).toBeInTheDocument();
    expect(
      await findByText(genresListMock.data[0].name),
    ).toBeInTheDocument();

    const deleteButton = await getByTestId(
      `delete-genre-${genresListMock.data[0].genre_id}`,
    );

    await user.click(deleteButton);

    expect(await findByText("Erro ao remover gênero!")).toBeInTheDocument();
  });
});
