import axios from "axios";
import { BASE_URL_LOCAL } from "../utils/system";

const findAll = async (page?: number) => {
  try {
    const url = page !== undefined 
      ? `${BASE_URL_LOCAL}/produtos/paginas?page=${page}&size=8` 
      : `${BASE_URL_LOCAL}/produtos/lista`;

    return await axios.get(url);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    throw error;
  }
};

const findById = async (id: number) => {
  try {
    const prod=await axios.get(`${BASE_URL_LOCAL}/produtos/${id}`);
    console.log(prod)
    return prod
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const findByRequest = async (item: string) => {
  try {
    const prod = await axios.get(`${BASE_URL_LOCAL}/produtos/buscar?nome=${item}`);
   console.log(prod)
    return prod
  } catch (error) {
    console.error(error);
    throw error;
  }
};
const getLocalStorage = async (key: string) => {
  return localStorage.getItem(key);
};

const setLocalStorage = async (key: string, value: string) => {
  return localStorage.setItem(key, value);
};
const removeLocalStorage=async(key:string)=>{
  return localStorage.removeItem(key)
}

export { findAll, findById,findByRequest, getLocalStorage, setLocalStorage,removeLocalStorage };
