export class Categorias {
    private id: number;
    private nome: string

    constructor(id: number, nome: string) {
        this.id = id;
        this.nome = nome
    }

    getNome = () => this.nome

    setNome = (nome: string) => this.nome = nome

    getId = () => this.id

    setId = (id: number) => this.id = id
}


