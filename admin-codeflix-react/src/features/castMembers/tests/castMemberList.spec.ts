import "@testing-library/jest-dom";
import { createElement } from "react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

import CastMembersList from "../CastMemberList";
import { renderWithProviders } from "../../../shared/utils/test-utils";
import { Enviroment } from "../../../shared/environments/environment";
import {
  castMembersListMock,
  castMembersListMockPage2,
} from "../../../shared/mock/castMembersMock";
import { fireEvent, waitFor } from "@testing-library/dom";

const API_URL = Enviroment.API_URL;

describe("CastMemberList", () => {
  const handlers = [
    http.get(`${API_URL}/cast-member`, ({ request }) => {
      const url = new URL(request.url);
      const page = url.searchParams.get("page");
      const search = url.searchParams.get("filter");

      if (search) {
        return HttpResponse.json({
          ...castMembersListMock,
          data: castMembersListMock.data.filter((castMember) =>
            castMember.name.includes(search),
          ),
        });
      }

      if (page === "2") {
        return HttpResponse.json(castMembersListMockPage2);
      }
      return HttpResponse.json(castMembersListMock);
    }),

    http.delete(
      `${API_URL}/cast-member/${castMembersListMock.data[0].cast_member_id}`,
      () => {
        return HttpResponse.json({
          message: "Membro da equipe removido com sucesso!",
        });
      },
    ),
  ];

  const server = setupServer(...handlers);

  beforeAll(() => server.listen({ onUnhandledFrame: "error" }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  test("should render castMember list", async () => {
    const { findByText, getByRole } = renderWithProviders(
      createElement(CastMembersList),
    );

    expect(getByRole("heading", { name: "Membros do Elenco" })).toBeInTheDocument();
    expect(
      await findByText(castMembersListMock.data[0].name),
    ).toBeInTheDocument();
  });

  test("should render castMember list for page 2", async () => {
    const { findByText, getByRole, user } = renderWithProviders(
      createElement(CastMembersList),
    );

    expect(getByRole("heading", { name: "Membros do Elenco" })).toBeInTheDocument();

    await findByText(castMembersListMock.data[0].name);
    expect(getByRole("button", { name: "Go to previous page" })).toBeDisabled();
    await user.click(getByRole("button", { name: "Go to next page" }));

    expect(
      await findByText(castMembersListMockPage2.data[0].name),
    ).toBeInTheDocument();
  });

  test("should search a castMember", async () => {
    const { findByText, getByRole, getByPlaceholderText, queryByText } = renderWithProviders(
      createElement(CastMembersList),
    );

    expect(getByRole("heading", { name: "Membros do Elenco" })).toBeInTheDocument();

    await findByText(castMembersListMock.data[0].name);

    await findByText(castMembersListMock.data[1].name);

    const searchInput = getByPlaceholderText("Search…");

    fireEvent.change(searchInput, {
      target: { value: castMembersListMock.data[0].name },
    });

    expect(
      await findByText(castMembersListMock.data[0].name),
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(queryByText(castMembersListMock.data[1].name)).not.toBeInTheDocument();
    });
  });

  test("should delete a castMember with success", async () => {
    const { findByText, getByRole, getByTestId, user } = renderWithProviders(
      createElement(CastMembersList),
    );

    expect(getByRole("heading", { name: "Membros do Elenco" })).toBeInTheDocument();
    expect(
      await findByText(castMembersListMock.data[0].name),
    ).toBeInTheDocument();

    const deleteButton = getByTestId(
      `delete-button-${castMembersListMock.data[0].cast_member_id}`,
    );

    await user.click(deleteButton);

    expect(
      await findByText("Membro da equipe removido com sucesso!"),
    ).toBeInTheDocument();
  });

  test("should not delete a castMember with success", async () => {
    const { findByText, getByRole, getByTestId, user } = renderWithProviders(
      createElement(CastMembersList),
    );

    server.use(
      http.delete(
        `${API_URL}/cast-member/${castMembersListMock.data[0].cast_member_id}`,
        () => {
          return HttpResponse.json(
            {
              message: "Erro ao remover membro da equipe!",
              status: 404,
            },
            { status: 404 },
          );
        },
      ),
    );

    expect(getByRole("heading", { name: "Membros do Elenco" })).toBeInTheDocument();
    expect(
      await findByText(castMembersListMock.data[0].name),
    ).toBeInTheDocument();

    const deleteButton = getByTestId(
      `delete-button-${castMembersListMock.data[0].cast_member_id}`,
    );

    await user.click(deleteButton);

    expect(await findByText("Erro ao remover membro da equipe!")).toBeInTheDocument();
  });
});
