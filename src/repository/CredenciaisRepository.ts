import { Login } from "../models/dto/CredenciaisDTO";
import { DADOS_USER, TOKEN_KEY } from "../utils/system";
import * as userRepository from "./UserRepository";

const logout = () => {
  sessionStorage.removeItem(DADOS_USER);
  return localStorage.removeItem(TOKEN_KEY);
};

const save = async (response: Login) => {
  localStorage.setItem(TOKEN_KEY, response.token);
  
   await setUser();
};

const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

const setUser = async () => {
  const usuario = await userRepository.getMe();
  sessionStorage.setItem(DADOS_USER, JSON.stringify(usuario.data));
  return Promise.resolve();

};

const getUser = () => {
  const dados = sessionStorage.getItem(DADOS_USER);
  if (dados !== null) {
    return JSON.parse(dados);
  }
  return null;
};


export { logout, save, getToken, getUser, setUser };
