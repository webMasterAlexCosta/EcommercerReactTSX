import {  storageCarrinho } from "../utils/system";
import { CarrinhoItem } from "../models/dto/CarrinhoDTO";

const getCarrinho = () => {
    return localStorage.getItem(storageCarrinho);
};

const setCarrinho = (value: CarrinhoItem[]) => {
    return localStorage.setItem(storageCarrinho, JSON.stringify(value));
};


const removeCarrinho = () => {
    return localStorage.removeItem(storageCarrinho);
};



export { getCarrinho, setCarrinho, removeCarrinho };
