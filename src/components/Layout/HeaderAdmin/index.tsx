import './Styles.css';
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import * as userService from "../../../services/UserServices";
import { AccountCircle, ExitToApp, Home, Inventory, SupervisorAccount } from '@mui/icons-material';
import UsuarioContext from '../../../data/UsuarioContext';
import { useContext } from 'react';

interface HeaderAdminProps {
  setViewerHeaderClient: (value: boolean) => void;
  setContextIsLogin: (value: boolean) => void;
}

const HeaderAdmin = ({ setViewerHeaderClient, setContextIsLogin }: HeaderAdminProps) => {
  const {usuario} = useContext(UsuarioContext)

  const getIsActive = ({ isActive }: { isActive: boolean }) =>
    isActive ? { color: "red" } : { color: "black" };


  const handlerClick = () => {
    userService.logoutService();
    setViewerHeaderClient(false);
    setContextIsLogin(false);
  };

  return (
    <header className="alex-header-admin">
      <nav className="alex-container-admin">
        <NavLink style={getIsActive} to="/Administrativo">
          <h1 className='usuario'>{usuario?.nome}</h1>
        </NavLink>

        <div className="alex-navbar-left-admin">
          <div className="alex-menu-items-container">
            <NavLink to="PerfilAdmin" style={getIsActive} className="user-profile-link">
              <AccountCircle style={{ fontSize: 40, color: 'black' }} />
              <span className="user-name"><strong>Perfil</strong></span>
            </NavLink>


            <div className="alex-menu-item">
              <Home style={{ fontSize: 40, color: 'black' }} />
              <NavLink style={getIsActive} to="/" >
              <strong>Início</strong>
              </NavLink>
            </div>

            <div className="alex-menu-item">
              <Inventory style={{ fontSize: 40, color: 'black', }} />
              <p className="alex-menu-item-active">
                <NavLink style={getIsActive} to="/Administrativo/Listagem">
                  <strong>Produtos</strong>
                </NavLink>
              </p>
            </div>
          </div>

          <div className="alex-logged-user">
            <div className="user-info-icon">
              <SupervisorAccount style={{ fontSize: 40, color: 'black' }} />
              {usuario?.nome}
            </div>
            <Link to="/catalogo" onClick={handlerClick} className="logout-link">
              <ExitToApp style={{ fontSize: 40, color: 'black' }} />
             <h1>Sair</h1> 
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default HeaderAdmin;
