import { createContext } from "react";

interface IContextCartCount {
  contextCartCount: number;
  setContextCartCount: React.Dispatch<React.SetStateAction<number>>; 
}

const ContextCartCount = createContext<IContextCartCount>({
  contextCartCount: 0,  
  setContextCartCount: () => {},  
});

export default ContextCartCount;
