export interface EnderecoDTO {
  id?: number;
  uf: string;
  cidade: string;
  complemento: string;
  numero: number;
  logradouro: string;
  bairro: string;
  cep: string;
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
