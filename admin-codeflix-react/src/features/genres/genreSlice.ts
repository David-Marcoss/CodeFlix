import { apiSlice } from "../api/apiSlice";
import type {
  Genre,
  GenresList,
  CreateGenre,
  GetGenreById,
  UpdateGenre,
} from "../../shared/types/genre";
import type { SearchParams } from "../../shared/types/searchParams";

export function formatSearchParams(params: SearchParams) {
  const { page, perPage, search } = params;
  const searchParams = new URLSearchParams();

  searchParams.append("per_page", perPage?.toString() ?? "10");
  searchParams.append("page", page?.toString() ?? "1");
  searchParams.append("filter[name]", search ?? "");

  return searchParams.toString();
}


const deleteGenreQueryMutation = (genre: { genre_id: string }) => {
  return {
    url: `${route}/${genre.genre_id}`,
    method: "DELETE",
  };
};

const getGenresQuery = (params: SearchParams) => {

  console.log("getGenresQuery", `${route}?${formatSearchParams(params)}`);
  return {
    url: `${route}?${formatSearchParams(params)}`,
    method: "GET",
  };
};

const getGenreByIdQuery = (id: string) => {
  return {
    url: `${route}/${id}`,
    method: "GET",
  };
};

const createGenresQuery = (data: CreateGenre) => {
  return {
    url: route,
    method: "POST",
    body: data,
  };
};

const updateGenresQuery = (data: UpdateGenre) => {
  const { genre_id, ...rest } = data;
  return {
    url: `${route}/${genre_id}`,
    method: "PATCH",
    body: rest,
  };
};

const route = "/genres";

const genreApiSlice = apiSlice.injectEndpoints({
  endpoints: ({ query, mutation }) => ({
    createGenre: mutation<Genre, CreateGenre>({
      query: createGenresQuery,
      invalidatesTags: ["Genres"],
    }),
    updateGenre: mutation<Genre, UpdateGenre>({
      query: updateGenresQuery,
      invalidatesTags: ["Genres"],
    }),
    getGenreById: query<GetGenreById, string>({
      query: getGenreByIdQuery,
      providesTags: ["Genres"],
    }),
    getGenres: query<GenresList, SearchParams>({
      query: getGenresQuery,
      providesTags: ["Genres"],
    }),
    deleteGenre: mutation<void, { genre_id: string }>({
      query: deleteGenreQueryMutation,
      invalidatesTags: ["Genres"],
    }),
  }),
});

export const {
  useGetGenresQuery,
  useDeleteGenreMutation,
  useCreateGenreMutation,
  useGetGenreByIdQuery,
  useUpdateGenreMutation,
} = genreApiSlice;
