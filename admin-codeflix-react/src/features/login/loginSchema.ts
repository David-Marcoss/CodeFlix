import * as z from "zod"
export const loginSchema = z.object({
  email: z.email("Informe um e-mail válido"),
  password: z.string().min(1, "Informe sua senha"),
})

export type LoginSchema = z.infer<typeof loginSchema>

export type LoginFormValues = z.input<typeof loginSchema>
