import { useState } from "react";

interface RedefinicaoSenha {
  email: string;
  cpf: string;
}
interface AlterarSenhaAutenticado{
  senhaAntiga:string
  novaSenha:string
}

export const validateCpf = (cpf: string) => {
  const cpfVerificado = /^\d{11}$/;
  return cpfVerificado.test(cpf);
};

export const validateTelefone = (telefone: string) => {
  const tel = /^\d{11}$/;
  return tel.test(telefone);
};


export const useHandleOnChange = (initialState: RedefinicaoSenha ) => {
  const [redefinicaoSenha, setRedefinicaoSenha] = useState<RedefinicaoSenha>(initialState);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    const newValue = name === "cpf" || name === "telefone" ? value.replace(/[^0-9]/g, "") : value;

    setRedefinicaoSenha((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));
  };

  return { redefinicaoSenha, handleOnChange  };
};


export const useHandleOnChangeAutenticado = (initialState: AlterarSenhaAutenticado ) => {
  const [alterarSenhaAutenticado, setAlterarSenhaAutenticado] = useState<AlterarSenhaAutenticado>(initialState);

  const handleOnChangeAutenticado = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    

    setAlterarSenhaAutenticado((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return { alterarSenhaAutenticado, handleOnChangeAutenticado  };
};