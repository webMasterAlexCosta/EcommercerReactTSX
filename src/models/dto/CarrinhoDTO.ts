import { EnderecoDTO } from "./UserDTO";

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
        subTotal: number;
    }[];
}

export interface PedidoHistorico{
    momento:string,
    statusPedido:string,
    numeroPedido:string,
    client:{
        nome:string
        email:string,
        telefone:string,
        dataNascimento:string,
        endereco:EnderecoDTO[]
    },
    items:[{
        preco:number,
        quantidade:number
        imgUrl:string,
        subTotal:number
    }],
    total:number

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
    subTotal: number;
  }