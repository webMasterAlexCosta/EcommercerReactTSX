import { RECUPERAR_SENHA, TOKEN_KEY } from "../utils/system"

import requestBackEnd from "../utils/request"
import { AxiosRequestConfig } from "axios"

const logout=()=>{
    return localStorage.removeItem(TOKEN_KEY)
}
const save=(token:string)=>{
    return localStorage.setItem(TOKEN_KEY,token)
}

const get=(TOKEN_KEY:string)=>{
    return localStorage.getItem(TOKEN_KEY)
}
 const recuperarSenha = (email: string,cpf:string) => {
    const config: AxiosRequestConfig = {
      method: "POST",
      url: RECUPERAR_SENHA,
      data: { email ,cpf},
    };
  
    return requestBackEnd(config);
  };
export {logout,save,get,recuperarSenha}