import { CadastroUserDTO } from "../models/dto/CadastroUserDTO";
import { Endereco, Login } from "../models/dto/CredenciaisDTO";
import * as userRepository from "../repository/UserRepository";


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
  return await userRepository.enviarPedido();
 
};
  
  
const alterarSenhaAutenticado = async (
  
  antigaSenha: string,
  novaSenha: string
) => {
  return userRepository.alterarSenhaAutenticado(antigaSenha,novaSenha)
 
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
