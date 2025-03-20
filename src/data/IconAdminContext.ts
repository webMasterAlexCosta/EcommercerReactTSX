import { createContext } from "react";

export type PerfilContext = "CLIENTE" | "ADMIN" | null;

interface IconAdminContextProps {
    iconAdminContext: PerfilContext;
    setIconAdminContext: (iconAdminContext: PerfilContext) => void;
}


const IconAdminContext = createContext<IconAdminContextProps>({
    iconAdminContext: null,
    setIconAdminContext: () => {},
});

export default IconAdminContext;
