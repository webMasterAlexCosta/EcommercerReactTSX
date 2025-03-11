import axios, { AxiosRequestConfig } from "axios";
import { BASE_URL_LOCAL, TOKEN_KEY } from "./system";
import * as credentialRespository from "../repository/CredenciaisRepository";

// Função para realizar a requisição ao backend
const requestBackEnd = (config: AxiosRequestConfig) => {
    // Recupera o token do repositório
    const token = credentialRespository.get(TOKEN_KEY);
   // console.log("Token recuperado:", token); // Verifique se o token é válido

    // Verifica se o token foi encontrado e adiciona o cabeçalho Authorization
    const headers = {
        ...config.headers,
        Authorization: token ? `Bearer ${token}` : undefined, // Adiciona o token ao cabeçalho
    };

   // console.log("Headers enviados:", headers); // Verifica os cabeçalhos

    // Realiza a requisição com os cabeçalhos configurados
    return axios({ ...config, baseURL: BASE_URL_LOCAL, headers });
};

// Interceptor para requisição (sem alterações específicas)
axios.interceptors.request.use(
    function(config) {
        return config;
    },
    function(error) {
        return Promise.reject(error);
    }
);

// Interceptor para resposta
axios.interceptors.response.use(
    function(response) {
        return response;
    },
    function(error) {
        if (error.response) {
            if (error.response.status === 401) {
                // Redireciona para a página de login se a autenticação falhar
                window.location.href = "/login";
            }

            if (error.response.status === 403) {
                // Redireciona para o catálogo caso o acesso seja proibido
                window.location.href = "/catalogo";
            }
        }
        return Promise.reject(error);
    }
);

export default requestBackEnd;
