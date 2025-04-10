import { AxiosRequestConfig } from "axios";
import { CadastroUserDTO } from "../models/dto/CadastroUserDTO";
import { Endereco, Login } from "../models/dto/CredenciaisDTO";
import requestBackEnd from "../utils/request";
import {
  ALTERAR_SENHA_AUTENTICADO,
  CADASTRO_NOVO_USUARIO,
  CHAVE1,
  CHAVE2,
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
import { CarrinhoItem, PedidoData, PedidoItem } from "../models/dto/CarrinhoDTO";
import { getCarrinho } from "./CarrinhoRepository";

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
      //console.log("secreto" +SECRET_KEY_BASE64_1 + SECRET_KEY_BASE64_2)
      return Promise.resolve(usuario);
    }
  }
};

const getUserRepository = async () => {
  if (await isAuthenticated()) {
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
      return { perfil: [] };
    }

    try {
      const decryptedData = await CriptografiaAES.decrypt(encryptedData, chave);
      const user = JSON.parse(decryptedData);
      return { ...user, perfil: user.perfil || [] };
    } catch (error) {
      console.error("Erro ao descriptografar os dados:", error);
      return { perfil: [] };
    }
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
  const encryptToken = await CriptografiaAES.encrypt(response.token, CHAVE1);
  const misture = encryptToken + encryptToken.slice(0, 300);
  const teste = await CriptografiaAES.encrypt(misture, CHAVE2);

  localStorage.setItem(TOKEN_KEY, teste);
  await setUserRepository();
  return Promise.resolve();
};

const getTokenRepository = async () => {
  const tokensalvo = localStorage.getItem(TOKEN_KEY);

  if (!tokensalvo) {
    return null;
  }
  const mistureDescriptografado = await CriptografiaAES.decrypt(
    tokensalvo,
    CHAVE2
  );

  const encryptTokenOriginal = mistureDescriptografado.slice(
    0,
    mistureDescriptografado.length - 300
  );

  const decryptToken = await CriptografiaAES.decrypt(
    encryptTokenOriginal,
    CHAVE1
  );

  return decryptToken;
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


const alterarSenhaAutenticado=async(antigaSenha:string, novaSenha:string)=>{
  if (await isAuthenticated()) {
    const user = await getUserService();
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
}

const enviarPedido = async()=>{
  const carrinhoData = getCarrinho();
  const carrinhoAtual: CarrinhoItem[] = carrinhoData ? JSON.parse(carrinhoData) : [];
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

     const encryptedData = await CriptografiaAES.encrypt(JSON.stringify(data), chave);

    const config: AxiosRequestConfig = {
      method: "POST",
      url: ENVIAR_PEDIDO,
      headers: { "Content-Type": "application/json" },
      data:{
        encryptedData,
        chave
        
      }
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
  } catch  {
    //console.error("Erro ao enviar o pedido:", error);
    return Promise.reject("Erro ao enviar o pedido");
  }
}



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
  enviarPedido
};
