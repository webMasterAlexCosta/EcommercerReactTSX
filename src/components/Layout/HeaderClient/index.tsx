import './Styles.css';
import { NavLink, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();


  useEffect(() => {
      const token = credencialServices.getToken();
      setContextIsLogin(!!token); 

      const userProfile = authService.getUser()?.perfis;
      const payload = authService.getAccessTokenPayload();

      if (payload && payload.exp < Date.now() / 1000) {
        setContextIsLogin(true);
        credencialServices.logout();
      }

      if (userProfile?.includes("ADMIN")) {
        setIconAdminContext("ADMIN");
      } else if (userProfile?.includes("CLIENTE")) {
        setIconAdminContext("CLIENTE");
      } else {
        setIconAdminContext(null);
      }
   

   /** posso usar esse recurso, mas no react vou usar navigate
    window.addEventListener("storage", checkLoginStatus); // Escuta mudanças no storage

    return () => window.removeEventListener('storage', checkLoginStatus); // Limpa o event listener ao desmontar
     *  */

  }, [setContextIsLogin, setIconAdminContext, navigate]);

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
