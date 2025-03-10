import QueryString from "qs";
import { CredenciaisDTO } from "../models/dto/CredenciaisDTO";
import { CLIENT_ID, CLIENT_SECRET } from "../utils/system";
import { AxiosRequestConfig } from "axios";
import requestBackEnd from "../utils/request";
import * as credenciaisRepository from "../repository/CredenciaisRepository";
const loginRequest = (loginDados: CredenciaisDTO) => {
  const header = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: "BASE" + window.btoa(CLIENT_ID + "" + CLIENT_SECRET),
  };
  const requestBody = QueryString.stringify({
    ...loginDados,
    grant_type: "senha",
  });

  const config: AxiosRequestConfig = {
    method: "POST",
    headers: header,
    url: "/login/cliente3",
    data: requestBody,
  };
  return requestBackEnd(config);
};

const logout = () => {
  return credenciaisRepository.logout();
};

const save = (token: string) => {
  return credenciaisRepository.save(token);
};

const get = (TOKEN_KEY: string) => {
    return credenciaisRepository.get(TOKEN_KEY)

};

const recuperarSenha = (email: string,cpf:string) => {
  return credenciaisRepository.recuperarSenha(email,cpf);
};
export { loginRequest, logout, save ,get,recuperarSenha};
