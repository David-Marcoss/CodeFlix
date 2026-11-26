import { http, HttpResponse } from "msw"
import { setupServer } from "msw/node"
import { makeStore } from "../../app/store"
import { apiSlice } from "../api/apiSlice"
import { getAccessToken } from "../../shared/auth/keycloackConfig"
import { Enviroment } from "../../shared/environments/environment"

jest.mock("../../shared/auth/keycloackConfig", () => ({
  getAccessToken: jest.fn(),
}))
const server = setupServer()
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
const testApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    authProbe: builder.query<{ authorization: string | null }, void>({
      query: () => "/auth-probe",
    }),
  }),
})

test("envia o token renovado no cabeçalho da API", async () => {
  server.use(
    http.get(`${Enviroment.API_URL}/auth-probe`, ({ request }) =>
      HttpResponse.json({
        authorization: request.headers.get("authorization"),
      }),
    ),
  )
  jest.mocked(getAccessToken).mockResolvedValueOnce("novo-token")
  const store = makeStore({ auth: { isAuthenticated: true, isLoading: false } })
  const request = store.dispatch(testApi.endpoints.authProbe.initiate())
  await expect(request.unwrap()).resolves.toEqual({
    authorization: "Bearer novo-token",
  })
  request.unsubscribe()
  store.dispatch(apiSlice.util.resetApiState())
})

test("falha de renovação encerra sessão sem enviar requisição", async () => {
  jest.mocked(getAccessToken).mockRejectedValueOnce(new Error("expired"))
  const store = makeStore({
    auth: { isAuthenticated: true, isLoading: false, token: "antigo" },
  })
  const request = store.dispatch(testApi.endpoints.authProbe.initiate())
  await expect(request.unwrap()).rejects.toMatchObject({ status: 401 })
  expect(store.getState().auth.isAuthenticated).toBe(false)
  expect(store.getState().auth.token).toBeUndefined()
  request.unsubscribe()
  store.dispatch(apiSlice.util.resetApiState())
})
