import { AxiosRequestConfig, AxiosResponse } from "axios";
import { ENVIAR_PEDIDO, storageCarrinho } from "../utils/system";
import requestBackEnd from "../utils/request";
import { CarrinhoItem, PedidoData, PedidoItem } from "../models/dto/CarrinhoDTO";
import * as carrinhoRepoitory from "../repository/CarrinhoRepository"

// Funções para manipulação do carrinho no localStorage

const getCarrinho = (): CarrinhoItem[] => {
    const carrinho = localStorage.getItem(storageCarrinho);
    return carrinho ? JSON.parse(carrinho) : []; // Sempre retorna um array
};



const setCarrinho = (value: CarrinhoItem[]) => {
    return carrinhoRepoitory.setCarrinho( value);
};


const removeCarrinho = () => {
    return localStorage.removeItem(storageCarrinho);
};

// Função para enviar o pedido com o formato JSON correto
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
                subTotal: (item.preco * item.quantidade).toFixed(2)
            }))
        };

        const config: AxiosRequestConfig = {
            method: "POST",
            url: ENVIAR_PEDIDO,
            headers: { "Content-Type": "application/json" },
            data,
        };

        const enviado = await requestBackEnd(config);
        console.log(enviado.data);

        if (enviado.status === 200 || enviado.status === 201) {
            console.log("Pedido enviado com sucesso");
            return enviado;
        }

        return Promise.reject("Falha ao enviar o pedido");
    } catch (error) {
        console.error("Erro ao enviar o pedido:", error);
        return Promise.reject("Erro ao enviar o pedido");
    }
};


export { getCarrinho, setCarrinho, removeCarrinho, enviarPedido };
