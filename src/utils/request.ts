import axios, { AxiosRequestConfig } from "axios";
import { BASE_URL_LOCAL, TOKEN_KEY } from "./system";
import * as credentialRespository from "../repository/CredenciaisRepository"
const requestBackEnd=(config :AxiosRequestConfig)=>{
    const headers=config.withCredentials
    ?
    {
        ...config.headers,
        Authorization: "Bearer "+ credentialRespository.get(TOKEN_KEY)
    }
    : 
    config.headers

    return axios({...config ,baseURL: BASE_URL_LOCAL,headers})
}
export default requestBackEnd