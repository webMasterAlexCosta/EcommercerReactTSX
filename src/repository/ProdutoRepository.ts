import axios from "axios";
import { BASE_URL_LOCAL } from "../utils/system";

const findAll = async (page?: number) => {
  try {
    const url = page !== undefined 
      ? `${BASE_URL_LOCAL}/produtos/paginas?page=${page}&size=8` 
      : `${BASE_URL_LOCAL}/produtos/lista`; 

    const listaProduto = await axios.get(url);
    return listaProduto;
    
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    throw error;
  }
};

const findById = async (id: number) => {
  try {
    const produtoId = await axios.get(`${BASE_URL_LOCAL}/produtos/${id}`);
    return produtoId;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const getLocalStorage = async (key: string) => {
  return localStorage.getItem(key);
};

const setLocalStorage = async (key: string, value: string) => {
  return localStorage.setItem(key, value);
};

export { findAll, findById, getLocalStorage, setLocalStorage };
