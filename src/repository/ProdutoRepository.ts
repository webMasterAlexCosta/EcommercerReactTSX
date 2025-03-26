import { AxiosRequestConfig } from "axios";
import { ProdutoDTO } from "../models/dto/ProdutosDTO";
import requestBackEnd from "../utils/request";
import { BUSCAR_LISTA_CATEGORIAS, CADASTRO_PRODUTO, PRODUTO_KEY } from "../utils/system";
import { isAuthenticated } from "../services/AuthService";
import { getUserService } from "../services/UserServices";

const findAll = async (page?: number) => {
  try {
    const url =
      page !== undefined
        ? requestBackEnd({ url: `/api/produtos/paginas?page=${page}&size=8` })
        : requestBackEnd({ url: `/api/produtos/lista` });

    return await url;
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    throw error;
  }
};

const findById = async (id: number) => {
  try {
    const prod = await requestBackEnd({ url: `/api/produtos/${id}` });

    return prod;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const findByRequest = async (item: string) => {
  try {
    const prod = await requestBackEnd({ url: `/api/produtos/buscar?nome=${item}` });
    console.log(prod);
    return prod;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const novoProduto = async (dto: ProdutoDTO) => {
  console.log(dto)
  alert(dto)
  const user = await getUserService();
  if (isAuthenticated() && user.perfil.includes("ADMIN")) {
    const config: AxiosRequestConfig = {
      method: "POST",
      url: CADASTRO_PRODUTO,
      data: dto,
      withCredentials: true
    }
    return await requestBackEnd(config)
  }
}

const updatedProduto = async (produto: ProdutoDTO) => {
  const user = await getUserService();
  if (isAuthenticated() && user.perfil.includes("ADMIN")) {
    const config: AxiosRequestConfig = {
      method: "PUT",
      url: `/api/produtos/${produto.id}/atualizar`,
      data: produto,
    };
    return await requestBackEnd(config);
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
const findAllCategories = async () => {
  const config: AxiosRequestConfig = {
    url: BUSCAR_LISTA_CATEGORIAS,
    withCredentials: true
  }
  return await requestBackEnd(config)
}

const deleteProduto = (id: number | undefined) => {
  const config: AxiosRequestConfig = {
    method: "DELETE",
    url: `/api/produtos/${id}/deletar`,
    withCredentials: true
  }
  return requestBackEnd(config)
}
const savarProdutoLocal = (prod: ProdutoDTO): void => {
  return localStorage.setItem(PRODUTO_KEY, JSON.stringify(prod))
}
const getProdutoLocal = () => {
  const produto = localStorage.getItem(PRODUTO_KEY);
  return produto ? JSON.parse(produto) : null;
}
const limparProdutoLocal = () => {
  localStorage.removeItem(PRODUTO_KEY)
}
export {
  findAll,
  findById,
  findByRequest,
  getLocalStorage,
  setLocalStorage,
  removeLocalStorage,
  updatedProduto,
  novoProduto,
  findAllCategories,
  deleteProduto,
  savarProdutoLocal,
  getProdutoLocal,
  limparProdutoLocal
};
