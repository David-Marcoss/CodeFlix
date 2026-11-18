import { createElement } from "react"
import { within } from "@testing-library/react"
import VideoTable, { type VideoTableProps } from "../components/videoTable"
import { renderWithProviders } from "../../../shared/utils/test-utils"
import { videosMock } from "../../../shared/mock/videosMock"

const props: VideoTableProps = {
  data: videosMock.slice(0, 10),
  rowCount: videosMock.length,
  isFetching: false,
  page: 0,
  perPage: 10,
  pageSizeOptions: [5, 10, 20],
  onFilterModelChange: jest.fn(),
  onPaginationModelChange: jest.fn(),
  handleDeleteVideo: jest.fn(),
}

test("renders video title, relationships, rating and publication status", () => {
  const view = renderWithProviders(createElement(VideoTable, props))
  const row = within(
    view.getByText(videosMock[0].title).closest('[role="row"]')!,
  )
  expect(row.getByText(videosMock[0].genres[0].name)).toBeInTheDocument()
  expect(row.getByText(videosMock[0].categories[0].name)).toBeInTheDocument()
  expect(row.getByText(videosMock[0].rating)).toBeInTheDocument()
  expect(row.getByText("Pendente")).toBeInTheDocument()
  expect(view.getAllByText("Publicado").length).toBeGreaterThan(0)
})

test("deletes the selected video", async () => {
  const view = renderWithProviders(createElement(VideoTable, props))
  await view.user.click(view.getByTestId(`delete-video-${videosMock[0].id}`))
  expect(props.handleDeleteVideo).toHaveBeenCalledWith(videosMock[0].id)
})

test("emits zero-based pagination", async () => {
  const view = renderWithProviders(createElement(VideoTable, props))
  await view.user.click(view.getByRole("button", { name: "Go to next page" }))
  expect(props.onPaginationModelChange).toHaveBeenCalledWith(
    { page: 1, pageSize: 10 },
    expect.anything(),
  )
})
