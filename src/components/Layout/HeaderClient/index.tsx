import './Styles.css';
import { NavLink } from "react-router-dom";
import { useContext, useEffect } from 'react';
import ContextIsLogin from '../../../data/LoginContext';
import * as userService from "../../../services/UserServices";
import * as authService from "../../../services/AuthService";
import IconAdminContext from '../../../data/IconAdminContext';
import { Login, Logout, Home, MenuBook, AccountCircle } from '@mui/icons-material';
import { CartIcon } from '../../UI/CartIcon';
import UsuarioContext from '../../../data/UsuarioContext';

const HeaderClient = () => {
  const { contextIsLogin, setContextIsLogin } = useContext(ContextIsLogin);
  const { iconAdminContext, setIconAdminContext } = useContext(IconAdminContext);
  const {usuario , setUsuario} = useContext(UsuarioContext)
  
  useEffect(() => {
    const payload = userService.getTokenService() ? authService.getAccessTokenPayload() : null;

    if (payload) {
      const buscar = async () => {
        const token = userService.getTokenService();
        setContextIsLogin(!!token);
     
        const userProfile = await userService.getUserService()
        setUsuario(userProfile)
       
      }
      buscar()

      if (payload && !authService.isAuthenticated()) {
        setContextIsLogin(true);
        userService.logoutService();
      }

      if (usuario?.perfil?.includes("ADMIN")) {
        setIconAdminContext("ADMIN");
      } else if (usuario?.perfil?.includes("CLIENTE")) {
        setIconAdminContext("CLIENTE");
      } else {
        setIconAdminContext(null);
      }


    }
  }, [setContextIsLogin, setIconAdminContext, setUsuario]);

      /** posso usar esse recurso, mas no react vou usar navigate
       window.addEventListener("storage", checkLoginStatus); // Escuta mudanças no storage
   
       return () => window.removeEventListener('storage', checkLoginStatus); // Limpa o event listener ao desmontar
        *  */
  const getIsActive = ({ isActive }: { isActive: boolean }) => (isActive ? { color: "red" } : { color: "black" });
  function handleOnclick(event: React.MouseEvent<HTMLElement> | React.MouseEvent<SVGSVGElement, MouseEvent>, tipo: string): void {
    if (tipo === "logout") {
      event.preventDefault();
      userService.logoutService();
      setContextIsLogin(false);
      setIconAdminContext(null);
      return;
    }



    if (usuario?.perfil.includes("ADMIN")) {
      setIconAdminContext("ADMIN");
    } else if (usuario?.perfil.includes("CLIENTE")) {
      setIconAdminContext("CLIENTE");
    } else {
      setIconAdminContext(null);
    }
  }


  return (
    <header className="alex-header-client">
      <nav className="alex-container">
        <NavLink to="/" style={getIsActive}>
          <Home style={{ fontSize: 40, color: 'black' }} />
          <h3>Inicio</h3>
        </NavLink>

        <NavLink to="/catalogo" style={getIsActive}>
          <MenuBook style={{ fontSize: 40, color: 'black' }} />
          <h3>Catalogo</h3>
        </NavLink>

        <div className="alex-navbar-right">
          {iconAdminContext === "CLIENTE" && (
            <NavLink to="/perfil" style={getIsActive}>
              <AccountCircle style={{ fontSize: 40, color: 'black' }} />
              <h3>Perfil</h3>
            </NavLink>
          )}

          <NavLink to="/carrinho" style={getIsActive}>
            <div className="alex-menu-item">
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