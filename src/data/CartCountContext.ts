import { createContext } from "react";

// Tipagem do contexto para garantir que contextCartCount seja um número e setContextCartCount seja uma função setter.
interface IContextCartCount {
  contextCartCount: number;
  setContextCartCount: React.Dispatch<React.SetStateAction<number>>;  // Usando o tipo correto para setter
}

// Criando o contexto com valores padrão.
const ContextCartCount = createContext<IContextCartCount>({
  contextCartCount: 0,  // Valor inicial de contextCartCount
  setContextCartCount: () => {},  // Função vazia como valor inicial
});

export default ContextCartCount;
