import { Enviroment } from "../environments/environment"
import Keycloak, { type KeycloakConfig } from "keycloak-js"

const keycloakConfig: KeycloakConfig = {
  url: Enviroment.KEYCLOAK_URL,
  realm: Enviroment.KEYCLOAK_REALM,
  clientId: Enviroment.KEYCLOAK_CLIENT_ID,
}

export const keycloak = new Keycloak(keycloakConfig)

let initialization: Promise<boolean> | undefined

export function initializeKeycloak(): Promise<boolean> {
  initialization ??= keycloak.init({ onLoad: "login-required" })
  return initialization
}
