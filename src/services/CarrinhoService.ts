import {  storageCarrinho } from "../utils/system";
import { CarrinhoItem } from "../models/dto/CarrinhoDTO";
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



export { getCarrinho, setCarrinho, removeCarrinho };
