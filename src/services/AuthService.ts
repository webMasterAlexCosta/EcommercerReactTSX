import { jwtDecode } from "jwt-decode";
import { AccessTokenPayloadDTO } from "../models/dto/CredenciaisDTO";
import * as useService from "./UserServices";

const getAccessTokenPayload = async (): Promise<AccessTokenPayloadDTO | undefined> => {
  try {
    const token = await useService.getTokenService();

    // Verifica se o token existe e tem a estrutura adequada
    if (!token || token.split('.').length !== 3) {
      console.error("Token inválido ou mal formado.");
      return undefined;
    }

    return jwtDecode(token) as AccessTokenPayloadDTO;
  } catch (error) {
    console.error("Erro ao decodificar o token:", error);
    return undefined;
  }
};



const isAuthenticated = async (): Promise<boolean> => {
  const tokenPayload = await getAccessTokenPayload();
  return tokenPayload ? tokenPayload.exp * 1000 > Date.now() : false;
};

export { getAccessTokenPayload, isAuthenticated };
