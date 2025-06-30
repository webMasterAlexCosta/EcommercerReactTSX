import { useEffect, useState } from 'react';
import HeaderAdmin from '../Layout/HeaderAdmin';
import HeaderClient from '../Layout/HeaderClient';
import { useContext } from 'react';
import ContextIsLogin from './../../data/LoginContext';
import UserContext from '../../data/UsuarioContext';
import { isAuthenticated } from '../../services/AuthService';
import { getUserService } from '../../services/UserServices';
import { Usuario } from '../../models/dto/CredenciaisDTO';

const Header = () => {
  const [isAdmin, setIsAdmin] = useState<string | null>(null);
  const [viewerHeaderClient, setViewerHeaderClient] = useState<boolean>(false);

  const { setContextIsLogin } = useContext(ContextIsLogin);
  const { usuario, setUsuario } = useContext(UserContext);
 
  useEffect(() => {
    const checkAuthentication = async () => {
      if (!await isAuthenticated()) {
        setUsuario(null);
        return;
      }

      try {
        const userData = await getUserService();
        setUsuario(userData as Usuario);
      } catch {
        window.location.href = "/";
      }
    };

    checkAuthentication();
  }, []);

  useEffect(() => {
    if (usuario?.perfis) {
      setIsAdmin(usuario.perfis.includes('ADMIN') ? 'ADMIN' : 'CLIENTE');
    }
  }, [usuario]);

 

  return (
    <>
      {isAdmin === 'ADMIN' && viewerHeaderClient === true ? (
        <HeaderAdmin
          user={usuario}
          setViewerHeaderClient={setViewerHeaderClient}
          setContextIsLogin={setContextIsLogin}
        />
      ) : (
        <HeaderClient />
      )}
    </>
  );
};

export { Header };
