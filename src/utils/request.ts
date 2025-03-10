import axios, { AxiosRequestConfig } from "axios";
import { BASE_URL_LOCAL, TOKEN_KEY } from "./system";
import * as credentialRespository from "../repository/CredenciaisRepository";
  

const requestBackEnd = (config: AxiosRequestConfig) => {
    const headers = config.withCredentials
        ? {
            ...config.headers,
            Authorization: "Bearer " + credentialRespository.get(TOKEN_KEY),
        }
        : config.headers;

    return axios({ ...config, baseURL: BASE_URL_LOCAL, headers });
};

axios.interceptors.request.use(
    function(config) {
        
        return config; 
    },
    function(error) {
       
        return Promise.reject(error); 
    }
);

axios.interceptors.response.use(
    function(response) {
        return response; 
    },
    function(error) {
        if (error.response) {
            if (error.response.status === 401) {
                
                window.location.href="/login"; 

            }

            if (error.response.status === 403) {
               
                window.location.href="/catalogo"; 
            }
        }

        return Promise.reject(error);
    }
);

export default requestBackEnd;
