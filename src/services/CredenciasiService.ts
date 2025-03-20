//import QueryString from "qs";
import { CredenciaisDTO, Login } from "../models/dto/CredenciaisDTO";
import { CLIENTE_ID, CLIENTE_SECRET, LOGIN } from "../utils/system";
import { AxiosRequestConfig } from "axios";
import requestBackEnd from "../utils/request";
import * as credenciaisRepository from "../repository/CredenciaisRepository";
const loginRequest = (loginDados: CredenciaisDTO) => {
  const header = {
    "Content-Type": "application/json",
    Authorization: "BASE" + window.btoa(CLIENTE_ID + "" + CLIENTE_SECRET),
  };
  const requestBody =JSON.stringify({
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

const logout = () => {
  return credenciaisRepository.logout();
};

const save = (response : Login) => {
  return credenciaisRepository.save(response);
};

const getToken = () => {
    return credenciaisRepository.getToken()

};

const getUser = ()=>{
    return credenciaisRepository.getUser();
}

export { loginRequest, logout, save ,getToken, getUser};
