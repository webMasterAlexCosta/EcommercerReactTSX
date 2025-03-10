import { CadastroUserDTO } from "../models/dto/CadastroUserDTO";
import * as userRepository from "../repository/UserRepository"

const findMe = async () => {
    return userRepository.findMe();
};

const recuperarSenha = (email: string,cpf:string) => {
    return userRepository.recuperarSenha(email,cpf);
  };
  const cadastrarNovoUsuario = (formData:CadastroUserDTO)=>{
        return userRepository.cadastrarNovoUsuario(formData);
  }

export {findMe ,recuperarSenha, cadastrarNovoUsuario}