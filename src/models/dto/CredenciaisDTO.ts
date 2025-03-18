import { EnderecoDTO } from "./UserDTO";

export interface CredenciaisDTO{
    email:string;
    senha:string;
}
export type perfil = "CLIENT" | "ADMIN";


export interface AccessTokenPayloadDTO{
    id?:string;
    nome:string;
    email:string;
    telefone?:string;
    cpf?:string;
    dataNascimento?:string;
    perfis:perfil[];
    exp:number;
    endereco:EnderecoDTO;
    fotoPerfil?:string
}