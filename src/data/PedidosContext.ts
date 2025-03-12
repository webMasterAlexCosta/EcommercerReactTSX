import { createContext } from "react";
import { PedidoFeito } from "../models/dto/CarrinhoDTO"; // Ajuste o caminho conforme necessário

interface PedidoContextType {
    pedidoContext: PedidoFeito | null;
    setPedidoContext: (pedido: PedidoFeito) => void;
}

const PedidoContext = createContext<PedidoContextType>({
    pedidoContext: null,
    setPedidoContext: () => {}
});

export default PedidoContext;
