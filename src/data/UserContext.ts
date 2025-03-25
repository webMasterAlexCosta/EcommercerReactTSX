import { createContext } from "react";
import { Usuario } from "../models/dto/CredenciaisDTO";



interface IUsuarioContext {
    usuario: Usuario | null;
    setUsuario: (usuario: Usuario | null) => void;
}

const UsuarioContext = createContext<IUsuarioContext>({
    usuario: null,
    setUsuario: () => {}
});

export default UsuarioContext;
