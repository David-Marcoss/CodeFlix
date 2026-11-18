import "@testing-library/jest-dom"
import { createElement } from "react"
import { http, HttpResponse } from "msw"
import { setupServer } from "msw/node"

import VideoList from "../VideoList"
import { renderWithProviders } from "../../../shared/utils/test-utils"
import { Enviroment } from "../../../shared/environments/environment"
import {
  videosListMock,
  videosListMockPage2,
} from "../../../shared/mock/videosMock"
import { waitFor } from "@testing-library/react"

const requests = jest.fn()

const API_URL = Enviroment.API_URL

describe("VideoList", () => {
  const handlers = [
    http.get(`${API_URL}/videos`, ({ request }) => {
      const url = new URL(request.url)
      const page = url.searchParams.get("page")
      const search = url.searchParams.get("filter[title]")
      requests(Object.fromEntries(url.searchParams))

      if (search) {
        return HttpResponse.json({
          ...videosListMock,
          data: videosListMock.data.filter(video =>
            video.title.includes(search),
          ),
          meta: { current_page: 1, per_page: 10, last_page: 1, total: 1 },
        })
      }

      if (page === "2") {
        return HttpResponse.json(videosListMockPage2)
      }
      return HttpResponse.json({
        ...videosListMock,
        data: videosListMock.data.slice(0, 10),
        meta: {
          current_page: 1,
          per_page: 10,
          last_page: 2,
          total: videosListMock.data.length,
        },
      })
    }),

    http.delete(`${API_URL}/videos/${videosListMock.data[0].id}`, () => {
      return HttpResponse.json({
        message: "Video removido com sucesso!",
      })
    }),
  ]

  const server = setupServer(...handlers)

  beforeAll(() => server.listen({ onUnhandledFrame: "error" }))
  beforeEach(() => window.history.replaceState({}, "", "/videos"))
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  test("should render video list", async () => {
    const { findByText, getByRole } = renderWithProviders(
      createElement(VideoList),
    )

    expect(getByRole("heading", { name: "Videos" })).toBeInTheDocument()
    expect(await findByText(videosListMock.data[0].title)).toBeInTheDocument()
  })

  test("should render video list for page 2", async () => {
    const { findByText, getByRole, user } = renderWithProviders(
      createElement(VideoList),
    )

    expect(getByRole("heading", { name: "Videos" })).toBeInTheDocument()

    await findByText(videosListMock.data[0].title)
    expect(getByRole("button", { name: "Go to previous page" })).toBeDisabled()
    await user.click(getByRole("button", { name: "Go to next page" }))

    expect(
      await findByText(videosListMockPage2.data[0].title),
    ).toBeInTheDocument()
    expect(requests).toHaveBeenLastCalledWith({
      per_page: "10",
      page: "2",
      "filter[title]": "",
    })
  })

  test("should search a video", async () => {
    const { findByText, getByRole, getByPlaceholderText, queryByText, user } =
      renderWithProviders(createElement(VideoList))

    expect(getByRole("heading", { name: "Videos" })).toBeInTheDocument()

    await findByText(videosListMock.data[0].title)

    const searchInput = getByPlaceholderText("Search…")
    await user.type(searchInput, videosListMock.data[0].title)
    await waitFor(() =>
      expect(requests).toHaveBeenLastCalledWith({
        per_page: "10",
        page: "1",
        "filter[title]": videosListMock.data[0].title,
      }),
    )
    await waitFor(() =>
      expect(queryByText(videosListMock.data[1].title)).not.toBeInTheDocument(),
    )
    expect(await findByText(videosListMock.data[0].title)).toBeInTheDocument()
  })

  test("should delete a video with success", async () => {
    const { findByText, getByRole, getByTestId, user } = renderWithProviders(
      createElement(VideoList),
    )

    expect(getByRole("heading", { name: "Videos" })).toBeInTheDocument()
    expect(await findByText(videosListMock.data[0].title)).toBeInTheDocument()

    const deleteButton = await getByTestId(
      `delete-video-${videosListMock.data[0].id}`,
    )

    await user.click(deleteButton)

    expect(await findByText("Video removido com sucesso!")).toBeInTheDocument()
  })

  test("should not delete a video with success", async () => {
    server.use(
      http.delete(`${API_URL}/videos/${videosListMock.data[0].id}`, () => {
        return HttpResponse.json(
          {
            message: "Erro ao remover video!",
            status: 404,
          },
          { status: 404 },
        )
      }),
    )

    const { findByText, getByRole, getByTestId, user } = renderWithProviders(
      createElement(VideoList),
    )

    expect(getByRole("heading", { name: "Videos" })).toBeInTheDocument()
    expect(await findByText(videosListMock.data[0].title)).toBeInTheDocument()

    const deleteButton = await getByTestId(
      `delete-video-${videosListMock.data[0].id}`,
    )

    await user.click(deleteButton)

    expect(await findByText("Erro ao remover video!")).toBeInTheDocument()
  })
})
