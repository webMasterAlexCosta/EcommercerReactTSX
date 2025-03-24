import { AxiosRequestConfig } from "axios";
import requestBackEnd from "../utils/request";
import { CADASTRO_NOVO_USUARIO, DADOS_USER, RECUPERAR_SENHA, TOKEN_KEY } from "../utils/system";
import { CadastroUserDTO } from "../models/dto/CadastroUserDTO";
import { Endereco, Login } from "../models/dto/CredenciaisDTO";


const getMe = async () => {
  const config : AxiosRequestConfig={
    url:"/api/users/me",
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
const mudarEnderecoUserAutenticado =(enderecoUsuario:Endereco, id:string)=>{
  const config:AxiosRequestConfig={
    method:"POST",
    url:`/api/usuarios/${id}/endereco`,
    data:enderecoUsuario,
    withCredentials:true
  }
  return requestBackEnd(config)
}

const logout = () => {
  sessionStorage.removeItem(DADOS_USER);
  return localStorage.removeItem(TOKEN_KEY);
};

const save = async (response: Login) => {
  localStorage.setItem(TOKEN_KEY, response.token);
  
   await setUser();
};

const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

const setUser = async () => {
  const usuario = await getMe();
  sessionStorage.setItem(DADOS_USER, JSON.stringify(usuario.data));
  return Promise.resolve();

};

const getUser = () => {
  const dados = sessionStorage.getItem(DADOS_USER);
  if (dados !== null) {
    return JSON.parse(dados);
  }
  return null;
};

  export {getMe,getUser,getToken,setUser ,save,logout, recuperarSenha,cadastrarNovoUsuario,mudarEnderecoUserAutenticado}