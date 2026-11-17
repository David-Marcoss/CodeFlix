import { useGetCastMembersQuery } from "../../castMembers/castMemberSlice";
import { useGetCategoriesQuery } from "../../categories/categorySlice";
import { useGetGenresQuery } from "../../genres/genreSlice";
import { formatOptions } from "../utils/formatOptions";

export function useGetvideosAgregatesOptions() {
  const { data: categoriesResult } = useGetCategoriesQuery({
    perPage: 100,
  });

  const { data: genresResult } = useGetGenresQuery({
    perPage: 100,
  });

  const { data: castMembersResult } = useGetCastMembersQuery({
    perPage: 100,
  });

  return {
    categorieOptions: formatOptions(categoriesResult),
    genreOptions: formatOptions(genresResult),
    castMemberOptions: formatOptions(castMembersResult),
  };
}
