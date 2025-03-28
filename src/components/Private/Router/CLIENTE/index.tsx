import React, { useEffect, useState } from 'react';
import * as authService from "../../../../services/AuthService";
import * as userService from "../../../../services/UserServices";
import { Navigate } from 'react-router-dom';
import { Usuario } from '../../../../models/dto/CredenciaisDTO';
import { Carregando } from '../../../UI/Carregando';

interface Props {
  children: React.ReactElement<{ user?: Usuario }>;
}

const PrivateRouteClient: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const buscar = async () => {
      try {
        if (authService.isAuthenticated()) {
          const userProfile = await userService.getUserService();
          //console.log("Dados do usuário buscados:", userProfile);
          setUser(userProfile);
        }
      } catch  {
      //  console.error("Erro ao buscar usuário:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    buscar();
  }, []);

  if (isLoading) {
    return <Carregando title="Aguarde" />;
  }

  if (authService.isAuthenticated() && user?.perfil?.includes("CLIENTE")) {
    // Passa o `user` como prop para o componente pai
    return React.isValidElement(children)
      ? React.cloneElement(children, { user: user as Usuario })
      : null;
  }

  return <Navigate to="/catalogo" />;
};

export { PrivateRouteClient };