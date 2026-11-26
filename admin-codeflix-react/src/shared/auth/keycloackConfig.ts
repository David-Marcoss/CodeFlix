import type { KeycloakTokenParsed } from "keycloak-js"
import { Enviroment } from "../environments/environment"

const endpoint = `${Enviroment.KEYCLOAK_URL.replace(/\/$/, "")}/realms/${encodeURIComponent(Enviroment.KEYCLOAK_REALM)}/protocol/openid-connect`
interface TokenResponse {
  access_token: string
  refresh_token: string
  expires_in: number
}
interface Session {
  token: string
  refreshToken: string
  expiresAt: number
  userDetails: KeycloakTokenParsed
}
let session: Session | undefined
let version = 0
let refresh: Promise<string | undefined> | undefined
let timer: ReturnType<typeof setTimeout> | undefined
const listeners = new Set<() => void>()

export function subscribeAuth(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
export function getAuthSession() {
  return session
}
function notify() {
  listeners.forEach(listener => listener())
}
function clearSession() {
  version++
  clearTimeout(timer)
  session = undefined
  refresh = undefined
  notify()
}
async function requestTokens(
  params: Record<string, string>,
): Promise<TokenResponse> {
  let response: Response
  try {
    response = await fetch(`${endpoint}/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: Enviroment.KEYCLOAK_CLIENT_ID,
        ...params,
      }),
    })
  } catch {
    throw new Error("Não foi possível conectar ao serviço de autenticação.")
  }
  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    if (data.error === "invalid_grant" && params.grant_type === "password") {
      throw new Error(
        "E-mail ou senha inválidos, ou conta com ações pendentes. Verifique suas credenciais.",
      )
    }
    if (
      data.error === "unauthorized_client" ||
      data.error === "invalid_client"
    ) {
      throw new Error(
        "Cliente de autenticação não configurado para login direto.",
      )
    }
    throw new Error("Não foi possível autenticar. Tente novamente.")
  }
  return response.json()
}
function saveSession(data: TokenResponse) {
  const payload = data.access_token.split(".")[1]
  const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
  const userDetails = JSON.parse(
    new TextDecoder().decode(
      Uint8Array.from(decoded, char => char.charCodeAt(0)),
    ),
  ) as KeycloakTokenParsed
  session = {
    token: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: Date.now() + data.expires_in * 1000,
    userDetails,
  }
  clearTimeout(timer)
  timer = setTimeout(
    () => {
      void getAccessToken().catch(() => {})
    },
    Math.max(1000, (data.expires_in - 30) * 1000),
  )
  notify()
}
export async function loginWithPassword(email: string, password: string) {
  const current = ++version
  const data = await requestTokens({
    grant_type: "password",
    username: email,
    password,
    scope: "openid profile email",
  })
  if (current === version) saveSession(data)
}
export async function getAccessToken(): Promise<string | undefined> {
  if (!session) return undefined
  if (session.expiresAt - Date.now() > 30000) return session.token
  if (!refresh) {
    const current = version
    const refreshToken = session.refreshToken
    const pending = requestTokens({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    })
      .then(data => {
        if (current !== version) return undefined
        saveSession(data)
        return session?.token
      })
      .catch(error => {
        if (current === version) clearSession()
        throw error
      })
      .finally(() => {
        if (refresh === pending) refresh = undefined
      })
    refresh = pending
  }
  return refresh
}
export async function logoutFromKeycloak() {
  const refreshToken = session?.refreshToken
  clearSession()
  if (!refreshToken) return
  const response = await fetch(`${endpoint}/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: Enviroment.KEYCLOAK_CLIENT_ID,
      refresh_token: refreshToken,
    }),
  })
  if (!response.ok)
    throw new Error("Não foi possível encerrar a sessão no servidor.")
}
