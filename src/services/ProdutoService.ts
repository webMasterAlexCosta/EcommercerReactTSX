import { storageCarrinho } from "../utils/system";
import * as produtoRepository from "../repository/ProdutoRepository";

const findAll = async (page?: number) => {
  try {
    return produtoRepository.findAll(page);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

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

const getLocalStorage=(key:string)=>{
  return produtoRepository.getLocalStorage(key)
}

const setLocalStorage=(key:string , value:string)=>{
  return produtoRepository.setLocalStorage(key,value)
}
export { findAll, findById, findByRequest,subTotal,getLocalStorage ,setLocalStorage};
