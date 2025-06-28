import { AxiosRequestConfig } from "axios";
import { CadastroUserDTO } from "../models/dto/CadastroUserDTO";
import { Endereco, Login } from "../models/dto/CredenciaisDTO";
import requestBackEnd from "../utils/request";
import {
  ALTERAR_SENHA_AUTENTICADO,
  CADASTRO_NOVO_USUARIO,
  DADOS_USER,
  ENVIAR_PEDIDO,
  FOTO_PERFIL_LINK,
  HISTORICO_PEDIDO_USER,
  PRODUTO_KEY,
  RECUPERAR_SENHA,
  TOKEN_KEY,
} from "../utils/system";
import { isAuthenticated } from "../services/AuthService";
import CriptografiaAES from "../models/domain/CriptografiaAES";
import { getUserService } from "../services/UserServices";
import {
  CarrinhoItem,
  PedidoData,
  PedidoItem,
} from "../models/dto/CarrinhoDTO";
import { getCarrinho } from "./CarrinhoRepository";

// Adicionando js-cookie
import Cookies from "js-cookie";

// Helper para cookies (json)
interface SetJsonCookie {
  (key: string, value: unknown, expires?: number): void;
}

const setJsonCookie: SetJsonCookie = (key, value, expires = 7) => {
  Cookies.set(key, JSON.stringify(value), { expires, path: "/" });
};

interface GetJsonCookie {
  (key: string): unknown | null;
}

const getJsonCookie: GetJsonCookie = (key) => {
  const value = Cookies.get(key);
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

interface RemoveCookie {
  (key: string): void;
}

const removeCookie: RemoveCookie = (key) => {
  Cookies.remove(key, { path: "/" });
};

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

  try {
    const response = await requestBackEnd(config);
    return response;
  } catch (error) {
    console.error("Erro ao recuperar senha", error);
    throw error;
  }
};

const setUserRepository = async () => {
  const usuario = await getMeRepository();
  setJsonCookie(DADOS_USER, usuario.data);
  return Promise.resolve();
};

const getUserRepository = () => {
  return getJsonCookie(DADOS_USER);
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
  removeCookie(DADOS_USER);
  removeCookie(TOKEN_KEY);
  removeCookie(FOTO_PERFIL_LINK);
  removeCookie(PRODUTO_KEY);
  window.location.href = "/login";
};

const saveTokenRepository = async (response: Login) => {
  Cookies.set(TOKEN_KEY, response.token, { expires: 7, path: "/" });
  await setUserRepository();
};

const getTokenRepository = () => {
  return Cookies.get(TOKEN_KEY) || null;
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

const alterarSenhaAutenticado = async (
  antigaSenha: string,
  novaSenha: string
) => {
  if (await isAuthenticated()) {
    const user = await getUserService() as { email?: string };
    const email = user?.email;

    const config: AxiosRequestConfig = {
      method: "POST",
      url: ALTERAR_SENHA_AUTENTICADO,
      headers: { "Content-Type": "application/json" },
      withCredentials: true,

      data: { antigaSenha, novaSenha, email },
    };
    //  console.log(config);
    return requestBackEnd(config);
  }
};

const enviarPedido = async () => {
  const carrinhoData = getCarrinho();
  const carrinhoAtual: CarrinhoItem[] = carrinhoData
    ? JSON.parse(carrinhoData)
    : [];
  if (carrinhoAtual.length === 0) {
    return Promise.reject("Carrinho está vazio");
  }

  try {
    const data: PedidoData = {
      items: carrinhoAtual.map(
        (item: CarrinhoItem): PedidoItem => ({
          id: item.id,
          nome: item.nome,
          preco: item.preco,
          descricao: item.descricao,
          imgUrl: item.imgUrl,
          quantidade: item.quantidade,
          categorias: item.categorias || [],
          subTotal: item.preco * item.quantidade,
        })
      ),
    };

    const chave = CriptografiaAES.generateRandomKeyBase64();

    const encryptedData = await CriptografiaAES.encrypt(
      JSON.stringify(data),
      chave
    );

    const config: AxiosRequestConfig = {
      method: "POST",
      url: ENVIAR_PEDIDO,
      headers: { "Content-Type": "application/json" },
      data: {
        encryptedData,
        chave,
      },
    };

    const enviado = await requestBackEnd(config);
    // console.log("pedido enciado " + enviado.data)

    if (enviado.status === 200 || enviado.status === 201) {
      setTimeout(() => {
        window.location.href = "/Carrinho";
      }, 4000);
      return enviado;
    }

    return Promise.reject("Falha ao enviar o pedido");
  } catch {
    //console.error("Erro ao enviar o pedido:", error);
    return Promise.reject("Erro ao enviar o pedido");
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
  alterarSenhaAutenticado,
  enviarPedido,
};
