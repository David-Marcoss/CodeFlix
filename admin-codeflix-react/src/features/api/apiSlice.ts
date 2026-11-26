import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react"
import type { RootState } from "../../app/store"
import { getAccessToken } from "../../shared/auth/keycloackConfig"
import { Enviroment } from "../../shared/environments/environment"

const baseUrl = Enviroment.API_URL

const rawBaseQuery = fetchBaseQuery({ baseUrl })
const authenticatedBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, options) => {
  const request = typeof args === "string" ? { url: args } : args
  const headers = new Headers()
  if (request.headers instanceof Headers) {
    request.headers.forEach((value, name) => headers.set(name, value))
  } else {
    const entries = Array.isArray(request.headers)
      ? request.headers
      : Object.entries(request.headers ?? {})
    for (const [name, value] of entries) {
      if (value !== undefined) headers.set(name, value)
    }
  }
  if ((api.getState() as RootState).auth.isAuthenticated) {
    try {
      const token = await getAccessToken()
      if (!token) throw new Error("Sessão expirada")
      headers.set("Authorization", `Bearer ${token}`)
    } catch {
      api.dispatch({ type: "auth/logout" })
      return {
        error: {
          status: 401,
          data: { message: "Sessão expirada. Entre novamente." },
        },
      }
    }
  }
  return rawBaseQuery({ ...request, headers }, api, options)
}

export const apiSlice = createApi({
  reducerPath: "api",
  tagTypes: ["Categories", "CastMembers", "Genres", "Videos"],
  endpoints: () => ({}),
  baseQuery: authenticatedBaseQuery,
})
