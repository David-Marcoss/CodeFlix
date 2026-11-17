import * as z from "zod";
import { ratingValues } from "../../shared/types/videos";

export const videoSchema = z.object({
  title: z.string("O campo de título é obrigatório"),
  description: z.string("O campo de descrição é obrigatório"),
  year_launched: z.number("O campo de ano lançamento é obrigatório"),
  duration: z.number("O campo de duração é obrigatório"),
  rating: z.enum(ratingValues),
  is_opened: z.boolean(),
  is_published: z.boolean(),
  categories_id: z.array(z.string()),
  genres_id: z.array(z.string()),
  cast_members_id: z.array(z.string()),
});

export type VideoSchema = z.infer<typeof videoSchema>;
