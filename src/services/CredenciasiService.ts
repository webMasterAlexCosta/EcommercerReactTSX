import QueryString from "qs";
import { CredenciaisDTO } from "../models/dto/CredenciaisDTO";
import { CLIENTE_ID, CLIENTE_SECRET, LOGIN } from "../utils/system";
import { AxiosRequestConfig } from "axios";
import requestBackEnd from "../utils/request";


const loginRequest = (loginDados: CredenciaisDTO) => {
  const header = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: "Basic " + window.btoa(CLIENTE_ID + ":" + CLIENTE_SECRET),
  };
  
  const requestBody =QueryString.stringify({
    ...loginDados,
    grant_type: "senha",
  });

  const config: AxiosRequestConfig = {
    method: "POST",
    headers: header,
    url: LOGIN,
    data: requestBody,
  };
  return requestBackEnd(config);
};
export { loginRequest};
