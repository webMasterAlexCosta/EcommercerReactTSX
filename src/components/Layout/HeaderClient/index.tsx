import './Styles.css';
import { NavLink } from "react-router-dom";
import { useContext, useEffect } from 'react';
import ContextIsLogin from '../../../data/LoginContext';
import * as credencialServices from "../../../services/CredenciasiService";
import * as authService from "../../../services/AuthService";
import IconAdminContext from '../../../data/IconAdminContext';
import { Login, Logout, Home, MenuBook, AccountCircle } from '@mui/icons-material';
import { CartIcon } from '../../UI/CartIcon';

const HeaderClient = () => {
  const { contextIsLogin, setContextIsLogin } = useContext(ContextIsLogin);
  const { iconAdminContext, setIconAdminContext } = useContext(IconAdminContext);

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = credencialServices.getToken();
      setContextIsLogin(!!token); // Define se o usuário está logado baseado no token

      const userProfile = authService.getUser()?.perfis;
      console.log(userProfile);

      // Verifica os perfis do usuário e atualiza o contexto
      if (userProfile?.includes("ADMIN")) {
        setIconAdminContext("ADMIN");
      } else if (userProfile?.includes("CLIENTE")) {
        setIconAdminContext("CLIENTE");
      } else {
        setIconAdminContext(null);
      }
    };

    checkLoginStatus(); // Checa o login e perfil ao carregar

    window.addEventListener("storage", checkLoginStatus); // Escuta mudanças no storage

    return () => window.removeEventListener('storage', checkLoginStatus); // Limpa o event listener ao desmontar
  }, [setContextIsLogin, setIconAdminContext]);

  const getIsActive = ({ isActive }: { isActive: boolean }) => (isActive ? { color: "red" } : { color: "black" });

  function handleOnclick(event: React.MouseEvent<HTMLElement> | React.MouseEvent<SVGSVGElement, MouseEvent>, tipo: string): void {
    if (tipo === "logout") {
      event.preventDefault();
      credencialServices.logout();
      setContextIsLogin(false);
      setIconAdminContext(null);
      return;
    }

    const userProfile = authService.getUser()?.perfis

    if (userProfile?.includes("ADMIN")) {
      setIconAdminContext("ADMIN");
    } else if (userProfile?.includes("CLIENTE")) {
      setIconAdminContext("CLIENTE");
    } else {
      setIconAdminContext(null);
    }
  }

  return (
    <header className="dsc-header-client">
      <nav className="dsc-container">
        <NavLink to="/" style={getIsActive}>
          <Home style={{ fontSize: 40, color: 'black' }} />
          <h3>Inicio</h3>
        </NavLink>

        <NavLink to="/catalogo" style={getIsActive}>
          <MenuBook style={{ fontSize: 40, color: 'black' }} />
          <h3>Catalogo</h3>
        </NavLink>

        <div className="dsc-navbar-right">
          {iconAdminContext === "CLIENTE" && (
            <NavLink to="/perfil" style={getIsActive}>
              <AccountCircle style={{ fontSize: 40, color: 'black' }} />
              <h3>Perfil</h3>
            </NavLink>
          )}

          <NavLink to="/carrinho" style={getIsActive}>
            <div className="dsc-menu-item">
              <CartIcon />
            </div>
            <h3>Carrinho</h3>
          </NavLink>

          {iconAdminContext === "ADMIN" && (
            <NavLink to="/Administrativo" style={getIsActive}>
              <span className="material-icons">settings</span>
              <h3>Admin</h3>
            </NavLink>
          )}

          {!contextIsLogin
            ? <NavLink to="/login" onClick={(e) => handleOnclick(e, "login")} style={getIsActive}>
              <Login style={{ fontSize: 40, color: 'black' }} />
              <h3>Entrar</h3>
            </NavLink>
            : <NavLink to="/catalogo" onClick={(e) => handleOnclick(e, "logout")} style={getIsActive}>
              <Logout style={{ fontSize: 40, color: 'black' }} />
              <h3>Sair</h3>
            </NavLink>
          }
        </div>
      </nav>
    </header>
  );
};

export default HeaderClient;
