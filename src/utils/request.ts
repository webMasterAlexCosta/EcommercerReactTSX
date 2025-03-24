import axios, { AxiosRequestConfig } from "axios";
import Swal from "sweetalert2"; 
import { BASE_URL_LOCAL } from "./system";
import * as userService from "../services/UserServices";

const requestBackEnd = (config: AxiosRequestConfig) => {
  const token = userService.getTokenService();
  const headers = {
    ...config.headers,
    Authorization: token ? `Bearer ${token}` : undefined,
  };

  return axios({ ...config, baseURL: BASE_URL_LOCAL, headers });
};

let errorAlreadyShown = false;

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (axios.isAxiosError(error) && error.response) {
      const statusCode = error.response.status;

      if (statusCode === 401) {
        if (!errorAlreadyShown) {
          errorAlreadyShown = true; 
          userService.logoutService()
          Swal.fire({
            title: "Erro de Autenticação!",
            text: "Você precisa estar logado para acessar esta página. Redirecionando para o login...",
            icon: "error",
            confirmButtonText: "OK",
          }).then(() => {
            setTimeout(() => {
              window.location.href = "/login";
            }, 1000); 
          });
        }
      } else {
        if (!errorAlreadyShown) {
          errorAlreadyShown = true;

          const mensagemErro =
            error.response.data?.message ||
            error.response.data?.trace ||
            error.response.data?.error ||
            "Ocorreu um erro ao tentar processar a solicitação.";

          Swal.fire({
            title: "Erro!",
            text: mensagemErro,
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    } else {
      if (!errorAlreadyShown) {
        errorAlreadyShown = true;
        Swal.fire({
          title: "Erro inesperado!",
          text: "Ocorreu um erro inesperado. Tente novamente mais tarde.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }

    return Promise.resolve(error); 
  }
);



export default requestBackEnd;
