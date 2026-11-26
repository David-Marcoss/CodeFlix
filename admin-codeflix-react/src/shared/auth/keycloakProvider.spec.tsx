import { StrictMode } from "react"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import { act, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { authReducer } from "../../features/auth/authSlice"
import { KeycloakProvider } from "./keycloakProvider"
import {
  getAccessToken,
  getAuthSession,
  loginWithPassword,
  logoutFromKeycloak,
} from "./keycloackConfig"

jest.mock("../../features/api/apiSlice", () => ({
  apiSlice: { util: { resetApiState: () => ({ type: "api/reset" }) } },
}))
const token = (name: string) =>
  `header.${btoa(JSON.stringify({ preferred_username: name }))}.signature`
const tokens = (name = "admin", expires = 300) => ({
  access_token: token(name),
  refresh_token: `refresh-${name}`,
  expires_in: expires,
})
let fetchMock: jest.SpiedFunction<typeof fetch>
beforeEach(() => {
  fetchMock = jest.spyOn(globalThis, "fetch")
})
afterEach(async () => {
  fetchMock.mockResolvedValue(new Response(null, { status: 204 }))
  await act(async () => {
    await logoutFromKeycloak()
  })
  fetchMock.mockRestore()
})
function setup() {
  const store = configureStore({ reducer: { auth: authReducer } })
  render(
    <StrictMode>
      <Provider store={store}>
        <KeycloakProvider>
          <div>Área protegida</div>
        </KeycloakProvider>
      </Provider>
    </StrictMode>,
  )
  return store
}

test("autentica pelo formulário local sem redirecionar, e limpa a sessão ao sair", async () => {
  fetchMock.mockResolvedValueOnce(Response.json(tokens()))
  const store = setup()
  const user = userEvent.setup()
  expect(fetchMock).not.toHaveBeenCalled()
  expect(screen.queryByText("Área protegida")).not.toBeInTheDocument()
  await user.type(screen.getByLabelText(/E-mail/), "admin@example.com")
  await user.type(screen.getByLabelText(/Senha/), "minha-senha")
  await user.click(screen.getByRole("button", { name: "Entrar" }))
  await screen.findByText("Área protegida")
  const [url, options] = fetchMock.mock.calls[0]
  expect(url).toContain("/realms/codeflix-auth/protocol/openid-connect/token")
  const body = options?.body as URLSearchParams
  expect(body.get("grant_type")).toBe("password")
  expect(body.get("username")).toBe("admin@example.com")
  expect(body.get("password")).toBe("minha-senha")
  expect(body.has("client_secret")).toBe(false)
  expect(store.getState().auth.token).toBe(token("admin"))
  expect(store.getState().auth.userDetails?.preferred_username).toBe("admin")
  fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }))
  await act(async () => {
    await logoutFromKeycloak()
  })
  expect(store.getState().auth.token).toBeUndefined()
  expect(screen.queryByText("Área protegida")).not.toBeInTheDocument()
  expect(screen.getByLabelText(/Senha/)).toHaveValue("")
  expect(fetchMock.mock.calls[1][0]).toContain("/logout")
})

test("mostra erro de credenciais e mantém as telas protegidas", async () => {
  fetchMock.mockResolvedValueOnce(
    Response.json({ error: "invalid_grant" }, { status: 401 }),
  )
  setup()
  const user = userEvent.setup()
  await user.type(screen.getByLabelText(/E-mail/), "admin@example.com")
  await user.type(screen.getByLabelText(/Senha/), "errada")
  await user.click(screen.getByRole("button", { name: "Entrar" }))
  await waitFor(() =>
    expect(screen.getByRole("alert")).toHaveTextContent(
      "E-mail ou senha inválidos",
    ),
  )
  expect(screen.queryByText("Área protegida")).not.toBeInTheDocument()
  expect(screen.getByRole("button", { name: "Entrar" })).toBeEnabled()
})

test("compartilha renovação concorrente e atualiza token sem enviar senha novamente", async () => {
  fetchMock.mockResolvedValueOnce(Response.json(tokens("admin", 1)))
  await loginWithPassword("admin@example.com", "senha")
  fetchMock.mockResolvedValueOnce(Response.json(tokens("renovado")))
  await expect(
    Promise.all([getAccessToken(), getAccessToken()]),
  ).resolves.toEqual([token("renovado"), token("renovado")])
  expect(fetchMock).toHaveBeenCalledTimes(2)
  const body = fetchMock.mock.calls[1][1]?.body as URLSearchParams
  expect(body.get("grant_type")).toBe("refresh_token")
  expect(body.get("refresh_token")).toBe("refresh-admin")
  expect(body.has("password")).toBe(false)
})

test("limpa sessão quando a renovação falha", async () => {
  fetchMock.mockResolvedValueOnce(Response.json(tokens("admin", 1)))
  await loginWithPassword("admin@example.com", "senha")
  fetchMock.mockResolvedValueOnce(
    Response.json({ error: "invalid_grant" }, { status: 400 }),
  )
  await expect(getAccessToken()).rejects.toThrow()
  expect(getAuthSession()).toBeUndefined()
})

test("resposta atrasada de renovação não restaura sessão após logout", async () => {
  fetchMock.mockResolvedValueOnce(Response.json(tokens("admin", 1)))
  await loginWithPassword("admin@example.com", "senha")
  let resolve!: (value: Response) => void
  fetchMock.mockReturnValueOnce(
    new Promise(r => {
      resolve = r
    }),
  )
  const pending = getAccessToken()
  fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }))
  await logoutFromKeycloak()
  resolve(Response.json(tokens("renovado")))
  await expect(pending).resolves.toBeUndefined()
  expect(getAuthSession()).toBeUndefined()
})
