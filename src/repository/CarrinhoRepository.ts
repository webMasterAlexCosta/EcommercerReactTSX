import { AxiosRequestConfig, AxiosResponse } from "axios"
import {storageCarrinho} from "../utils/system"
import requestBackEnd from "../utils/request"

const getCarrinho=()=>{
    return localStorage.getItem(storageCarrinho)
  }
  
  const setCarrinho=(key:string , value:string)=>{
    return localStorage.setItem(key,value)
  }
  
  const removeCarrinho = (key:string)=>{
    return localStorage.removeItem(key)
  }


  const enviarPedido = async (): Promise<AxiosResponse<unknown>> => {
  const carrinhoAtual = JSON.parse(getCarrinho() || "{}");
  console.log(carrinhoAtual);

  if (carrinhoAtual != null) {
    const config: AxiosRequestConfig = {
      method: "POST",
      url: "/pedidos/finalizar",
      data: carrinhoAtual,
    };

    try {
      const enviado = await requestBackEnd(config);

      if (enviado.status === 500) {
        console.log("Erro no servidor");
        return Promise.reject("Erro no servidor");
      }

      if (enviado.status === 200 || enviado.status === 201) {
        console.log("Pedido enviado com sucesso");
        return enviado;
      }

      // Em caso de falha, também retornar uma Promise rejeitada
      return Promise.reject("Falha ao enviar o pedido");
    } catch (error) {
      console.log("Erro ao enviar o pedido:", error);
      return Promise.reject("Erro ao enviar o pedido");
    }
  }

  return Promise.reject("Carrinho está vazio");
};



export {getCarrinho,setCarrinho,removeCarrinho,enviarPedido}