import './Styles.css';
import { NavLink, Link } from 'react-router-dom';
import * as userService from '../../../services/UserServices';
import { AccountCircle, ExitToApp, Home, Inventory, SupervisorAccount } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { isAuthenticated } from '../../../services/AuthService';
import { Usuario } from '../../../models/dto/CredenciaisDTO';

interface HeaderAdminProps {
  user: Usuario | null;
  setViewerHeaderClient: (value: boolean) => void;
  setContextIsLogin: (value: boolean) => void;
}

const HeaderAdmin = ({ setViewerHeaderClient, setContextIsLogin }: HeaderAdminProps) => {
  const [usuario, setUsuario] = useState<{ nome: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const getIsActive = ({ isActive }: { isActive: boolean }) =>
    isActive ? { color: 'red' } : { color: 'black' };

  useEffect(() => {
    const checkAuthentication = async () => {
      if (await isAuthenticated()) {
        const obterUsuario = async () => {
          setLoading(true);
          try {
            const response = await userService.getUserService();
            setUsuario(response && response.nome ? { nome: response.nome } : null);
          } catch  {
       //     console.error('Erro ao buscar usuário:', error);
            setUsuario(null);
          } finally {
            setLoading(false);
          }
        };
        obterUsuario();
      } else {
        setLoading(false);
      }
    };
    checkAuthentication();
  }, []);

  const handlerClick = () => {
    userService.logoutService();
    setViewerHeaderClient(false);
    setContextIsLogin(false);
  };

  return (
    <header className="alex-header-admin">
      <nav className="alex-container-admin">
        <div className="alex-contaner-admin-inicio">
          <h1 className="usuario">
            {loading ? 'Carregando...' : usuario ? usuario.nome : 'Usuário Desconhecido'}
          </h1>
          <NavLink style={getIsActive} to="/Administrativo" className="alex-contaner-admin-inicio">
            <Home style={{ fontSize: 40, color: 'black' }} />
            
          </NavLink>
        </div>

        <div className="alex-navbar-left-admin">
          <div className="alex-menu-items-container">
            <NavLink to="PerfilAdmin" style={getIsActive} className="user-profile-link">
              <AccountCircle style={{ fontSize: 40, color: 'black' }} />
              <h3>Perfil</h3>
            </NavLink>

            <NavLink style={getIsActive} to="/Administrativo/Listagem" className="produtos">
              <Inventory style={{ fontSize: 40, color: 'black', marginRight: 8 }} />
              <h3>Produtos</h3>
            </NavLink>
          </div>

          <div className="alex-logged-user">
            <SupervisorAccount style={{ fontSize: 40, color: 'black' }} />
            <Link to="/catalogo" onClick={handlerClick} className="logout-link">
              <ExitToApp style={{ fontSize: 40, color: 'black' }} />
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default HeaderAdmin;
