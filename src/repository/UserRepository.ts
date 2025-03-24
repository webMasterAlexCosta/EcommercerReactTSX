import { AxiosRequestConfig } from "axios";
import { CadastroUserDTO } from "../models/dto/CadastroUserDTO";
import { Endereco, Login } from "../models/dto/CredenciaisDTO";
import requestBackEnd from "../utils/request";
import {
  CADASTRO_NOVO_USUARIO,
  RECUPERAR_SENHA,
  TOKEN_KEY,
} from "../utils/system";
import { isAuthenticated } from "../services/AuthService";
import { CriptografiaAES } from "../models/domain/CriptografiaAES";

const getMeRepository = async () => {
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
};
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
  try {
    const usuario = await getMeRepository();

    const encryptedData = usuario.data.encryptedData;
    const chaveBase64 = usuario.data.chaveBase64;

    sessionStorage.setItem("encryptedUserData", encryptedData);
    sessionStorage.setItem("chaveBase64", chaveBase64);

    return Promise.resolve();
  } catch (error) {
    console.error("Erro ao salvar os dados do usuário:", error);
    throw error;
  }
};

const getUserRepository = () => {
  const encryptedData = sessionStorage.getItem("encryptedUserData");
  const chaveBase64 = sessionStorage.getItem("chaveBase64");

  if (encryptedData && chaveBase64) {
    try {
      const decryptedData = CriptografiaAES.decrypt(encryptedData, chaveBase64);

      console.log("Dados descriptografados:", decryptedData);

      return JSON.parse(decryptedData);
    } catch (error) {
      console.error("Erro ao descriptografar os dados:", error);
      return null;
    }
  }

  console.error("Dados ou chave ausentes.");
  return null;
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
