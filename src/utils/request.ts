import axios, { AxiosRequestConfig } from "axios";
import { BASE_URL_LOCAL, TOKEN_KEY } from "./system";
import * as credentialRespository from "../repository/CredenciaisRepository";

const requestBackEnd = (config: AxiosRequestConfig) => {
    const token = credentialRespository.get(TOKEN_KEY);
    const headers = {
        ...config.headers,
        Authorization: token ? `Bearer ${token}` : undefined,
    };

 
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
               
               // console.warn("⚠️ Erro 401: Não autorizado");
                // Agora, em vez de recarregar a página, apenas rejeitamos a Promise
                return Promise.reject(error);
            }

            if (error.response.status === 403) {
              //  console.warn("⛔ Erro 403: Acesso negado");
            
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);

export default requestBackEnd;
