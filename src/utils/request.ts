import axios, { AxiosRequestConfig } from "axios";
import { BASE_URL_LOCAL } from "./system";

const requestBackEnd=(config :AxiosRequestConfig)=>{
    return axios({...config ,baseURL: BASE_URL_LOCAL})
}
export default requestBackEnd