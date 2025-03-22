import { AxiosRequestConfig, AxiosResponse } from "axios";
import { CadastroUserDTO } from "../models/dto/CadastroUserDTO";
import * as userRepository from "../repository/UserRepository";
import { ALTERAR_SENHA_AUTENTICADO, ENVIAR_PEDIDO } from "../utils/system";
import requestBackEnd from "../utils/request";
import {
  CarrinhoItem,
  PedidoData,
  PedidoItem,
} from "../models/dto/CarrinhoDTO";
import { getCarrinho } from "../services/CarrinhoService";
import * as authService from "../services/AuthService"
import { Endereco } from "../models/dto/CredenciaisDTO";


const getMe = async () => {
  return userRepository.getMe();
};

const recuperarSenha = (email: string, cpf: string) => {
  return userRepository.recuperarSenha(
    email.toString().toLowerCase(),
    cpf.toString()
  );
};

const cadastrarNovoUsuario = (formData: CadastroUserDTO) => {
  return userRepository.cadastrarNovoUsuario(formData);
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

const alterarSenhaAutenticado=(antigaSenha:string , novaSenha:string)=>{
      if(authService.isAuthenticated()){
        const email = authService.getUser()?.email;
      
        const config: AxiosRequestConfig={
          method:"POST",
          url:ALTERAR_SENHA_AUTENTICADO,
          headers: { "Content-Type": "application/json" },
          withCredentials:true,
          
          data:{antigaSenha,novaSenha,email}
        }
        console.log(config)
        return requestBackEnd(config)  
      }
        

}
const mudarEnderecoUserAutenticado=(usuarioEndereco:Endereco,id:string)=>{
const enviar = userRepository.mudarEnderecoUserAutenticado(usuarioEndereco,id)
  return enviar
}

export { getMe, recuperarSenha, cadastrarNovoUsuario, enviarPedido,alterarSenhaAutenticado,mudarEnderecoUserAutenticado };
