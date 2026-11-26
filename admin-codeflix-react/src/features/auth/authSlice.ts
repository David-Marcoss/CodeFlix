import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../../app/store"
import type { KeycloakTokenParsed } from "keycloak-js"

export interface AuthState {
  token?: string
  isLoading: boolean
  isAuthenticated: boolean
  userDetails?: KeycloakTokenParsed
}

const initialState: AuthState = {
  isLoading: false,
  isAuthenticated: false,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthToken: (state, action: PayloadAction<string | undefined>) => {
      state.token = action.payload
    },
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setUserDetails: (
      state,
      action: PayloadAction<KeycloakTokenParsed | undefined>,
    ) => {
      state.userDetails = action.payload
    },
    logout: () => ({ ...initialState }),
  },
})

export const selectAuth = (state: RootState) => state.auth

export const {
  setAuthToken,
  setIsAuthenticated,
  setIsLoading,
  setUserDetails,
  logout,
} = authSlice.actions

export const authReducer = authSlice.reducer
