import axios, { AxiosRequestConfig } from "axios";
import { BASE_URL_LOCAL, TOKEN_KEY } from "./system";
import * as credentialRespository from "../repository/CredenciaisRepository";
import { history } from './history';  // Certifique-se de que o history está sendo importado corretamente

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
        // Esta função é chamada antes de enviar a requisição.
        return config; // Aqui, o 'config' é a configuração da requisição que pode ser modificada.
    },
    function(error) {
        // Caso ocorra um erro ao tentar configurar a requisição.
        return Promise.reject(error); // O erro é propagado.
    }
);

axios.interceptors.response.use(
    function(response) {
        // Esta função é chamada quando a resposta da requisição é recebida.
        return response; // Aqui, você pode modificar ou processar a resposta antes que ela seja retornada.
    },
    function(error) {
        if (error.response) {
            // Caso haja um erro na resposta, vamos verificar o código de status.
            if (error.response.status === 401) {
                console.log("Erro 401: Não autorizado");
                history.push("/login"); // Redirecionando para a página de login
            }

            if (error.response.status === 403) {
                console.log("Erro 403: Proibido");
                history.push("/catalogo"); // Redirecionando para o catálogo
            }
        }

        return Promise.reject(error); // O erro é propagado.
    }
);

export default requestBackEnd;
