import React from 'react';
import * as authService from "../../../../services/AuthService"
import { Navigate } from 'react-router-dom';

interface props {
    children: React.ReactNode;
}

const PrivateRouteClient: React.FC<props> = ({ children }: props) => {

    if (authService.isAuthenticated() && authService.getAccessTokenPayload()?.perfis.includes("CLIENT")) {

        return children;
    }
    return <Navigate to="/catalogo" />;
}
export { PrivateRouteClient }