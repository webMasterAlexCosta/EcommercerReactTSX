import { jwtDecode } from "jwt-decode";
import { AccessTokenPayloadDTO } from "../models/dto/CredenciaisDTO";
import * as useService from "./UserServices";

const getAccessTokenPayload = async (): Promise<AccessTokenPayloadDTO | undefined> => {
  try {
    const token =  useService.getTokenService();

    if (!token || token.split('.').length !== 3) {
      return undefined;
    }

    return jwtDecode(token) as AccessTokenPayloadDTO;
  } catch  {
    return undefined;
  }
};

const isAuthenticated = async (): Promise<boolean> => {
  const tokenPayload = await getAccessTokenPayload();
  return tokenPayload ? tokenPayload.exp * 1000 > Date.now() : false;
};

export { getAccessTokenPayload, isAuthenticated };
