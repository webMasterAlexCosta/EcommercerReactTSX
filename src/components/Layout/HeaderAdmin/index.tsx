import './Styles.css';
import homeImg from '../../../assets/images/home.svg';
import produtosImg from '../../../assets/images/products.svg';
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import * as userService from "../../../services/UserServices";


interface HeaderAdminProps {
  user: string | undefined;
  setViewerHeaderClient: (value: boolean) => void; 
  setContextIsLogin: (value: boolean) => void;
}

const HeaderAdmin = ({ user, setViewerHeaderClient,setContextIsLogin }: HeaderAdminProps) => {

  const getIsActive = ({ isActive }: { isActive: boolean }) =>
    isActive ? { color: "red" } : { color: "black" };

  const handlerClick = () => {
    userService.logoutService();
    setViewerHeaderClient(false);  
    setContextIsLogin(false);
    return 
  };

  return (
    <header className="alex-header-admin">
      <nav className="alex-container">
        <NavLink style={getIsActive} to="/Administrativo">
          <h1>{user}</h1>
        </NavLink>

        <div className="alex-navbar-right">
          <div className="alex-menu-items-container">
            <div className="alex-menu-item">
              <img src={homeImg} alt="Início" />
              <NavLink style={getIsActive} to="/">
                <p>Início</p>
              </NavLink>
            </div>
            <div className="alex-menu-item">
              <img src={produtosImg} alt="Cadastro de produtos" />
              <p className="alex-menu-item-active">
                <NavLink style={getIsActive} to="/Administrativo/Listagem">
                  Produtos
                </NavLink>
              </p>
            </div>
          </div>
          <div className="alex-logged-user">
            <p>{user}</p>
            <Link to="/catalogo" onClick={handlerClick}>
              Sair
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default HeaderAdmin;
