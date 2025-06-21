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
  const { usuario, setUsuario } = useContext(UsuarioContext);

  // Carrega o usuário ao montar o componente
  useEffect(() => {
    const buscar = async () => {
      const userProfile = await userService.getUserService();
      setUsuario(userProfile);

      // Define o tipo de perfil imediatamente após carregar o usuário
      if (userProfile?.perfis?.includes("ADMIN")) {
        setIconAdminContext("ADMIN");
      } else if (userProfile?.perfis?.includes("CLIENTE")) {
        setIconAdminContext("CLIENTE");
      } else {
        setIconAdminContext(null);
      }
    };
    buscar();
  }, [setUsuario, setIconAdminContext]);

  // Atualiza o contexto de login com base no token
  useEffect(() => {
    const verificar = async () => {
      const token = userService.getTokenService();
      const isAuth = await authService.isAuthenticated();

      if (token && isAuth) {
        setContextIsLogin(true);
      } else {
        setContextIsLogin(false);
        setIconAdminContext(null);
      }
    };

    verificar();
  }, [setContextIsLogin, setIconAdminContext]);

  const getIsActive = ({ isActive }: { isActive: boolean }) => (
    isActive ? { color: "red" } : { color: "black" }
  );

  const handleOnclick = (
    event: React.MouseEvent<HTMLElement> | React.MouseEvent<SVGSVGElement, MouseEvent>,
    tipo: string
  ): void => {
    if (tipo === "logout") {
      event.preventDefault();
      userService.logoutService();
      setContextIsLogin(false);
      setIconAdminContext(null);
      return;
    }

    // Reforça o tipo de perfil ao clicar
    if (usuario?.perfis.includes("ADMIN")) {
      setIconAdminContext("ADMIN");
    } else if (usuario?.perfis.includes("CLIENTE")) {
      setIconAdminContext("CLIENTE");
    } else {
      setIconAdminContext(null);
    }
  };

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
            <NavLink to="/PerfilClient" style={getIsActive}>
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

          {!contextIsLogin ? (
            <NavLink to="/login" onClick={(e) => handleOnclick(e, "login")} style={getIsActive}>
              <Login style={{ fontSize: 40, color: 'black' }} />
              <h3>Entrar</h3>
            </NavLink>
          ) : (
            <NavLink to="/catalogo" onClick={(e) => handleOnclick(e, "logout")} style={getIsActive}>
              <Logout style={{ fontSize: 40, color: 'black' }} />
              <h3>Sair</h3>
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  );
};

export default HeaderClient;
