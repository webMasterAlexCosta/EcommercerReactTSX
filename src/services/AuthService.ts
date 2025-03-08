import { jwtDecode } from "jwt-decode";
import { AccessTokenPayloadDTO } from "../models/dto/CredenciaisDTO";
import * as credencialService from "./CredenciasiService";
import { TOKEN_KEY } from "../utils/system";

const getAccessTokenPayload: () => AccessTokenPayloadDTO | undefined = () => {
    try {
        const token = credencialService.get(TOKEN_KEY);
       return token === null 
       ? undefined
       : 
       jwtDecode(token) as AccessTokenPayloadDTO;
    } catch {
        return undefined;
    }
};
const isAuthenticated: () => boolean | undefined = () => {
    const tokenPayload = getAccessTokenPayload();
    return tokenPayload && tokenPayload.exp *1000 > Date.now()? true:false
};

export { getAccessTokenPayload, isAuthenticated };