import axios, { AxiosResponse } from "axios";
import { useState } from "react";

interface IRedefinicaoSenha {
  email: string;
  cpf: string;
}
interface IAlterarSenhaAutenticado {
  senhaAntiga: string;
  novaSenha: string;
}
export interface ViaCepResponse {
  cep?:string
  erro?: boolean;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
}
export const validateCpf = (cpf: string) => {
  const cpfVerificado = /^\d{11}$/;
  return cpfVerificado.test(cpf);
};

export const validateTelefone = (telefone: string) => {
  const tel = /^\d{11}$/;
  return tel.test(telefone);
};

export const useHandleOnChange = (initialState: IRedefinicaoSenha) => {
  const [redefinicaoSenha, setRedefinicaoSenha] =
    useState<IRedefinicaoSenha>(initialState);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    const newValue =
      name === "cpf" || name === "telefone"
        ? value.replace(/[^0-9]/g, "")
        : value;

    setRedefinicaoSenha((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));
  };

  return { redefinicaoSenha, handleOnChange };
};

export const useHandleOnChangeAutenticado = (
  initialState: IAlterarSenhaAutenticado
) => {
  const [alterarSenhaAutenticado, setAlterarSenhaAutenticado] =
    useState<IAlterarSenhaAutenticado>(initialState);

  const handleOnChangeAutenticado = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setAlterarSenhaAutenticado((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return { alterarSenhaAutenticado, handleOnChangeAutenticado };
};

export interface IPasswordVisibilityState {
  senhaAntiga?: boolean;
  novaSenha?: boolean;
  senha?: boolean;
}

export const PasswordVisibility = <K extends keyof IPasswordVisibilityState>(
  value: K,
  setPasswordVisible: React.Dispatch<
    React.SetStateAction<IPasswordVisibilityState>
  >
) => {
  setPasswordVisible((prevState) => ({
    ...prevState,
    [value]: !prevState[value],
  }));
};

export const formatTelefoneParaSalvar = (telefone: string): string => {

  return telefone.replace(/\D/g, '');
};

export const formatTelefoneParaExibicao = (telefone: string): string => {
  if (!telefone) return '';
  const numericValue = telefone.replace(/\D/g, '');

  if (numericValue.length <= 2) {
    return `(${numericValue}`;
  } else if (numericValue.length <= 6) {
    return `(${numericValue.slice(0, 2)}) ${numericValue.slice(2, 6)}`;
  } else if (numericValue.length <= 10) {
    return `(${numericValue.slice(0, 2)}) ${numericValue.slice(2, 7)}-${numericValue.slice(7, 10)}`;
  } else if (numericValue.length <= 11) {
    return `(${numericValue.slice(0, 2)}) ${numericValue.slice(2, 7)} ${numericValue.slice(7, 11)}`;
  }
  return numericValue;
};

export const ViaCepService = async (cep: string) => {

  if (cep.length === 8) {
    const response: AxiosResponse<ViaCepResponse> = await new Promise((resolve) =>
      setTimeout(() => resolve(axios.get(`https://viacep.com.br/ws/${cep}/json/`)), 1000)
    );
    return response;
  }
};