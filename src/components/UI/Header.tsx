import { useEffect, useState } from 'react';
import HeaderAdmin from '../Layout/HeaderAdmin';
import HeaderClient from '../Layout/HeaderClient';
import { useContext } from 'react';
import ContextIsLogin from './../../data/LoginContext';
import UserContext from './../../data/UserContext';
import { Carregando } from './Carregando'; 
import { isAuthenticated } from '../../services/AuthService';
import { getUserService } from '../../services/UserServices';
import { TEXTO_PADRAO_SOLICITACAO } from '../../utils/system';

const Header = () => {
  const [isAdmin, setIsAdmin] = useState<string | null>(null);
  const [viewerHeaderClient, setViewerHeaderClient] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);  

  const { setContextIsLogin } = useContext(ContextIsLogin);
  const { usuario, setUsuario } = useContext(UserContext);
 
  useEffect(() => {
    if (!isAuthenticated()) {
      setUsuario(null);
      setLoading(false);  
      return;
    }

    const fetchUserData = async () => {
      const userData = await getUserService();
      setUsuario(userData);
      setLoading(false);  
    };

    fetchUserData();
  }, [setUsuario]);

  useEffect(() => {
    if (usuario?.perfil) {
      setIsAdmin(usuario.perfil.includes('ADMIN') ? 'ADMIN' : 'CLIENTE');
    }
  }, [usuario]);

  if (loading) {
    return <Carregando title={TEXTO_PADRAO_SOLICITACAO} />; 
  }

  return (
    <>
      {isAdmin === 'ADMIN' && viewerHeaderClient === true ? (
        <HeaderAdmin
          user={usuario?.nome}
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
