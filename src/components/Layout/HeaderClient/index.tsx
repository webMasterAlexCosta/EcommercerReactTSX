import './Styles.css';
import { NavLink } from "react-router-dom";
import { useContext, useEffect } from 'react';
import ContextIsLogin from '../../../data/LoginContext';
import { TOKEN_KEY } from '../../../utils/system';
import * as credencialServices from "../../../services/CredenciasiService";
import * as authService from "../../../services/AuthService";
import IconAdminContext from '../../../data/IconAdminContext';
import { Login, Logout, Home, MenuBook, AccountCircle } from '@mui/icons-material';
import { CartIcon } from '../../UI/CartIcon';

const HeaderClient = () => {
  const { contextIsLogin, setContextIsLogin } = useContext(ContextIsLogin);
  const { iconAdminContext, setIconAdminContext } = useContext(IconAdminContext);

  // Verifica o status do login quando o componente é montado
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = credencialServices.get(TOKEN_KEY);
      setContextIsLogin(!!token); // Define o login com base na presença do token
    };

    checkLoginStatus();

    // Ouvinte para o armazenamento local para refletir as mudanças entre diferentes abas
    window.addEventListener('storage', checkLoginStatus);

    return () => window.removeEventListener('storage', checkLoginStatus);
  }, [setContextIsLogin, iconAdminContext]);

  const getIsActive = ({ isActive }: { isActive: boolean }) => ({ color: isActive ? "red" : "black" });

  function handleOnclick(event: React.MouseEvent<HTMLElement> | React.MouseEvent<SVGSVGElement, MouseEvent>, tipo: string): void {
    if (tipo === "logout") {
      event.preventDefault();
      credencialServices.logout();
      setContextIsLogin(false);
      setIconAdminContext(null);
      return;
    }
    else{
    if (authService.getAccessTokenPayload()?.perfis.includes("ADMIN")) {
      
      return setIconAdminContext("ADMIN");
    } else if(authService.getAccessTokenPayload()?.perfis.includes("CLIENT")){
      
      return setIconAdminContext("CLIENT");
    }
    else{
      return setIconAdminContext(null);
    }
  }}

  return (
    <header className="dsc-header-client">
      <nav className="dsc-container">
        <NavLink style={getIsActive} to="/">
          <Home style={{ fontSize: 40, color: 'black' }} />
          <h3>Inicio</h3>
        </NavLink>

        <NavLink style={getIsActive} to="/catalogo">
          <MenuBook style={{ fontSize: 40, color: 'black' }} />
          <h3>Catalogo</h3>
        </NavLink>

        <div className="dsc-navbar-right">
          {/* Verifica se é cliente antes de renderizar o link de perfil */}
          {iconAdminContext === "CLIENT" && (
            <NavLink style={getIsActive} to="/perfil">
              <AccountCircle style={{ fontSize: 40, color: 'black' }} />
              <h3>Perfil</h3>
            </NavLink>
          )}

          {/* Link para carrinho */}
          <NavLink to="/carrinho" style={getIsActive}>
            <div className="dsc-menu-item">
              <CartIcon />
            </div>
            <h3>Carrinho</h3>
          </NavLink>

          {/* Verifica se é admin antes de renderizar o link administrativo */}
          {iconAdminContext === "ADMIN" && (
            <NavLink style={getIsActive} to="/Administrativo">
              <span className="material-icons">settings</span>
              <h3>Admin</h3>
            </NavLink>
          )}

          {/* Condicional de login/logout */}
          {!contextIsLogin
            ? <NavLink style={getIsActive} to="/login">
                <Login style={{ fontSize: 40, color: 'black' }} onClick={(e) => handleOnclick(e, "login")} />
              </NavLink>
            : <NavLink style={getIsActive} to="/catalogo" onClick={(e) => handleOnclick(e, "logout")}>
                <Logout style={{ fontSize: 40, color: 'black' }} />
              </NavLink>
          }
        </div>
      </nav>
    </header>
  );
};

export default HeaderClient;
