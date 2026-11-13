import type { CastMember } from "./castMember";
import type { Category } from "./category";
import type { Genre } from "./genre";
import type { Meta } from "./meta";

export const ratingValues = {
  RL: "L",
  R10: "10",
  R12: "12",
  R14: "14",
  R16: "16",
  R18: "18",
} as const;

export type RatingValues = (typeof ratingValues)[keyof typeof ratingValues];

export interface Video {
  id: string;
  banner: string | null;
  thumbnail: string | null;
  thumbnail_half: string | null;
  video: string | null;
  trailer: string | null;
  title: string;
  description: string;
  year_launched: number;
  duration: number;
  rating: RatingValues;
  is_opened: boolean;
  is_published: boolean;
  categories_id: string[];
  categories: Category[];
  genres_id: string[];
  genres: Genre[];
  cast_members_id: string[];
  cast_members: CastMember[];
  created_at: Date;
}

export interface CreateVideo {
  title: string;
  description: string;
  year_launched: number;
  duration: number;
  rating: RatingValues;
  is_opened: boolean;
  is_published: boolean;
  categories_id: string[];
  genres_id: string[];
  cast_members_id: string[];
}

export interface UpdateVideo extends CreateVideo {
  id: string;
}

export interface VideosList {
  data: Video[];
  meta: Meta;
}

export interface GetVideoById {
  data: Video;
}