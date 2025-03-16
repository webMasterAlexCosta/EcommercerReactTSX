


export interface CadastroUserDTO {
    nome: string;
    email: string;
    telefone: string;
    dataNascimento: string;
    senha: string;
    cpf: string;
    endereco: {
        logradouro: string;
        cep: string;
        numero: string;
        cidade: string;
        bairro: string;
        complemento: string;
        uf: string;
    };
}
