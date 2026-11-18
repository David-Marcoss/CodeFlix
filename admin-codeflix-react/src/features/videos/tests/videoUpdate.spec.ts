import { createElement } from "react"
import { http, HttpResponse, delay } from "msw"
import { setupServer } from "msw/node"
import { Route, Routes } from "react-router-dom"
import { fireEvent } from "@testing-library/react"
import VideoEdit from "../VideoEdit"
import { renderWithProviders } from "../../../shared/utils/test-utils"
import { videosMock } from "../../../shared/mock/videosMock"
import { API_URL, aggregateHandlers } from "./videoTestUtils"

const video = videosMock[0]
const server = setupServer(
  ...aggregateHandlers,
  http.get(`${API_URL}/videos/${video.id}`, async () => {
    await delay(50)
    return HttpResponse.json({ data: video })
  }),
)
beforeAll(() => server.listen({ onUnhandledFrame: "error" }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
function renderEditPage() {
  window.history.replaceState({}, "", `/videos/edit/${video.id}`)
  return renderWithProviders(
    createElement(
      Routes,
      null,
      createElement(Route, {
        path: "/videos/edit/:id",
        element: createElement(VideoEdit),
      }),
      createElement(Route, { path: "/videos", element: null }),
    ),
  )
}

describe("VideoEdit", () => {
  test("loads the video and initializes all form values", async () => {
    const view = renderEditPage()
    expect(
      view.getByRole("heading", { name: "Editar Video" }),
    ).toBeInTheDocument()
    expect(await view.findByDisplayValue(video.title)).toBeInTheDocument()
    expect(view.getByRole("textbox", { name: "Descrição" })).toHaveValue(
      video.description,
    )
    expect(
      view.getByRole("spinbutton", { name: "Ano de lançamento" }),
    ).toHaveValue(video.year_launched)
    expect(view.getByLabelText("Duração")).toHaveValue("01:30")
    expect(view.getByRole("radio", { name: video.rating })).toBeChecked()
    expect(view.getByRole("switch", { name: "Active" })).toBeChecked()
    expect(view.getByRole("switch", { name: "Publicado" })).not.toBeChecked()
  })

  test.each([200, 400])(
    "updates through PATCH and handles status %s",
    async status => {
      const requestBody = jest.fn()
      server.use(
        http.patch(`${API_URL}/videos/${video.id}`, async ({ request }) => {
          requestBody(await request.json())
          return HttpResponse.json({ data: video }, { status })
        }),
      )
      const view = renderEditPage()
      const titleInput = await view.findByDisplayValue(video.title)
      await view.user.clear(titleInput)
      await view.user.type(titleInput, "Título atualizado")
      fireEvent.change(view.getByLabelText("Duração"), {
        target: { value: "02:05" },
      })
      await view.user.click(view.getByRole("switch", { name: "Active" }))
      await view.user.click(view.getByRole("switch", { name: "Publicado" }))
      await view.user.click(view.getByRole("button", { name: "Salvar" }))
      expect(
        await view.findByText(
          status === 200
            ? "Video atualizado com sucesso!"
            : "Erro ao atualizar video!",
        ),
      ).toBeInTheDocument()
      expect(requestBody).toHaveBeenCalledTimes(1)
      expect(requestBody).toHaveBeenCalledWith({
        title: "Título atualizado",
        description: video.description,
        year_launched: video.year_launched,
        duration: 125,
        rating: video.rating,
        is_opened: false,
        is_published: true,
        categories_id: video.categories_id,
        genres_id: video.genres_id,
        cast_members_id: video.cast_members_id,
      })
      if (status === 200) expect(window.location.pathname).toBe("/videos")
      else
        expect(view.getByRole("textbox", { name: /Título/ })).toHaveValue(
          "Título atualizado",
        )
    },
  )
})
