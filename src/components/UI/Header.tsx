import { useEffect, useState } from 'react';
import HeaderAdmin from '../Layout/HeaderAdmin';
import HeaderClient from '../Layout/HeaderClient';
import { useContext } from 'react';
import ContextIsLogin from './../../data/LoginContext';
import UserContext from '../../data/UsuarioContext';
import { isAuthenticated } from '../../services/AuthService';
import { getUserService } from '../../services/UserServices';

const Header = () => {
  const [isAdmin, setIsAdmin] = useState<string | null>(null);
  const [viewerHeaderClient, setViewerHeaderClient] = useState<boolean>(false);

  const { setContextIsLogin } = useContext(ContextIsLogin);
  const { usuario, setUsuario } = useContext(UserContext);
 
  useEffect(() => {
    if (!isAuthenticated()) {
      setUsuario(null);
      return;
    }

    const fetchUserData = async () => {
      try{
      const userData = await getUserService();
     
      setUsuario(userData);
      }catch{
        window.location.href="/";
      } 
    };

    fetchUserData();
  }, [setUsuario]);

  useEffect(() => {
    if (usuario?.perfil) {
      setIsAdmin(usuario.perfil.includes('ADMIN') ? 'ADMIN' : 'CLIENTE');
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
