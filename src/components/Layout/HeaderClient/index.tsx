import './Styles.css';
import { NavLink } from "react-router-dom";
// { CartIcon } from "../../UI/CartIcon";
import { useContext, useEffect } from 'react';
import ContextIsLogin from '../../../data/LoginContext';
import { TOKEN_KEY } from '../../../utils/system';
import * as credencialServices from "../../../services/CredenciasiService";
//import * as authService from "../../../services/AuthService";
import IconAdminContext from '../../../data/IconAdminContext';
import { Login, Logout, Home, MenuBook, AccountCircle, } from '@mui/icons-material';

import { CartIcon } from '../../UI/CartIcon';

const HeaderClient = () => {

  const { contextIsLogin, setContextIsLogin } = useContext(ContextIsLogin);
  const { iconAdminContext, setIconAdminContext } = useContext(IconAdminContext);

useEffect(()=>{
<CartIcon/>

},[])

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


        <NavLink style={getIsActive} to="/">
          <Home style={{ fontSize: 40, color: 'black' }} />


        </NavLink>
        <NavLink style={getIsActive} to="/catalogo">
          <MenuBook style={{ fontSize: 40, color: 'black' }} />
        </NavLink>

        <div className="dsc-navbar-right">
          <AccountCircle style={{ fontSize: 40, color: 'black' }} />
          {/* {authService.getAccessTokenPayload()?.nome} */}
          <NavLink to="/carrinho">
            <div className="dsc-menu-item">
              <CartIcon />
            </div>
          </NavLink>
          {iconAdminContext && (
            <NavLink style={getIsActive} to="/Administrativo">
              <span className="material-icons">settings</span>
            </NavLink>
          )}
          {!contextIsLogin
            ?
            <NavLink style={getIsActive} to="/login">
              <Login style={{ fontSize: 40, color: 'black' }} />
            </NavLink>
            :
            <NavLink style={getIsActive} to="/catalogo" onClick={handleOnclick}>
              <Logout style={{ fontSize: 40, color: 'black' }} />
            </NavLink>
          }

        </div>
      </nav>
    </header>
  );
};

export default HeaderClient;
