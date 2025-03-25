import { AxiosRequestConfig, AxiosResponse } from "axios";
import { CadastroUserDTO } from "../models/dto/CadastroUserDTO";
import {
  CarrinhoItem,
  PedidoData,
  PedidoItem,
} from "../models/dto/CarrinhoDTO";
import { Endereco, Login } from "../models/dto/CredenciaisDTO";
import * as userRepository from "../repository/UserRepository";
import * as authService from "../services/AuthService";
import { getCarrinho } from "../services/CarrinhoService";
import requestBackEnd from "../utils/request";
import { ALTERAR_SENHA_AUTENTICADO, ENVIAR_PEDIDO } from "../utils/system";

const getMeService = async () => {
  return userRepository.getMeRepository();
};

const recuperarSenha = (email: string, cpf: string) => {
  return userRepository.recuperarSenhaRepository(
    email.toString().toLowerCase(),
    cpf.toString()
  );
};

const cadastrarNovoUsuario = (formData: CadastroUserDTO) => {
  return userRepository.cadastrarNovoUsuarioRepository(formData);
};
const enviarPedido = async (): Promise<AxiosResponse<unknown>> => {
  const carrinhoAtual: CarrinhoItem[] = getCarrinho();

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

    const config: AxiosRequestConfig = {
      method: "POST",
      url: ENVIAR_PEDIDO,
      headers: { "Content-Type": "application/json" },
      data,
    };

    const enviado = await requestBackEnd(config);

    if (enviado.status === 200 || enviado.status === 201) {
      setTimeout(() => {
        window.location.href = "/Carrinho";
      }, 4000);
      return enviado;
    }

    return Promise.reject("Falha ao enviar o pedido");
  } catch (error) {
    console.error("Erro ao enviar o pedido:", error);
    return Promise.reject("Erro ao enviar o pedido");
  }
};

const alterarSenhaAutenticado = async (antigaSenha: string, novaSenha: string) => {
  if (authService.isAuthenticated()) {
    const user = await getUserService();
    const email = user?.email;

    const config: AxiosRequestConfig = {
      method: "POST",
      url: ALTERAR_SENHA_AUTENTICADO,
      headers: { "Content-Type": "application/json" },
      withCredentials: true,

      data: { antigaSenha, novaSenha, email },
    };
    console.log(config);
    return requestBackEnd(config);
  }
};
const mudarEnderecoUserAutenticado = (
  usuarioEndereco: Endereco,
  id: string
) => {
  const enviar = userRepository.mudarEnderecoUserAutenticadoRepository(
    usuarioEndereco,
    id
  );
  return enviar;
};

const logoutService = () => {
  return userRepository.logoutRepository();
};

const saveTokenService = (response: Login) => {
  return userRepository.saveTokenRepository(response);
};

const getTokenService = () => {
  return userRepository.getTokenRepository();
};

const getUserService = () => {
  return userRepository.getUserRepository();
};
const setUserService = () => {
  userRepository.setUserRepository();
};

const saveFoto=(foto:string)=>{
  userRepository.saveFoto(foto);
  return;
}
const getFoto=()=>{ 
  return userRepository.getFoto();
}
const deleteFoto=()=>{  
  userRepository.deleteFoto();
  return;
}
export {
  alterarSenhaAutenticado,
  cadastrarNovoUsuario,
  enviarPedido,
  getMeService,
  getTokenService,
  getUserService,
  logoutService,
  mudarEnderecoUserAutenticado,
  recuperarSenha,
  saveTokenService,
  setUserService,
  saveFoto,
  getFoto,
  deleteFoto
};
