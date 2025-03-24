import { jwtDecode } from "jwt-decode";
import { AccessTokenPayloadDTO } from "../models/dto/CredenciaisDTO";
import * as useService from "./UserServices";

const getAccessTokenPayload = (): AccessTokenPayloadDTO | undefined => {
  try {
    const token = useService.getTokenService();
    return token ? (jwtDecode(token) as AccessTokenPayloadDTO) : undefined;
  } catch (error) {
    console.error("Erro ao decodificar o token:", error);
    return undefined;
  }
};

const isAuthenticated = (): boolean => {
  const tokenPayload = getAccessTokenPayload();
  return tokenPayload ? tokenPayload.exp * 1000 > Date.now() : false;
};

export { getAccessTokenPayload, isAuthenticated };
