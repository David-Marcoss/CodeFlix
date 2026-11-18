import { ratingValues, type Video, type VideosList } from "../types/videos"
import { castMembersMock } from "./castMembersMock"
import { genresMock } from "./genresMock"

export const videosMock: Video[] = [
  "A última missão",
  "Além do horizonte",
  "O mundo das cores",
  "Um dia diferente",
  "Retratos do Brasil",
  "Caminhos da vida",
  "O reino esquecido",
  "Viagem às estrelas",
  "Encontro inesperado",
  "O segredo da casa",
  "Sombras da noite",
].map((title, index) => {
  const genre = genresMock[index]
  const castMember = castMembersMock[index]
  const ratings = Object.values(ratingValues)

  return {
    id: `b20c30d4-e567-4890-abcd-${String(index + 1).padStart(12, "0")}`,
    title,
    description: `Descrição do vídeo ${title}.`,
    year_launched: 2026 - index,
    duration: 90 + index * 5,
    rating: ratings[index % ratings.length],
    is_opened: index % 2 === 0,
    is_published: index % 3 !== 0,
    banner: null,
    thumbnail: null,
    thumbnail_half: null,
    video: null,
    trailer: null,
    categories_id: [...genre.categories_id],
    categories: [...genre.categories],
    genres_id: [genre.genre_id],
    genres: [genre],
    cast_members_id: [castMember.cast_member_id],
    cast_members: [castMember],
    created_at: new Date(genre.created_at),
  }
})

export const videosListMock: VideosList = {
  data: videosMock,
  meta: {
    current_page: 1,
    per_page: 15,
    last_page: 1,
    total: videosMock.length,
  },
}

export const videosListMockPage2: VideosList = {
  data: videosMock.slice(10),
  meta: {
    current_page: 2,
    per_page: 10,
    last_page: 2,
    total: videosMock.length,
  },
}
