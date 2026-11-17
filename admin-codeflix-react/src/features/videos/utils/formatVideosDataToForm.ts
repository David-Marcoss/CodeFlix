import type { Video } from "../../../shared/types/videos";
import type { VideoSchema } from "../video.schema";

export function formatVideoDataToForm(data?: Video): VideoSchema {
  return {
    title: data?.title ?? "",
    description: data?.description ?? "",
    duration: data?.duration ?? 0,
    year_launched: data?.year_launched ?? 2026,
    is_opened: data?.is_opened ?? false,
    rating: data?.rating ?? "L",
    is_published: data?.is_published ?? false,
    cast_members_id: data?.cast_members_id ?? [],
    categories_id: data?.categories_id ?? [],
    genres_id: data?.genres_id ?? [],
  };
}
