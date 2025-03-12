import {  storageCarrinho } from "../utils/system";
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


export { getCarrinho, setCarrinho, removeCarrinho };
