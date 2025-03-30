import { AxiosRequestConfig } from "axios";
import { CadastroUserDTO } from "../models/dto/CadastroUserDTO";
import { Endereco, Login } from "../models/dto/CredenciaisDTO";
import requestBackEnd from "../utils/request";
import {
  CADASTRO_NOVO_USUARIO,
  CHAVE,
  FOTO_PERFIL_LINK,
  HISTORICO_PEDIDO_USER,
  PRODUTO_KEY,
  RECUPERAR_SENHA,
  TOKEN_KEY,
} from "../utils/system";
import { isAuthenticated } from "../services/AuthService";
import CriptografiaAES from "../models/domain/CriptografiaAES";


const gerarChaves = async () => {
  const SECRET_KEY_BASE64_1 = CriptografiaAES.generateRandomKeyBase64();
  const SECRET_KEY_BASE64_2 = await CriptografiaAES.deriveSecondKeyFromFirst(
    SECRET_KEY_BASE64_1
  );

  return { SECRET_KEY_BASE64_1, SECRET_KEY_BASE64_2 };
};

const chaves = async () => {
  const { SECRET_KEY_BASE64_1, SECRET_KEY_BASE64_2 } = await gerarChaves();
  return { SECRET_KEY_BASE64_1, SECRET_KEY_BASE64_2 };
};

let SECRET_KEY_BASE64_1: string, SECRET_KEY_BASE64_2: string;

chaves().then((keys) => {
  SECRET_KEY_BASE64_1 = keys.SECRET_KEY_BASE64_1;
  SECRET_KEY_BASE64_2 = keys.SECRET_KEY_BASE64_2;
});

const getMeRepository = async () => {
  if (await isAuthenticated()) {
    const config: AxiosRequestConfig = {
      url: "/api/users/me",
      withCredentials: true,
    };

    try {
      const response = await requestBackEnd(config);
      return response;
    } catch (error) {
      console.error("Erro ao buscar usuário", error);
      throw error;
    }
  }
};

const recuperarSenhaRepository = async (email: string, cpf: string) => {
  const config: AxiosRequestConfig = {
    method: "POST",
    url: RECUPERAR_SENHA,
    data: { email, cpf },
  };

  try {
    const response = await requestBackEnd(config);
    return response;
  } catch (error) {
    console.error("Erro ao recuperar senha", error);
    throw error;
  }
};

const setUserRepository = async () => {
  if (await isAuthenticated()) {
    const encryptedData = sessionStorage.getItem("encryptedData");
    const chaveBase64 = sessionStorage.getItem("chave");
    if (encryptedData === null || chaveBase64 === null) {
      const usuario = await getMeRepository();

      const misturar =
        SECRET_KEY_BASE64_1 + usuario?.data.chave + SECRET_KEY_BASE64_2;
      sessionStorage.setItem("encryptedData", usuario?.data.encryptedData);
      sessionStorage.setItem("chave", misturar);
      console.log("secreto" +SECRET_KEY_BASE64_1 + SECRET_KEY_BASE64_2)
      return Promise.resolve(usuario);
    }
    return Promise.resolve();
  }
};

const getUserRepository = async () => {
  await setUserRepository();

  const encryptedData = sessionStorage.getItem("encryptedData");
  const chaveMisturadas = sessionStorage.getItem("chave");

  if (!chaveMisturadas) {
    throw new Error("Chave não encontrada no sessionStorage.");
  }

  const chave = chaveMisturadas.slice(
    SECRET_KEY_BASE64_1.length,
    chaveMisturadas?.length - SECRET_KEY_BASE64_2.length
  );
  if (!encryptedData || !chave) {
    return Promise.resolve({ perfil: [] });
  }

  try {
    const decryptedData = await CriptografiaAES.decrypt(encryptedData, chave);
    const user = JSON.parse(decryptedData);
    return Promise.resolve({ ...user, perfil: user.perfil || [] });
  } catch (error) {
    console.error("Erro ao descriptografar os dados:", error);
    return Promise.resolve({ perfil: [] });
  }
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
    console.error("Erro ao cadastrar novo usuário", error);
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

const logoutRepository = async () => {
  if (await isAuthenticated()) {
    const config: AxiosRequestConfig = {
      method: "POST",
      url: "/api/login/logout",
      withCredentials: true,
    };
    requestBackEnd(config);
  }
  sessionStorage.clear();
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(FOTO_PERFIL_LINK);
  localStorage.removeItem(PRODUTO_KEY);
  window.location.href = "/login";
};

const saveTokenRepository = async (response: Login) => {
 
    console.log("token Recebido  no decript > " + response.token)
   // const base64Token =  btoa(response.token);
    
    const encryptToken = await CriptografiaAES.encrypt(response.token, CHAVE);
    console.log("token criptografado > " +encryptToken)
   
  

  localStorage.setItem(TOKEN_KEY, encryptToken);
 // await setUserRepository();
  return Promise.resolve();
};

const getTokenRepository = async () => {
  const tokensalvo = localStorage.getItem(TOKEN_KEY);

  if (!tokensalvo) {
    return null; 
  }

  const decrypt = await CriptografiaAES.decrypt(tokensalvo,CHAVE);
  return decrypt;
};

const obterHistoricoPedidoRepository = async () => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: HISTORICO_PEDIDO_USER,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  };
  try {
    const response = await requestBackEnd(config);
    return response;
  } catch (error) {
    console.error("Erro ao obter histórico de pedidos", error);
    throw new Error("Erro ao obter histórico de pedidos");
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
  obterHistoricoPedidoRepository,
};
