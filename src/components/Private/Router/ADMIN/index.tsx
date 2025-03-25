import React, { useState } from 'react';
import * as authService from "../../../../services/AuthService"
import * as userService from "../../../../services/UserServices"
import { Navigate } from 'react-router-dom';
import { Usuario } from '../../../../models/dto/CredenciaisDTO';

interface props {
    children: React.ReactNode;
}

const PrivateRouteAdmin: React.FC<props> = ({ children }: props) => {
    const [user, setUser] = useState<Usuario>()

    const buscar = async () => {
        const userProfile = await userService.getUserService()
        setUser(userProfile)
    }
    buscar()

    if (authService.isAuthenticated() && user?.perfil?.includes("ADMIN")) {

        return children;
    }
    return <Navigate to="/catalogo" />;
}
export { PrivateRouteAdmin }