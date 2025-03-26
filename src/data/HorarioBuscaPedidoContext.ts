import  { createContext} from "react";

interface BuscaContextType {
  horarioBusca: Date;
  setHorarioBusca: (horario: Date) => void;
  ultimaBusca: Date;
  setUltimaBusca: (time: Date) => void;
}

const HorarioBuscaPedidoContext = createContext<BuscaContextType>({
  horarioBusca: new Date(),
  setHorarioBusca: () => {},
  ultimaBusca: new Date(),
  setUltimaBusca: () => {}
});
export {HorarioBuscaPedidoContext}