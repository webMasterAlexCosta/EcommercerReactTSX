import { AxiosRequestConfig } from "axios";
import requestBackEnd from "../utils/request";
import { CADASTRO_NOVO_USUARIO, RECUPERAR_SENHA } from "../utils/system";
import { CadastroUserDTO } from "../models/dto/CadastroUserDTO";


const findMe = async () => {
  const config : AxiosRequestConfig={
    url:"/users/me",
    withCredentials:true
    
  }
    
    try {
      const response=await requestBackEnd(config)
      
      return response
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  const recuperarSenha = async (email: string, cpf: string) => {
    
      const config: AxiosRequestConfig = {
        method: "POST",
        url: RECUPERAR_SENHA,
        data: { email, cpf },
        
      };
  
      const response = await requestBackEnd(config);
  
     
      return response;
    
  };
  


  const cadastrarNovoUsuario =async (FormData:CadastroUserDTO)=>{
    try{
      const config : AxiosRequestConfig={
        method : "POST",
        url: CADASTRO_NOVO_USUARIO,
        data:FormData
      }
      const response = await requestBackEnd(config)
      return response
    }catch(error){
      console.error("Ocorreu um erro ao realistar cadastro" , error)
      throw new Error ("Erro ao realizar cadastro")
    }
  }

  export {findMe , recuperarSenha,cadastrarNovoUsuario}