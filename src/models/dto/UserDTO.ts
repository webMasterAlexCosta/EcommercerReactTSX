export interface EnderecoDTO {
    id: number;
    logradouro: string;
    cep: string;
    numero: number;
    cidade: string;
    bairro: string;
    complemento: string;
    uf: string;
  }
  
  export interface UserDTO {
    id: string;
    nome: string;
    email: string;
    telefone: string;
    dataNascimento: string;
    perfil: string[];
    endereco: EnderecoDTO;
  }
  