import "@testing-library/jest-dom";
import { createElement } from "react";

import { renderWithProviders } from "../../../shared/utils/test-utils";
import { Enviroment } from "../../../shared/environments/environment";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import CastMembersEdit from "../CastMemberEdit";
import type { CastMember } from "../../../shared/types/castMember";
import { Route, Routes } from "react-router-dom";

const API_URL = Enviroment.API_URL;

const castMember: CastMember = {
  cast_member_id: "1",
  name: "John Doe",
  type: "actor",
  created_at: "2023-01-01T00:00:00Z",
};

describe("CastMemberEdit Page", () => {
  const handlers = [
    http.get(`${API_URL}/cast-member/1`, () => {
      return HttpResponse.json({ data: castMember }, { status: 200 });
    }),
    http.patch(`${API_URL}/cast-member/1`, () => {
      return HttpResponse.json({ data: castMember }, { status: 200 });
    }),
  ];

  const server = setupServer(...handlers);

  function renderEditPage() {
    window.history.replaceState({}, "", "/cast-members/edit/1");
    return renderWithProviders(
      createElement(
        Routes,
        null,
        createElement(Route, {
          path: "/cast-members/edit/:id",
          element: createElement(CastMembersEdit),
        }),
        createElement(Route, { path: "/cast-members", element: null }),
      ),
    );
  }

  beforeAll(() => server.listen({ onUnhandledFrame: "error" }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  test("should render CastMemberEdit Page", () => {
    const { asFragment } = renderEditPage();

    expect(asFragment()).toMatchSnapshot();
  });

  test("should edit CastMember with success", async () => {
    const {
      asFragment,
      getByTestId,
      user,
      findByText,
      getByRole,
      findByRole,
      findByDisplayValue,
    } = renderEditPage();

    expect(asFragment()).toMatchSnapshot();

    await findByText("Editar Membro da Equipe");
    await findByDisplayValue(castMember.name);
    const nameInput = getByTestId("name-input");

    expect(nameInput).toHaveValue(castMember.name);

    const typeSelect = getByRole("combobox", { name: "Tipo" });

    await user.type(nameInput, "John Doe edit");
    await user.click(typeSelect);
    await user.click(await findByRole("option", { name: "Ator" }));
    await user.click(getByTestId("submit-button"));

    expect(
      await findByText("Membro da equipe atualizado com sucesso!"),
    ).toBeInTheDocument();
  });

  test("should not edit CastMember with success", async () => {
    const { asFragment, getByTestId, user, findByText, getByRole, findByRole } =
      renderEditPage();

    expect(asFragment()).toMatchSnapshot();

    server.use(
      http.patch(`${API_URL}/cast-member/1`, () => {
        return HttpResponse.json(null, { status: 400 });
      }),
    );

    const nameInput = getByTestId("name-input");

    await user.type(nameInput, "John Doe");
    const typeSelect = getByRole("combobox", { name: "Tipo" });

    await user.click(typeSelect);
    await user.click(await findByRole("option", { name: "Diretor" }));
    await user.click(getByTestId("submit-button"));

    expect(
      await findByText("Erro ao atualizar membro da equipe!"),
    ).toBeInTheDocument();
  });
});
