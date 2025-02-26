import { Categorias } from './Categoria';

export class Produtos {
    private id: number;
    private nome: string;
    private preco: number;
    private descricao: string;
    private imgUrl: string
    private quantidade:number
    private categorias: Categorias[]

    constructor(
        id: number,
        nome: string,
        preco: number,
        descricao: string,
        imgUrl: string,
        quantidade:number,
        categorias: Categorias[] = []
    ) {
        this.id = id;
        this.nome = nome;
        this.preco = preco;
        this.descricao = descricao;
        this.imgUrl = imgUrl;
        this.quantidade=quantidade
        this.categorias = categorias.length > 0 ? categorias : [new Categorias(0, "")];
    }

    getId = () => this.id
    getNome = () => this.nome
    getPreco = () => this.preco
    getDescricao = () => this.descricao
    getImgUrl = () => this.imgUrl
    getQuantidade=()=> this.quantidade
    getCategoria = () => {
        return (this.categorias.map(item => [
            item.getId(),
            item.getNome()
        ]
        ));
    }

}