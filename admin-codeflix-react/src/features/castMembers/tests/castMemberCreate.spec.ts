import "@testing-library/jest-dom";
import { createElement } from "react";

import { renderWithProviders } from "../../../shared/utils/test-utils";
import { Enviroment } from "../../../shared/environments/environment";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import CastMembersCreate from "../CastMemberCreate";

const API_URL = Enviroment.API_URL;

describe("CastMemberCreate Page", () => {
  const handlers = [
    http.post(`${API_URL}/cast-member`, () => {
      return HttpResponse.json(null, { status: 201 });
    }),
  ];

  const server = setupServer(...handlers);

  beforeAll(() => server.listen({ onUnhandledFrame: "error" }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  test("should render CastMemberCreate Page", () => {
    const { asFragment } = renderWithProviders(
      createElement(CastMembersCreate),
    );

    expect(asFragment()).toMatchSnapshot();
  });

  test("should create CastMember with success", async () => {
    const { asFragment, getByTestId, user, findByText, getByRole, findByRole } =
      renderWithProviders(createElement(CastMembersCreate));

    expect(asFragment()).toMatchSnapshot();

    const nameInput = getByTestId("name-input");

    await user.type(nameInput, "John Doe");
    const typeSelect = getByRole("combobox", { name: "Tipo" });

    await user.click(typeSelect);
    await user.click(await findByRole("option", { name: "Diretor" }));
    await user.click(getByTestId("submit-button"));

    expect(
      await findByText("Membro da equipe criado com sucesso!"),
    ).toBeInTheDocument();
  });

  test("should not create CastMember with success", async () => {
    const { asFragment, getByTestId, user, findByText, getByRole, findByRole } =
      renderWithProviders(createElement(CastMembersCreate));

    expect(asFragment()).toMatchSnapshot();

    server.use(
      http.post(`${API_URL}/cast-member`, () => {
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
      await findByText("Erro ao criar membro da equipe!"),
    ).toBeInTheDocument();
  });
});
