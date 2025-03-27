import { CircularProgress } from '@mui/material';
import React from 'react';
import { MdShoppingCart } from 'react-icons/md';  // Importando ícone moderno

interface ItemPedido {
    imgUrl: string;
    preco: number;
    quantidade: number;
    subTotal: number;
}

interface Pedido {
    numeroPedido: string;
    statusPedido: string;
    momento: string;
    total: number;
    items: ItemPedido[];
}

interface IPedidoUsuario {
    historicoPedidos: Pedido[];
}

const PedidoUsuario: React.FC<IPedidoUsuario> = ({ historicoPedidos }) => {
    return (
        <>
            <ul>
                {historicoPedidos.length === 0 ? (
                    <div className="no-pedidos">
                        <MdShoppingCart size={40} color="#888" />
                        <p className="no-pedidos-msg">Você ainda não tem pedidos.</p>
                    </div>
                ) : (
                    historicoPedidos.map((pedido, index) => (
                        <li key={index}>
                            <div className="pedido">
                                <h4>Pedido #{pedido.numeroPedido}</h4>
                                <p>Status: {pedido.statusPedido}</p>
                                <p>Data: {pedido.momento.replace("T", " - ").replace("Z", "")}</p>
                                <p>Total: R$ {pedido.total.toFixed(2)}</p>
                                <div>
                                    <h5>Itens do Pedido:</h5>
                                    <ul>
                                        {pedido.items.map((item, idx) => (
                                            <li key={idx}>
                                                <img
                                                    className="img-pedido"
                                                    src={item.imgUrl}
                                                    alt={item.subTotal.toString()}
                                                />
                                                <p>Preço: R$ {item.preco.toFixed(2)}</p>
                                                <p>Quantidade: {item.quantidade}</p>
                                                <p>Subtotal: R$ {item.subTotal.toFixed(2)}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </li>
                    ))
                )}:
                {!historicoPedidos&&
                <CircularProgress/>
                }
            </ul>
        </>
    );
};

export default PedidoUsuario;
