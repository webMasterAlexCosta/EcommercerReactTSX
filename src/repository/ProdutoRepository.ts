import { AxiosRequestConfig } from "axios";
import { ProdutoDTO } from "../models/dto/ProdutosDTO";
import requestBackEnd from "../utils/request";

const findAll = async (page?: number) => {
  try {
    const url =
      page !== undefined
        ? requestBackEnd({ url: `/produtos/paginas?page=${page}&size=8` })
        : requestBackEnd({ url: `/produtos/lista` });

    return await url;
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    throw error;
  }
};

const findById = async (id: number) => {
  try {
    const prod = await requestBackEnd({ url: `/produtos/${id}` });
    //console.log(prod);
    return prod;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const findByRequest = async (item: string) => {
  try {
    const prod = await requestBackEnd({ url: `/produtos/buscar?nome=${item}` });
    console.log(prod);
    return prod;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updatedProduto = async (produto: ProdutoDTO) => {
  try {
    const config: AxiosRequestConfig = {
      method: "PUT",
      url: `/produtos/${produto.id}/atualizar`,
      data: produto,
    };
    return await requestBackEnd(config);
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
const removeLocalStorage = async (key: string) => {
  return localStorage.removeItem(key);
};

export {
  findAll,
  findById,
  findByRequest,
  getLocalStorage,
  setLocalStorage,
  removeLocalStorage,
  updatedProduto,
};
