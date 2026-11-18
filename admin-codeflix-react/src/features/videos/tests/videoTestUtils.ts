import { http, HttpResponse } from "msw"
import { fireEvent } from "@testing-library/react"
import { Enviroment } from "../../../shared/environments/environment"
import { categoriesListMock } from "../../../shared/mock/categoriesMock"
import { castMembersListMock } from "../../../shared/mock/castMembersMock"
import { genresListMock } from "../../../shared/mock/genresMock"
import type { renderWithProviders } from "../../../shared/utils/test-utils"

export const API_URL = Enviroment.API_URL
export const aggregateHandlers = [
  http.get(`${API_URL}/categories`, () =>
    HttpResponse.json(categoriesListMock),
  ),
  http.get(`${API_URL}/cast-member`, () =>
    HttpResponse.json(castMembersListMock),
  ),
  http.get(`${API_URL}/genres`, () => HttpResponse.json(genresListMock)),
]

export const createPayload = {
  title: "Vídeo de teste",
  description: "Descrição do vídeo de teste",
  year_launched: 2024,
  duration: 90,
  rating: "14",
  is_opened: false,
  is_published: false,
  categories_id: categoriesListMock.data
    .slice(0, 2)
    .map(item => item.category_id),
  genres_id: genresListMock.data.slice(0, 2).map(item => item.genre_id),
  cast_members_id: castMembersListMock.data
    .slice(0, 2)
    .map(item => item.cast_member_id),
}

export async function fillVideoForm(
  view: ReturnType<typeof renderWithProviders>,
) {
  const { user, getByRole, getByLabelText, findByRole } = view
  await user.type(getByRole("textbox", { name: /Título/ }), createPayload.title)
  await user.type(
    getByRole("textbox", { name: "Descrição" }),
    createPayload.description,
  )
  await user.clear(getByRole("spinbutton", { name: "Ano de lançamento" }))
  await user.type(
    getByRole("spinbutton", { name: "Ano de lançamento" }),
    "2024",
  )
  // Native time inputs do not support character-by-character typing in jsdom.
  fireEvent.change(getByLabelText("Duração"), { target: { value: "01:30" } })
  for (const [label, items] of [
    ["Categorias", categoriesListMock.data],
    ["Gêneros", genresListMock.data],
    ["Membros do elenco", castMembersListMock.data],
  ] as const) {
    await user.click(getByRole("combobox", { name: label }))
    for (const item of items.slice(0, 2)) {
      const option = await findByRole("option", { name: item.name })
      await user.click(option)
      expect(option).toHaveAttribute("aria-selected", "true")
    }
    await user.keyboard("{Escape}")
  }
  await user.click(getByRole("radio", { name: "14" }))
}
