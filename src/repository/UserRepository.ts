import { AxiosRequestConfig } from "axios";
import { CadastroUserDTO } from "../models/dto/CadastroUserDTO";
import { Endereco, Login } from "../models/dto/CredenciaisDTO";
import requestBackEnd from "../utils/request";
import {
  CADASTRO_NOVO_USUARIO,
  DADOS_USER,
  RECUPERAR_SENHA,
  TOKEN_KEY,
} from "../utils/system";

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
  const config :AxiosRequestConfig={
    method:"POST",
    url:"/api/login/logout",
    withCredentials:true
  }
  requestBackEnd(config)
  sessionStorage.clear()
  return localStorage.clear()
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
  const usuario = await getMeRepository();
  sessionStorage.setItem(DADOS_USER, JSON.stringify(usuario.data));
  return Promise.resolve();
};

const getUserRepository = () => {
  const dados = sessionStorage.getItem(DADOS_USER);
  if (dados !== null) {
    return JSON.parse(dados);
  }
  return null;
};

export {
  cadastrarNovoUsuarioRepository, getMeRepository, getTokenRepository, getUserRepository, logoutRepository, mudarEnderecoUserAutenticadoRepository, recuperarSenhaRepository, saveTokenRepository, setUserRepository
};

