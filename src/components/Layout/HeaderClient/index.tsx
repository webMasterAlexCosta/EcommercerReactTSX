import './Styles.css';
import { NavLink } from "react-router-dom";
import { CartIcon } from "../../UI/CartIcon";
import { useContext, useEffect } from 'react';
import ContextIsLogin from '../../../data/LoginContext';
import { TOKEN_KEY } from '../../../utils/system';
import * as credencialServices from "../../../services/CredenciasiService";
import * as authService from "../../../services/AuthService";
import IconAdminContext from '../../../data/IconAdminContext';

const HeaderClient = () => {

  const { contextIsLogin, setContextIsLogin } = useContext(ContextIsLogin);
  const { iconAdminContext,setIconAdminContext } = useContext(IconAdminContext);

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

  function handleOnclick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void {
    event.preventDefault();
    credencialServices.logout();
    setContextIsLogin(false);
    setIconAdminContext(false)
  }

  return (
    <header className="dsc-header-client">
      <nav className="dsc-container">
        <NavLink style={getIsActive} to="/">{authService.getAccessTokenPayload()?.nome}</NavLink>
        <NavLink style={getIsActive} to="/Carrinho">Carrinho</NavLink>
        <NavLink style={getIsActive} to="/Catalogo">Catalogo</NavLink>

        {!contextIsLogin && <NavLink style={getIsActive} to="/Login">Login</NavLink>}

        {iconAdminContext && (
          <NavLink style={getIsActive} to="/Administrativo">
            <span className="material-icons">settings</span>
          </NavLink>
        )}

        <div className="dsc-navbar-right">
          <NavLink to="/carrinho">
            <div className="dsc-menu-item">
              <CartIcon />
            </div>
          </NavLink>
          {!contextIsLogin
            ? <NavLink style={getIsActive} to="/login">Entrar</NavLink>
            : <NavLink style={getIsActive} to="/catalogo" onClick={handleOnclick}>Sair</NavLink>
          }
        </div>
      </nav>
    </header>
  );
};

export default HeaderClient;
