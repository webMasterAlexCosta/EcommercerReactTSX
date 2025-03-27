import { AxiosRequestConfig } from "axios";
import { CadastroUserDTO } from "../models/dto/CadastroUserDTO";
import { Endereco, Login } from "../models/dto/CredenciaisDTO";
import requestBackEnd from "../utils/request";
import {
  CADASTRO_NOVO_USUARIO,
  CHAVECIFRADO,
  DADOCIFRAFADO,
  FOTO_PERFIL_LINK,
  HISTORICO_PEDIDO_USER,
  PRODUTO_KEY,
  RECUPERAR_SENHA,
  TOKEN_KEY,
} from "../utils/system";
import { isAuthenticated } from "../services/AuthService";
import { CriptografiaAES } from "../models/domain/CriptografiaAES";

// Função para gerar e derivar as chaves
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
  if (isAuthenticated()) {
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
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(FOTO_PERFIL_LINK);
  localStorage.removeItem(PRODUTO_KEY);
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
  if (isAuthenticated()) {
    const encryptedData = sessionStorage.getItem(DADOCIFRAFADO);
    const chaveBase64 = sessionStorage.getItem(CHAVECIFRADO);

    if (encryptedData === null || chaveBase64 === null) {
      const usuario = await getMeRepository();

      const misturar =
        SECRET_KEY_BASE64_1 + usuario?.data.chaveBase64 + SECRET_KEY_BASE64_2;

      sessionStorage.setItem(DADOCIFRAFADO, usuario?.data.encryptedData);
      sessionStorage.setItem(CHAVECIFRADO, misturar);

      return Promise.resolve(usuario);
    }
    return Promise.resolve();
  }
};

const getUserRepository = async () => {
  await setUserRepository();

  const encryptedData = sessionStorage.getItem(DADOCIFRAFADO);
  const chaveBase64 = sessionStorage.getItem(CHAVECIFRADO);

  if (!chaveBase64) {
    throw new Error("Chave não encontrada no sessionStorage.");
  }

  const chaveBase64Recuperada = chaveBase64.slice(
    SECRET_KEY_BASE64_1.length,
    chaveBase64.length - SECRET_KEY_BASE64_2.length
  );

  if (!encryptedData || !chaveBase64Recuperada) {
    return Promise.resolve({ perfil: [] });
  }

  try {
    const decryptedData = await CriptografiaAES.decrypt(
      encryptedData,
      chaveBase64Recuperada
    );
    const user = JSON.parse(decryptedData);
    return Promise.resolve({ ...user, perfil: user.perfil || [] });
  } catch (error) {
    console.error("Erro ao descriptografar os dados:", error);
    return Promise.resolve({ perfil: [] });
  }
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
    // setHistoricoPedidos(response.data);
    return response;
  } catch (error) {
    console.error("Erro ao obter histórico de pedidos", error);
    throw new Error();
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
