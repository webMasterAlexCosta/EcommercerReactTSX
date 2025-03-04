import { BASE_URL_LOCAL, storageCarrinho } from "../utils/system";
import * as produtoRepository from "../repository/ProdutoRepository";
import axios, { AxiosRequestConfig } from "axios";

const findAll = async (page?: number) => {
  try {
    return produtoRepository.findAll(page);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
//posso usar esse serviço tambem
const findPageRequest=(pagina:number, nome:string,tamanho = 8,sort="nome")=>{
    const config : AxiosRequestConfig = {
      method:"GET",
      baseURL : BASE_URL_LOCAL,
      url: "/produtos/paginas",
      params:{
        page : pagina,
        name : nome,
        size : tamanho,
        sort : sort
      }
    }
    return axios(config)
}


const findById = async (id: number) => {
  try {
    return produtoRepository.findById(id);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const findByRequest = async (item: string) => {
  try {
    return produtoRepository.findByRequest(item);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const subTotal = async (id: number) => {
  const prod: string | null = await produtoRepository.getLocalStorage(storageCarrinho);
  if (!prod) {
    throw new Error("No products found in local storage");
  }
  const parsedProd = JSON.parse(prod);
  const resul = parsedProd.find((item: { id: number }) => item.id == id);
  if (!resul) {
    throw new Error("Product not found");
  }
  return resul.preco * resul.quantidade;
};





export { findAll, findById, findByRequest,subTotal,findPageRequest};
    

