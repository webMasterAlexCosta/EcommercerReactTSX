import axios from "axios"
import { BASE_URL_LOCAL, storageCarrinho } from "../utils/system"

const findAll = async () => {
   try{
    const listaProduto =await axios.get(`${BASE_URL_LOCAL}/produtos/lista`)
    return listaProduto
   }catch(error){
    console.log(error)
    throw error
   }
}

const findById = async (id: number) => {
    try {
        const produtoId = await axios.get(`${BASE_URL_LOCAL}/produtos/${id}`);
        return produtoId

    } catch (error) {
        console.log(error);
        throw error;

    }
};

const subTotal=(id:number)=>{
    const prod: string | null = localStorage.getItem(storageCarrinho);
    if (!prod) {
        throw new Error("No products found in local storage");
    }
    const parsedProd = JSON.parse(prod);
    const resul = parsedProd.find((item: { id: number }) => item.id == id);
    if (!resul) {
        throw new Error("Product not found");
    }
    return resul.preco * resul.quantidade;
    
}

export { findAll, findById, subTotal }