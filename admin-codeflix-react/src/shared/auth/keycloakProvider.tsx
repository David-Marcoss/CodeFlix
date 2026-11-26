import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  subscribeAuth,
  getAuthSession,
  loginWithPassword,
} from "./keycloackConfig"
import {
  logout,
  selectAuth,
  setAuthToken,
  setIsAuthenticated,
  setIsLoading,
  setUserDetails,
} from "../../features/auth/authSlice"
import { apiSlice } from "../../features/api/apiSlice"
import { LoginPage } from "../../features/login/LoginPage"

export function KeycloakProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const auth = useAppSelector(selectAuth)
  const [error, setError] = useState<string>()
  useEffect(() => {
    const syncSession = () => {
      const session = getAuthSession()
      if (!session) {
        dispatch(logout())
        dispatch(apiSlice.util.resetApiState())
        return
      }
      dispatch(setAuthToken(session.token))
      dispatch(setUserDetails(session.userDetails))
      dispatch(setIsAuthenticated(true))
    }
    const unsubscribe = subscribeAuth(syncSession)
    syncSession()
    return unsubscribe
  }, [dispatch])

  const handleLogin = async (email: string, password: string) => {
    dispatch(setIsLoading(true))
    setError(undefined)
    try {
      await loginWithPassword(email, password)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Não foi possível entrar. Tente novamente.",
      )
    } finally {
      dispatch(setIsLoading(false))
    }
  }
  return auth.isAuthenticated ? (
    <>{children}</>
  ) : (
    <LoginPage login={handleLogin} isLoading={auth.isLoading} error={error} />
  )
}
