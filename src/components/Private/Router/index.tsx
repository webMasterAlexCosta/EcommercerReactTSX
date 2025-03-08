import React from 'react';
import * as authService from "../../../services/AuthService"
import { Navigate } from 'react-router-dom';

interface props {
    children: React.ReactNode;
}

const PrivateRoute: React.FC<props> = ({ children }: props) => {

    if (authService.isAuthenticated() && authService.getAccessTokenPayload()?.perfis.includes("ADMIN")) {

        return children;
    }
    return <Navigate to="/catalogo" />;
}
export { PrivateRoute }