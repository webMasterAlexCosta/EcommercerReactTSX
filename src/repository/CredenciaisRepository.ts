import { Login } from "../models/dto/CredenciaisDTO";
import { DADOS_USER, TOKEN_KEY } from "../utils/system";

const logout = () => {
  sessionStorage.removeItem(DADOS_USER);
  return localStorage.removeItem(TOKEN_KEY);
};
const save = (response: Login) => {
  sessionStorage.setItem(
    DADOS_USER,
    JSON.stringify({
      nome: response.user.nome,
      email: response.user.email,
      telefone: response.user.telefone,
      dataNascimento: response.user.dataNascimento,
      perfis: response.user.perfis,
      endereco:response.user.endereco
    })
  );

  return localStorage.setItem(TOKEN_KEY, response.token);
};

const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

const getUser = () => {
  const dados = sessionStorage.getItem(DADOS_USER);
  if (dados !== null) {
    return JSON.parse(dados);
  }
  return null;


};

export { logout, save, getToken, getUser };
