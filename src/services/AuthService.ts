import { jwtDecode } from "jwt-decode";
import { AccessTokenPayloadDTO } from "../models/dto/CredenciaisDTO";
import * as credencialService from "./CredenciasiService";

const getAccessTokenPayload = (): AccessTokenPayloadDTO | undefined => {
  try {
    const token = credencialService.getToken();
    return token ? jwtDecode(token) as AccessTokenPayloadDTO : undefined;
  } catch (error) {
    console.error('Erro ao decodificar o token:', error);
    return undefined;
  }
};

const getUser = () => {
  return credencialService.getUser();
}

const isAuthenticated = (): boolean => {
  const tokenPayload = getAccessTokenPayload();
  return tokenPayload ? tokenPayload.exp * 1000 > Date.now() : false;
};

export { getAccessTokenPayload, isAuthenticated, getUser };
