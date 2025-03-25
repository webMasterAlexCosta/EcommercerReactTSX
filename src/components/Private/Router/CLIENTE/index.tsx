import React, { useEffect, useState } from 'react';
import * as authService from "../../../../services/AuthService";
import * as userService from "../../../../services/UserServices";
import { Navigate } from 'react-router-dom';
import { Usuario } from '../../../../models/dto/CredenciaisDTO';
import { Carregando } from '../../../UI/Carregando';

interface Props {
    children: React.ReactNode;
}

const PrivateRouteClient: React.FC<Props> = ({ children }: Props) => {
    const [user, setUser] = useState<Usuario | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const buscar = async () => {
            try {
                if (authService.isAuthenticated()) {
                    const userProfile = await userService.getUserService();
                   // console.log("Dados do usuário:", userProfile);
                    setUser(userProfile);
                }
            } catch {
             //   console.error("Erro ao carregar usuário:", error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        buscar();
    }, []);

    if (isLoading) {
        return <><Carregando title="Aguarde"/></>; 
    }

    if (authService.isAuthenticated() && user?.perfil?.includes("CLIENTE")) {
        return children;
    }

    return <Navigate to="/catalogo" />;
};

export { PrivateRouteClient };