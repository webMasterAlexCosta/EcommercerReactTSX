import { useEffect, useState } from 'react';
import HeaderAdmin from '../Layout/HeaderAdmin';
import HeaderClient from '../Layout/HeaderClient';
import { useContext } from 'react';
import ContextIsLogin from './../../data/LoginContext';
import * as userService from '../../services/UserServices';
import { Usuario } from '../../models/dto/CredenciaisDTO';
import * as authService from '../../services/AuthService';
interface Props {
  user: Usuario | null;
}

const Header = (user: Props) => {
  const [isAdmin, setIsAdmin] = useState<string | null>(null);
  const [viewerHeaderClient, setViewerHeaderClient] = useState<boolean>(false);
  const { setContextIsLogin } = useContext(ContextIsLogin);
  const [usuario, setUsuario] = useState<Usuario | null>();

  useEffect(() => {
    
    
    if (user === null && authService.isAuthenticated()) {
      userService.setUserService();
      const buscarNovamente = userService.getUserService();
      setUsuario(buscarNovamente);
    }
  }, [user]);

  useEffect(() => {
    
    if (usuario?.perfil) {
      setIsAdmin(usuario.perfil.includes("ADMIN") ? "ADMIN" : "CLIENTE");
    }
  }, [usuario]); 

  return (
    <>
      {isAdmin === "ADMIN" && viewerHeaderClient === true
        ? <HeaderAdmin user={userService.getUserService()?.user?.nome}
            setViewerHeaderClient={setViewerHeaderClient}
            setContextIsLogin={setContextIsLogin}
          />
        : <HeaderClient />
      }
    </>
  );
};

export { Header };
