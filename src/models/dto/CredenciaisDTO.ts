
export interface CredenciaisDTO{
    email:string;
    senha:string;
}
export type perfil = "CLIENTE" | "ADMIN";


export interface AccessTokenPayloadDTO{
    sub:string;
    exp:number;
    iss:string
}
export interface Endereco {
    id?: number;
    logradouro: string;
    cep: string;
    numero: number;
    cidade: string;
    bairro: string;
    complemento: string;
    uf: string;
  }
  
   export interface Usuario {
    id?:string
    nome: string;
    email: string;
    telefone: string;
    dataNascimento: string;
    perfil: perfil[];
    endereco: Endereco;
  }
  
  export interface Login {
    token: string;
  }
  
 