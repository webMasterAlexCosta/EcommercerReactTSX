import axios, { AxiosRequestConfig } from "axios";
import Swal from "sweetalert2";
import { BASE_URL_LOCAL } from "./system";
import * as credentialRespository from "../repository/CredenciaisRepository";

const requestBackEnd = (config: AxiosRequestConfig) => {
  const token = credentialRespository.getToken();
  const headers = {
    ...config.headers,
    Authorization: token ? `Bearer ${token}` : undefined,
  };

  return axios({ ...config, baseURL: BASE_URL_LOCAL, headers });
};

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (axios.isAxiosError(error) && error.response) {
      const mensagemErro =
        error.response.data?.message ||
        error.response.data?.trace ||
        error.response.data?.error ||
        "Ocorreu um erro ao tentar processar a solicitação.";

      if (error.response.status === 401) {
      
        credentialRespository.logout();  
        Swal.fire({
          title: "Sessão expirada!",
          text: "Sua sessão expirou, por favor, faça login novamente.",
          icon: "warning",
          confirmButtonText: "OK",
        }).then(() => {
          window.location.href = "/login";
        });
      } else {
        Swal.fire({
          title: "Erro!",
          text: mensagemErro,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } else {
      Swal.fire({
        title: "Erro inesperado!",
        text: "Ocorreu um erro inesperado. Tente novamente mais tarde.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }

    return Promise.reject(error);
  }
);

export default requestBackEnd;
