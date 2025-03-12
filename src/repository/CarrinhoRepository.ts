import { AxiosRequestConfig, AxiosResponse } from "axios";
import { ENVIAR_PEDIDO, storageCarrinho } from "../utils/system";
import requestBackEnd from "../utils/request";
import { CarrinhoItem } from "../models/dto/CarrinhoDTO";

// Funções para manipulação do carrinho no localStorage
const getCarrinho = () => {
    return localStorage.getItem(storageCarrinho);
};

const setCarrinho = (value: CarrinhoItem[]) => {
    return localStorage.setItem(storageCarrinho, JSON.stringify(value));
};


const removeCarrinho = (key: string) => {
    return localStorage.removeItem(key);
};

// Função para enviar o pedido
const enviarPedido = async (): Promise<AxiosResponse<unknown>> => {
    // Pega os dados do carrinho e converte de string para objeto
    const carrinhoAtual = getCarrinho();
   // console.log("Carrinho atual:", carrinhoAtual);

    // Se o carrinho não estiver vazio
    if (carrinhoAtual != null && carrinhoAtual !== "[]") {
        try {
            // Converte o carrinho de volta para objeto
            const carrinhoObjeto = JSON.parse(carrinhoAtual);
            console.log(carrinhoObjeto)
            // Configuração da requisição
            const config: AxiosRequestConfig = {
                method: "POST",
                url: ENVIAR_PEDIDO,
                headers: {
                    "Content-Type": "application/json", // Define que o corpo será em JSON
                    // Se necessário, adicione outros cabeçalhos, como autenticação
                },
                data: carrinhoObjeto, // Dados a serem enviados para o backend
            };

            // Envia o pedido
            const enviado = await requestBackEnd(config);
            
            // Verifica o status da resposta
            if (enviado.status === 500) {
            //    console.log("Erro no servidor");
                return Promise.reject("Erro no servidor");
            }

            if (enviado.status === 200 || enviado.status === 201) {
               console.log(enviado);
                return enviado;
            }

            // Caso falhe ao enviar o pedido
            return Promise.reject("Falha ao enviar o pedido");
        } catch (error) {
            console.log("Erro ao enviar o pedido:", error);
            return Promise.reject("Erro ao enviar o pedido");
        }
    }

    return Promise.reject("Carrinho está vazio");
};

export { getCarrinho, setCarrinho, removeCarrinho, enviarPedido };
