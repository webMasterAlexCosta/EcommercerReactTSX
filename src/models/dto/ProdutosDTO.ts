
export interface CategoriasDTO {
    id: number
    nome: string
}


export interface ProdutoDTO {
    id: number;
    nome: string;
    preco: number;
    descricao: string;
    imgUrl: string
    quantidade:number
    categorias: CategoriasDTO[]
}