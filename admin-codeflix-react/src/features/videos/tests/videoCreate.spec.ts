import { createElement } from "react"
import { http, HttpResponse } from "msw"
import { setupServer } from "msw/node"
import VideoCreate from "../VideoCreate"
import { renderWithProviders } from "../../../shared/utils/test-utils"
import {
  API_URL,
  aggregateHandlers,
  createPayload,
  fillVideoForm,
} from "./videoTestUtils"

const server = setupServer(...aggregateHandlers)
beforeAll(() => server.listen({ onUnhandledFrame: "error" }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
beforeEach(() => window.history.replaceState({}, "", "/videos/create"))

describe("VideoCreate", () => {
  test("renders the creation page without edit-only switches", () => {
    const view = renderWithProviders(createElement(VideoCreate))
    expect(
      view.getByRole("heading", { name: "Criar Video" }),
    ).toBeInTheDocument()
    expect(view.queryByRole("switch")).not.toBeInTheDocument()
  })

  test("validates required fields without submitting", async () => {
    const requestBody = jest.fn()
    server.use(http.post(`${API_URL}/videos`, requestBody))
    const view = renderWithProviders(createElement(VideoCreate))
    await view.user.click(view.getByRole("button", { name: "Salvar" }))
    for (const message of [
      "O campo de título é obrigatório",
      "O campo de descrição é obrigatório",
      "Selecione ao menos uma categoria",
      "Selecione ao menos um gênero",
      "Selecione ao menos um membro do elenco",
    ])
      expect(await view.findByText(message)).toBeInTheDocument()
    expect(requestBody).not.toHaveBeenCalled()
  })

  test.each([201, 400])(
    "submits the API payload and handles status %s",
    async status => {
      const requestBody = jest.fn()
      server.use(
        http.post(`${API_URL}/videos`, async ({ request }) => {
          requestBody(await request.json())
          return HttpResponse.json(null, { status })
        }),
      )
      const view = renderWithProviders(createElement(VideoCreate))
      await fillVideoForm(view)
      await view.user.click(view.getByRole("button", { name: "Salvar" }))
      expect(
        await view.findByText(
          status === 201 ? "Video criado com sucesso!" : "Erro ao criar video!",
        ),
      ).toBeInTheDocument()
      expect(requestBody).toHaveBeenCalledTimes(1)
      expect(requestBody).toHaveBeenCalledWith(createPayload)
      if (status === 201) expect(window.location.pathname).toBe("/videos")
      else {
        expect(view.getByRole("button", { name: "Salvar" })).toBeEnabled()
        expect(view.getByRole("textbox", { name: /Título/ })).toHaveValue(
          createPayload.title,
        )
      }
    },
  )
})
