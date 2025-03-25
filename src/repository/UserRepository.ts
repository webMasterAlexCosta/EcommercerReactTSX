import { AxiosRequestConfig } from "axios";
import { CadastroUserDTO } from "../models/dto/CadastroUserDTO";
import { Endereco, Login } from "../models/dto/CredenciaisDTO";
import requestBackEnd from "../utils/request";
import {
  CADASTRO_NOVO_USUARIO,
  CHAVECIFRADO,
  DADOCIFRAFADO,
  RECUPERAR_SENHA,
  TOKEN_KEY,
} from "../utils/system";
import { isAuthenticated } from "../services/AuthService";
import { CriptografiaAES } from "../models/domain/CriptografiaAES";

const getMeRepository = async () => {
  if(isAuthenticated()){
  const config: AxiosRequestConfig = {
    url: "/api/users/me",
    withCredentials: true,
  };

  try {
    const response = await requestBackEnd(config);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}};
const recuperarSenhaRepository = async (email: string, cpf: string) => {
  const config: AxiosRequestConfig = {
    method: "POST",
    url: RECUPERAR_SENHA,
    data: { email, cpf },
  };

  const response = await requestBackEnd(config);

  return response;
};
const cadastrarNovoUsuarioRepository = async (FormData: CadastroUserDTO) => {
  try {
    const config: AxiosRequestConfig = {
      method: "POST",
      url: CADASTRO_NOVO_USUARIO,
      data: FormData,
    };
    const response = await requestBackEnd(config);
    return response;
  } catch (error) {
    console.error("Ocorreu um erro ao realistar cadastro", error);
    throw new Error("Erro ao realizar cadastro");
  }
};
const mudarEnderecoUserAutenticadoRepository = (
  enderecoUsuario: Endereco,
  id: string
) => {
  const config: AxiosRequestConfig = {
    method: "POST",
    url: `/api/usuarios/${id}/endereco`,
    data: enderecoUsuario,
    withCredentials: true,
  };
  return requestBackEnd(config);
};

const logoutRepository = () => {
  if (isAuthenticated()) {
    const config: AxiosRequestConfig = {
      method: "POST",
      url: "/api/login/logout",
      withCredentials: true,
    };
    requestBackEnd(config);
  }
  sessionStorage.clear();
  localStorage.clear();
  return (window.location.href = "/login");
};

const saveTokenRepository = async (response: Login) => {
  localStorage.setItem(TOKEN_KEY, response.token);

  await setUserRepository();
  return Promise.resolve();
};

const getTokenRepository = () => {
  return localStorage.getItem(TOKEN_KEY);
};

const setUserRepository = async () => {
  if(isAuthenticated()){
  const encryptedData = sessionStorage.getItem(DADOCIFRAFADO);
  const chaveBase64 = sessionStorage.getItem(CHAVECIFRADO);
    if(encryptedData ===null && chaveBase64 ===null){
    const usuario = await getMeRepository();
    sessionStorage.setItem(DADOCIFRAFADO, usuario?.data.encryptedData);
    sessionStorage.setItem(CHAVECIFRADO, usuario?.data?.chaveBase64);
    if (!usuario?.data?.encryptedData || !usuario?.data?.chaveBase64) {
      throw new Error("Dados criptografados ou chave não foram retornados corretamente.");
    }
  }
   // console.log("🔐 Dados criptografados armazenados com sucesso!");
    return Promise.resolve();
}
};
const getUserRepository = async () => {
  await setUserRepository()
  const encryptedData = sessionStorage.getItem(DADOCIFRAFADO);
  const chaveBase64 = sessionStorage.getItem(CHAVECIFRADO);

  if (!encryptedData || !chaveBase64) {
    //console.error("⚠️ Dados ou chave ausentes.");
    return Promise.resolve({ perfil: [] }); 
  }

  try {
    const decryptedData = await CriptografiaAES.decrypt(encryptedData, chaveBase64);

    // console.log("🔓 Dados descriptografados:", decryptedData);

    const user = JSON.parse(decryptedData);
    return Promise.resolve({ ...user, perfil: user.perfil || [] }); // Retorna uma Promise resolvida com os dados
  } catch  {
    // console.error("Erro ao descriptografar os dados:", error);
    return Promise.resolve({ perfil: [] }); // 
  }
};


export {
  cadastrarNovoUsuarioRepository,
  getMeRepository,
  getTokenRepository,
  getUserRepository,
  logoutRepository,
  mudarEnderecoUserAutenticadoRepository,
  recuperarSenhaRepository,
  saveTokenRepository,
  setUserRepository,
};
