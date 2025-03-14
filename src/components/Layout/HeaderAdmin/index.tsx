import './Styles.css';
import homeImg from '../../../assets/images/home.svg';
import produtosImg from '../../../assets/images/products.svg';
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import * as credenciaisServices from "../../../services/CredenciasiService";


interface HeaderAdminProps {
  user: string | undefined;
  setViewerHeaderClient: (value: boolean) => void;  // Updated to accept setter function
  setContextIsLogin: (value: boolean) => void;
}

const HeaderAdmin = ({ user, setViewerHeaderClient,setContextIsLogin }: HeaderAdminProps) => {

  const getIsActive = ({ isActive }: { isActive: boolean }) =>
    isActive ? { color: "red" } : { color: "black" };

  const handlerClick = () => {
    setViewerHeaderClient(false);  
    setContextIsLogin(false);
    return credenciaisServices.logout();
  };

  return (
    <header className="dsc-header-admin">
      <nav className="dsc-container">
        <NavLink style={getIsActive} to="/Administrativo">
          <h1>{user}</h1>
        </NavLink>

        <div className="dsc-navbar-right">
          <div className="dsc-menu-items-container">
            <div className="dsc-menu-item">
              <img src={homeImg} alt="Início" />
              <NavLink style={getIsActive} to="/">
                <p>Início</p>
              </NavLink>
            </div>
            <div className="dsc-menu-item">
              <img src={produtosImg} alt="Cadastro de produtos" />
              <p className="dsc-menu-item-active">
                <NavLink style={getIsActive} to="/Administrativo/Listagem">
                  Produtos
                </NavLink>
              </p>
            </div>
          </div>
          <div className="dsc-logged-user">
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
