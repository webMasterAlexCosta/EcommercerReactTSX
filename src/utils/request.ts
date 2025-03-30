import axios, { AxiosRequestConfig } from "axios";
import Swal from "sweetalert2";
import {
  BASE_URL_LOCAL,
  FOTO_PERFIL_LINK,
  PRODUTO_KEY,
  TOKEN_KEY,
} from "./system";
import { getTokenService } from "../services/UserServices";
import { isAuthenticated } from "../services/AuthService";

const requestBackEnd =async (config: AxiosRequestConfig) => {
  const token =await  getTokenService();
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
  async function (error) {
    if (await isAuthenticated()) {
   //   window.location.href = "/login";
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(FOTO_PERFIL_LINK);
      localStorage.removeItem(PRODUTO_KEY);
      sessionStorage.clear();
    }
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
     //  window.location.reload();
      }, 3000);
    } else {
      Swal.fire({
        title: "Erro inesperado!",
        text: "Ocorreu um erro inesperado. Tente novamente mais tarde.",
        icon: "error",
        confirmButtonText: "OK",
      });
      setTimeout(() => {
    //    window.location.reload();
      }, 3000);
    }
    /*
        caso eu queria propagar o erro pro catch do codigo uso
        Promisse.resolve(error)
        */
    return Promise.reject(error);
  }
);

export default requestBackEnd;
