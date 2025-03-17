import { AxiosRequestConfig, AxiosResponse } from "axios";
import { CadastroUserDTO } from "../models/dto/CadastroUserDTO";
import * as userRepository from "../repository/UserRepository"
import { ENVIAR_PEDIDO } from "../utils/system";
import requestBackEnd from "../utils/request";
import { CarrinhoItem, PedidoData, PedidoItem } from "../models/dto/CarrinhoDTO";
import { getCarrinho } from "../services/CarrinhoService";


const findMe = async () => {
    return userRepository.findMe();
};

const recuperarSenha = (email: string,cpf:string) => {
    return userRepository.recuperarSenha(email,cpf);
  };
  const cadastrarNovoUsuario = (formData:CadastroUserDTO)=>{
        return userRepository.cadastrarNovoUsuario(formData);
  }
  const enviarPedido = async (): Promise<AxiosResponse<unknown>> => {
    const carrinhoAtual: CarrinhoItem[] = getCarrinho();

    if (carrinhoAtual.length === 0) {
        return Promise.reject("Carrinho está vazio");
    }

    try {
        const data: PedidoData = {
            items: carrinhoAtual.map((item: CarrinhoItem): PedidoItem => ({
                id: item.id,
                nome: item.nome,
                preco: item.preco,
                descricao: item.descricao,
                imgUrl: item.imgUrl,
                quantidade: item.quantidade,
                categorias: item.categorias || [],
                subTotal: (item.preco * item.quantidade)
            }))
        };

        const config: AxiosRequestConfig = {
            method: "POST",
            url: ENVIAR_PEDIDO,
            headers: { "Content-Type": "application/json" },
            data,
        };

        const enviado = await requestBackEnd(config);
        

        if (enviado.status === 200 || enviado.status === 201) {
            const numeroPedido = (enviado.data.numeroPedido); // Captura o número do pedido
            console.log("Número do Pedido:", numeroPedido); // Confirmação no console

            return enviado;
        }

        return Promise.reject("Falha ao enviar o pedido");
    } catch (error) {
        console.error("Erro ao enviar o pedido:", error);
        return Promise.reject("Erro ao enviar o pedido");
    }
};
export {findMe ,recuperarSenha, cadastrarNovoUsuario ,enviarPedido}