import { useState } from "react";

interface IRedefinicaoSenha {
  email: string;
  cpf: string;
}
interface IAlterarSenhaAutenticado {
  senhaAntiga: string;
  novaSenha: string;
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
