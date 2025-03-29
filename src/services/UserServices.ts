import { AxiosRequestConfig } from "axios";
import { CadastroUserDTO } from "../models/dto/CadastroUserDTO";
import {  CarrinhoItem,} from "../models/dto/CarrinhoDTO";
import { Endereco, Login } from "../models/dto/CredenciaisDTO";
import * as userRepository from "../repository/UserRepository";
import * as authService from "../services/AuthService";
import { getCarrinho } from "../services/CarrinhoService";
import requestBackEnd from "../utils/request";
import { ALTERAR_SENHA_AUTENTICADO } from "../utils/system";

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
   return await userRepository.enviarPedidoRepository(carrinhoAtual)
 
};

const alterarSenhaAutenticado = async (
  antigaSenha: string,
  novaSenha: string
) => {
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
