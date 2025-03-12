export interface CarrinhoItem {
    id: number;
    nome: string;
    preco: number;
    descricao: string;
    imgUrl: string;
    quantidade: number;
    categorias?: string[];
}

export interface PedidoData {
    items: {
        id: number;
        nome: string;
        preco: number;
        descricao: string;
        imgUrl: string;
        quantidade: number;
        categorias: string[];
        subTotal: string;
    }[];
}
export interface PedidoFeito {
    id: number|null;
    numeroPedido: string;
    momento: string;
    statusPedido: string;
}

export  interface PedidoItem {
    id: number;
    nome: string;
    preco: number;
    descricao: string;
    imgUrl: string;
    quantidade: number;
    categorias: string[];
    subTotal: string;
  }