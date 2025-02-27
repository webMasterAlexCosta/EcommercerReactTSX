import './Styles.css'
import cart from '../../../assets/images/cart.svg';
import { NavLink } from "react-router-dom";

const HeaderClient = () => {
  const isAdmin = false;
  const isCliente = true;

  const getIsActive = ({ isActive }: { isActive: boolean }) =>
    isActive ? { color: "red" } : { color: "black" };

  return (
    <>
      <header className="dsc-header-client">
        <nav className="dsc-container">
          <NavLink style={getIsActive} to="/">
            <h1>Alex Costa</h1>
          </NavLink>

          {(isCliente || isAdmin) && (
            <>
              <NavLink style={getIsActive} to="/Carrinho">Carrinho</NavLink>
              <NavLink style={getIsActive} to="/Catalogo">Catalogo</NavLink>
              <NavLink style={getIsActive} to="/Login">Login</NavLink>
            </>
          )}

          {isAdmin && (
            <NavLink style={getIsActive} to="/Administrativo/AdminHome">Administrativo</NavLink>
          )}

          <div className="dsc-navbar-right">
            <div className="dsc-menu-items-container">
              <div className="dsc-menu-item">
                <img src={cart} alt="Carrinho de compras" />
              </div>
            </div>
            <NavLink style={getIsActive} to="/entrar">Entrar</NavLink>
          </div>
        </nav>
      </header>
    </>
  );
};

export default HeaderClient;
