import { useDispatch } from "react-redux"
import { initializeKeycloak, keycloak } from "./keycloackConfig"
import {
  setAuthToken,
  setIsAuthenticated,
  setUserDetails,
} from "../../features/auth/authSlice"
import { useEffect } from "react"

interface KeycloakProviderProps {
  children: React.ReactNode
}

export function KeycloakProvider({ children }: KeycloakProviderProps) {
  const dispatch = useDispatch()

  useEffect(() => {
    let active = true

    const initKeycloak = async () => {
      try {
        const authenticated = await initializeKeycloak()
        if (!active) return

        if (authenticated && keycloak.token) {
          dispatch(setAuthToken(keycloak.token))
          dispatch(setIsAuthenticated(true))
          dispatch(setUserDetails(keycloak.userInfo))
        } else {
          dispatch(setIsAuthenticated(false))
        }
      } catch (error) {
        if (!active) return
        console.log("Error on Auth: ", error)
        dispatch(setIsAuthenticated(false))
      }
    }

    initKeycloak()
    return () => {
      active = false
    }
  }, [dispatch])

  return <>{children}</>
}
