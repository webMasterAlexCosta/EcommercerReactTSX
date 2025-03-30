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
        const authenticated = await authService.isAuthenticated(); // Aguarda a resposta da promessa
        if (authenticated) {
          const userProfile = await userService.getUserService();
          setUser(userProfile);
        }
      } catch  {
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

  // Aqui, já estamos aguardando a autenticação ser resolvida.
  if (user && user.perfil?.includes("CLIENTE")) {
    return React.isValidElement(children)
      ? React.cloneElement(children, { user: user as Usuario })
      : null;
  }

  return <Navigate to="/catalogo" />;
};

export { PrivateRouteClient };
