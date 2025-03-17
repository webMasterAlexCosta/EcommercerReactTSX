import { useState } from "react";

interface Estado {
  email: string;
  cpf: string;
}

export const validateCpf = (cpf: string) => {
  const cpfVerificado = /^\d{11}$/;
  return cpfVerificado.test(cpf);
};

export const validateTelefone = (telefone: string) => {
  const tel = /^\d{11}$/;
  return tel.test(telefone);
};


export const useHandleOnChange = (initialState: Estado) => {
  const [estado, setEstado] = useState<Estado>(initialState);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    const newValue = name === "cpf" || name === "telefone" ? value.replace(/[^0-9]/g, "") : value;

    setEstado((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));
  };

  return { estado, handleOnChange  };
};
