import axios from "axios"
import { BASE_URL_LOCAL } from "../utils/system"

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

export { findAll, findById }