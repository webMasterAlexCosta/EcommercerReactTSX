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

      Swal.fire({
        title: "Erro!",
        text: mensagemErro,
        icon: "error",
        confirmButtonText: "OK",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 3000);
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
    return Promise.reject(error);
  }
);

export default requestBackEnd;
