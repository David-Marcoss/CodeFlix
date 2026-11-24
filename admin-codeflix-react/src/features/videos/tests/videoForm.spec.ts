import { createElement } from "react"
import { fireEvent, waitFor } from "@testing-library/react"
import { renderWithProviders } from "../../../shared/utils/test-utils"
import VideoForm, { type VideoFormProps } from "../components/videoForm"
import { videosMock } from "../../../shared/mock/videosMock"
import { categoriesListMock } from "../../../shared/mock/categoriesMock"
import { castMembersListMock } from "../../../shared/mock/castMembersMock"
import { genresListMock } from "../../../shared/mock/genresMock"
import { formatOptions } from "../utils/formatOptions"
import { createPayload, fillVideoForm } from "./videoTestUtils"

const props: VideoFormProps = {
  categories: formatOptions(categoriesListMock),
  genres: formatOptions(genresListMock),
  castMembers: formatOptions(castMembersListMock),
  isLoading: false,
  handleSubmitForm: jest.fn(),
}

test("submits selected relationships, rating, year and duration in API format", async () => {
  const handleSubmitForm = jest.fn()
  const view = renderWithProviders(
    createElement(VideoForm, { ...props, handleSubmitForm }),
  )
  await fillVideoForm(view)
  await view.user.click(view.getByRole("button", { name: "Salvar" }))
  await waitFor(() => expect(handleSubmitForm).toHaveBeenCalledTimes(1))
  expect(handleSubmitForm.mock.calls[0][0]).toEqual(createPayload)
})

test("rejects empty text and relationship arrays", async () => {
  const view = renderWithProviders(createElement(VideoForm, props))
  await view.user.click(view.getByRole("button", { name: "Salvar" }))
  for (const message of [
    "O campo de título é obrigatório",
    "O campo de descrição é obrigatório",
    "Selecione ao menos uma categoria",
    "Selecione ao menos um gênero",
    "Selecione ao menos um membro do elenco",
  ])
    expect(await view.findByText(message)).toBeInTheDocument()
  expect(props.handleSubmitForm).not.toHaveBeenCalled()
})

test("rejects an invalid year and empty duration", async () => {
  const view = renderWithProviders(
    createElement(VideoForm, { ...props, video: videosMock[0] }),
  )
  await view.user.clear(
    view.getByRole("spinbutton", { name: "Ano de lançamento" }),
  )
  await view.user.type(
    view.getByRole("spinbutton", { name: "Ano de lançamento" }),
    "99",
  )
  fireEvent.change(view.getByLabelText("Duração"), { target: { value: "" } })
  await view.user.click(view.getByRole("button", { name: "Salvar" }))
  expect(
    await view.findByText("Informe um ano de lançamento válido com 4 dígitos"),
  ).toBeInTheDocument()
  expect(
    await view.findByText("Informe uma duração válida (HH:mm)"),
  ).toBeInTheDocument()
  expect(props.handleSubmitForm).not.toHaveBeenCalled()
})

test("disables fields and submission when disabled", () => {
  const view = renderWithProviders(
    createElement(VideoForm, { ...props, isDisabled: true }),
  )
  expect(view.getByRole("textbox", { name: /Título/ })).toBeDisabled()
  expect(view.getByLabelText("Duração")).toBeDisabled()
  expect(view.getByRole("combobox", { name: "Categorias" })).toHaveAttribute(
    "aria-disabled",
    "true",
  )
  expect(view.getByRole("radio", { name: "L" })).toBeDisabled()
  expect(view.getByRole("button", { name: "Salvar" })).toBeDisabled()
})

test("disables submission while loading", () => {
  const view = renderWithProviders(
    createElement(VideoForm, { ...props, isLoading: true }),
  )
  expect(view.getByRole("button", { name: "Loading..." })).toBeDisabled()
})

test("keeps the four selected files in form state and supports removal and reselection", async () => {
  const handleSubmitForm = jest.fn()
  const view = renderWithProviders(
    createElement(VideoForm, { ...props, handleSubmitForm }),
  )
  await fillVideoForm(view)
  const files = {
    video: new File(["video"], "video.mp4", { type: "video/mp4" }),
    trailer: new File(["trailer"], "trailer.mp4", { type: "video/mp4" }),
    thumbnail: new File(["thumbnail"], "thumbnail.jpg", { type: "image/jpeg" }),
    thumbnail_half: new File(["half"], "half.png", { type: "image/png" }),
  }
  for (const [name, label] of [
    ["video", "Vídeo"],
    ["trailer", "Trailer"],
    ["thumbnail", "Thumbnail"],
    ["thumbnail_half", "Thumbnail half"],
  ] as const) {
    await view.user.upload(view.getByLabelText(`Arquivo ${label}`), files[name])
    expect(view.getByRole("textbox", { name: label })).toHaveValue(files[name].name)
  }
  await view.user.click(view.getByRole("button", { name: "Remover Vídeo" }))
  expect(view.getByRole("textbox", { name: "Vídeo" })).toHaveValue("")
  await view.user.upload(view.getByLabelText("Arquivo Vídeo"), files.video)
  await view.user.click(view.getByRole("button", { name: "Remover Trailer" }))
  await view.user.click(view.getByRole("button", { name: "Salvar" }))
  await waitFor(() => expect(handleSubmitForm).toHaveBeenCalledTimes(1))
  expect(handleSubmitForm.mock.calls[0][0]).toEqual({
    ...createPayload,
    ...files,
    trailer: undefined,
  })
})

test("opens uploaded files in another tab and removes them on save", async () => {
  const handleSubmitForm = jest.fn()
  const url = "https://cdn.example.com/banner.png"
  const view = renderWithProviders(createElement(VideoForm, {
    ...props, video: { ...videosMock[0], banner: url }, handleSubmitForm,
  }))
  const link = view.getByRole("link", { name: "Visualizar Banner" })
  expect(link).toHaveAttribute("href", url)
  expect(link).toHaveAttribute("target", "_blank")
  expect(link).toHaveAttribute("rel", "noopener noreferrer")
  await view.user.click(view.getByRole("button", { name: "Excluir Banner enviado" }))
  expect(view.queryByRole("link", { name: "Visualizar Banner" })).not.toBeInTheDocument()
  expect(view.getByText("O arquivo será removido ao salvar.")).toBeInTheDocument()
  await view.user.click(view.getByRole("button", { name: "Salvar" }))
  await waitFor(() => expect(handleSubmitForm).toHaveBeenCalledTimes(1))
  expect(handleSubmitForm.mock.calls[0][0].banner).toBeNull()
})

test("rejects an oversized banner before submitting video metadata", async () => {
  const handleSubmitForm = jest.fn()
  const view = renderWithProviders(createElement(VideoForm, { ...props, video: videosMock[0], handleSubmitForm }))
  const file = new File([new Uint8Array(2 * 1024 * 1024 + 1)], "banner.png", { type: "image/png" })
  await view.user.upload(view.getByLabelText("Arquivo Banner"), file)
  await view.user.click(view.getByRole("button", { name: "Salvar" }))
  expect(await view.findByText("O banner deve ter no máximo 2 MB.")).toBeInTheDocument()
  expect(handleSubmitForm).not.toHaveBeenCalled()
})

test("submits a selected banner at the size limit", async () => {
  const handleSubmitForm = jest.fn()
  const view = renderWithProviders(createElement(VideoForm, { ...props, video: videosMock[0], handleSubmitForm }))
  const file = new File([new Uint8Array(2 * 1024 * 1024)], "banner.png", { type: "image/png" })
  await view.user.upload(view.getByLabelText("Arquivo Banner"), file)
  await view.user.click(view.getByRole("button", { name: "Salvar" }))
  await waitFor(() => expect(handleSubmitForm).toHaveBeenCalledTimes(1))
  expect(handleSubmitForm.mock.calls[0][0].banner).toBe(file)
})
