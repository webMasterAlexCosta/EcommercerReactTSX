import {  storageCarrinho } from "../utils/system";
import { CarrinhoItem } from "../models/dto/CarrinhoDTO";
import * as carrinhoRepoitory from "../repository/CarrinhoRepository"


const getCarrinho = (): CarrinhoItem[] => {
    const carrinho = localStorage.getItem(storageCarrinho);
    return carrinho ? JSON.parse(carrinho) : [];
};



const setCarrinho = (value: CarrinhoItem[]) => {
    return carrinhoRepoitory.setCarrinho( value);
};


const removeCarrinho = () => {
    return localStorage.removeItem(storageCarrinho);
};




export { getCarrinho, setCarrinho, removeCarrinho };
