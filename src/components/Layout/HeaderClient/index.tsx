import './Styles.css';
import { NavLink } from "react-router-dom";
import { CartIcon } from "../../UI/CartIcon";
import { useContext, useEffect } from 'react';
import ContextIsLogin from '../../../data/LoginContext';
import { TOKEN_KEY } from '../../../utils/system';
import * as credencialServices from "../../../services/CredenciasiService"
import * as authService from "../../../services/AuthService"
const HeaderClient = () => {
  const { contextIsLogin, setContextIsLogin } = useContext(ContextIsLogin);
  const isAdmin = true; // Mantém para o controle de admin

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem(TOKEN_KEY);
      setContextIsLogin(!!token); // Define o login com base na presença do token
    };

    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);

    return () => window.removeEventListener('storage', checkLoginStatus);
  }, [setContextIsLogin]);

  const getIsActive = ({ isActive } :{isActive:boolean}) => ({ color: isActive ? "red" : "black" });

  function handleOnclick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void {
    event.preventDefault();
    credencialServices.logout()
    setContextIsLogin(false);
  }

  return (
    <header className="dsc-header-client">
      <nav className="dsc-container">
        <NavLink style={getIsActive} to="/">{authService.getAccessTokenPayload()?.nome}</NavLink>
        <NavLink style={getIsActive} to="/Carrinho">Carrinho</NavLink>
        <NavLink style={getIsActive} to="/Catalogo">Catalogo</NavLink>

        {!contextIsLogin && <NavLink style={getIsActive} to="/Login">Login</NavLink>}
        {isAdmin && <NavLink style={getIsActive} to="/Administrativo">Administrativo</NavLink>}

        <div className="dsc-navbar-right">
          <NavLink to="/carrinho">
            <div className="dsc-menu-item">
              <CartIcon />
            </div>
          </NavLink>
          {!contextIsLogin 
            ? <NavLink style={getIsActive} to="/login">Entrar</NavLink>
            : <NavLink style={getIsActive} to="/catalogo" onClick={handleOnclick }>Sair</NavLink>
          }        </div>
      </nav>
    </header>
  );
};

export default HeaderClient;
