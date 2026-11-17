import type { CastMemberList } from "../../../shared/types/castMember";
import type { CategoryList } from "../../../shared/types/category";
import type { GenresList } from "../../../shared/types/genre";
import type { SelectOptions } from "../../../shared/types/selectoptions";

export function formatOptions(
  items?: CategoryList | CastMemberList | GenresList,
): SelectOptions {
  if (!items) {
    return [];
  }

  return items.data.map((i) => {
    const value = "category_id" in i
      ? i.category_id
      : "cast_member_id" in i
        ? i.cast_member_id
        : i.genre_id;

    return {
      value,
      label: i.name,
    };
  });
}
