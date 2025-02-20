import homeImg from '../assets/images/home.svg';
import produtosImg from '../assets/images/products.svg';
import { NavLink} from 'react-router-dom';

const HeaderAdmin = () => {
  const getIsActive=({isActive}:{isActive:boolean})=>
    isActive  ? {color:"red"} : {color:"black"};
    
    return (
        <>
        <header className="dsc-header-admin">
        <nav className="dsc-container">
          <NavLink style={getIsActive} to="/Administrativo/AdminHome"><h1>DSC Admin</h1></NavLink>

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
                <p className="dsc-menu-item-active"><NavLink style={getIsActive} to="../AdminHome/Listagem">Produtos</NavLink></p>
              </div>
            </div>
            <div className="dsc-logged-user">
              <p>Maria Silva</p>
              <a href="#">Sair</a>
            </div>
          </div>
        </nav>
      </header>
        </>
    )
}
export default HeaderAdmin;