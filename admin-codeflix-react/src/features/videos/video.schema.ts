import * as z from "zod";
import { ratingValues } from "../../shared/types/videos";

export const videoSchema = z.object({
  banner: z.instanceof(File).nullable().optional(),
  video: z.instanceof(File).nullable().optional(),
  trailer: z.instanceof(File).nullable().optional(),
  thumbnail: z.instanceof(File).nullable().optional(),
  thumbnail_half: z.instanceof(File).nullable().optional(),
  title: z
    .string("O campo de título é obrigatório")
    .trim()
    .min(1, "O campo de título é obrigatório"),
  description: z
    .string("O campo de descrição é obrigatório")
    .trim()
    .min(1, "O campo de descrição é obrigatório"),
  year_launched: z
    .string()
    .regex(/^[1-9]\d{3}$/, "Informe um ano de lançamento válido com 4 dígitos")
    .transform((value) => Number(value)),
  duration: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Informe uma duração válida (HH:mm)")
    .transform((value) => {
      const [hours, minutes] = value.split(":").map(Number);
      return hours * 60 + minutes;
    }),
  rating: z.enum(ratingValues),
  is_opened: z.boolean(),
  is_published: z.boolean(),
  categories_id: z.array(z.string()).min(1, "Selecione ao menos uma categoria"),
  genres_id: z.array(z.string()).min(1, "Selecione ao menos um gênero"),
  cast_members_id: z
    .array(z.string())
    .min(1, "Selecione ao menos um membro do elenco"),
});

export type VideoSchema = z.infer<typeof videoSchema>;

export type VideoFormValues = z.input<typeof videoSchema>;
