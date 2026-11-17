import type { Video } from "../../../shared/types/videos"
import type { VideoFormValues } from "../video.schema"

export function formatVideoDataToForm(data?: Video): VideoFormValues {
  return {
    title: data?.title ?? "",
    description: data?.description ?? "",
    duration: `${String(Math.floor((data?.duration ?? 0) / 60)).padStart(2, "0")}:${String((data?.duration ?? 0) % 60).padStart(2, "0")}`,
    year_launched: String(data?.year_launched ?? new Date().getFullYear()),
    is_opened: data?.is_opened ?? false,
    rating: data?.rating ?? "L",
    is_published: data?.is_published ?? false,
    cast_members_id: data?.cast_members_id ?? [],
    categories_id: data?.categories_id ?? [],
    genres_id: data?.genres_id ?? [],
  }
}
