import { createContext } from "react";

interface IContextCardCount {
  contextCartCount: number;
  setContextCartCount: (contextCartCount: number) => void;
}
const ContextCartCount = createContext<IContextCardCount>({
  contextCartCount: 0,
  setContextCartCount: () => {},
});
export default ContextCartCount;
