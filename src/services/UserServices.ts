import { AxiosRequestConfig } from "axios";
import { CadastroUserDTO } from "../models/dto/CadastroUserDTO";
import {  CarrinhoItem, PedidoData, PedidoItem,} from "../models/dto/CarrinhoDTO";
import { Endereco, Login } from "../models/dto/CredenciaisDTO";
import * as userRepository from "../repository/UserRepository";
import * as authService from "../services/AuthService";
import { getCarrinho } from "../services/CarrinhoService";
import requestBackEnd from "../utils/request";
import { ALTERAR_SENHA_AUTENTICADO, ENVIAR_PEDIDO } from "../utils/system";
import CriptografiaAES from "../models/domain/CriptografiaAES";


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
const enviarPedido = async () => {
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
};
  
  
const alterarSenhaAutenticado = async (
  antigaSenha: string,
  novaSenha: string
) => {
  if (await authService.isAuthenticated()) {
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

const obterHistoricoPedidoService = async () => {
  const response = await userRepository.obterHistoricoPedidoRepository();
  return response;
};

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
  obterHistoricoPedidoService,
  
};
