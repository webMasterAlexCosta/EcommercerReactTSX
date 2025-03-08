import { EnderecoDTO } from "./UserDTO";

export interface CredenciaisDTO{
    email:string;
    senha:string;
}
export type perfil = "CLIENTE" | "ADMIN";


export interface AccessTokenPayloadDTO{
    nome:string;
    email:string;
    perfis:perfil[]
    exp:number
    endereco:EnderecoDTO[]
}