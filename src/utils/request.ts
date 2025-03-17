import axios, { AxiosRequestConfig } from "axios";
import Swal from "sweetalert2"; // Importa SweetAlert2
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

// Interceptor de resposta para tratar erros e exibir Swal.fire automaticamente
axios.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        if (axios.isAxiosError(error) && error.response) {
            const mensagemErro =
                error.response.data?.trace || 
                error.response.data?.error || 
                error.response.data?.message || 
                "Ocorreu um erro ao tentar processar a solicitação.";

            // Exibe o alerta com SweetAlert2
            Swal.fire({
                title: "Erro!",
                text: mensagemErro,
                icon: "error",
                confirmButtonText: "OK",
            });
            setTimeout(()=>{
                window.location.reload()
            },3000)
        } else {
            Swal.fire({
                title: "Erro inesperado!",
                text: "Ocorreu um erro inesperado. Tente novamente mais tarde.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
        /*
        caso eu queria propagar o erro pro catch do codigo uso
        Promisse.resolve(error)
        */
        return Promise.reject(error); // trato o erro para ser tratado no código se necessário
    }
);

export default requestBackEnd;
