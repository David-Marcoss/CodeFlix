import { Alert, Box, Button, TextField, Typography } from "@mui/material"
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutlined"

import { AppThemeProvider } from "../../shared/contexts/AppThemeProvider"
import {
  loginSchema,
  type LoginFormValues,
  type LoginSchema,
} from "./loginSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

interface LoginProps {
  login: (email: string, password: string) => void
  isLoading?: boolean
  error?: string
}

export function LoginPage({ login, isLoading = false, error }: LoginProps) {
  const formMethods = useForm<LoginFormValues, unknown, LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const { handleSubmit, control } = formMethods

  const handleLogin = (data: LoginSchema) => {
    login(data.email, data.password)
  }

  return (
    <AppThemeProvider>
      <Box
        sx={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.paper",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            minHeight: "600px",
            minWidth: "600px",
            display: "flex",
            flexDirection: "column",
            bgcolor: "background.default",
            alignItems: "center",
            justifyItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyItems: "center",
              flexDirection: "column",
              gap: 2,
              mt: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 2,
              }}
            >
              <PlayCircleOutlineIcon color="secondary" sx={{ fontSize: 42 }} />
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  letterSpacing: "-0.5px",
                  color: "white",
                }}
              >
                CodeFlix
              </Typography>
            </Box>

            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 800,
                letterSpacing: "-0.5px",
                color: "text.secondary",
              }}
            >
              Seja bem-vindo à CodeFlix. Informe seu e-mail e senha para acessar
              a aplicação.
            </Typography>
          </Box>

          <Box sx={{ flex: 1, mt: 8, width: "100%" }}>
            {error && (
              <Alert severity="error" sx={{ mx: 4, mb: 2 }}>
                {error}
              </Alert>
            )}
            <form
              onSubmit={handleSubmit(handleLogin)}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                width: "100%",
              }}
            >
              <Controller
                name="email"
                control={control}
                render={({
                  field: { ref, ...field },
                  fieldState: { error },
                }) => (
                  <Box
                    sx={{
                      px: 4,
                    }}
                  >
                    <TextField
                      {...field}
                      inputRef={ref}
                      label="E-mail"
                      type="email"
                      autoComplete="username"
                      required
                      fullWidth
                      disabled={isLoading}
                      error={!!error}
                      helperText={error?.message ?? " "}
                      slotProps={{
                        htmlInput: { "data-testid": "email-input" },
                      }}
                    />
                  </Box>
                )}
              />

              <Controller
                name="password"
                control={control}
                render={({
                  field: { ref, ...field },
                  fieldState: { error },
                }) => (
                  <Box sx={{ px: 4 }}>
                    <TextField
                      {...field}
                      inputRef={ref}
                      label="Senha"
                      type="password"
                      autoComplete="current-password"
                      required
                      fullWidth
                      disabled={isLoading}
                      error={!!error}
                      helperText={error?.message ?? " "}
                    />
                  </Box>
                )}
              />

              <Box sx={{ display: "flex", px: 4 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  disabled={isLoading}
                  data-testid="submit-button"
                  sx={{ width: "100%" }}
                >
                  {isLoading ? "Aguarde..." : "Entrar"}
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Box>
    </AppThemeProvider>
  )
}
