import cart from '../assets/images/cart.svg';
import { Link } from "react-router-dom";

const HeaderClient = () => {
  const isAdmin = true
  const isCliente = true
  return (
    <>
      <header className="dsc-header-client">
        <nav className="dsc-container">
          <Link to="/"><h1>DS Commerce</h1>
          </Link> 
          {(isCliente || isAdmin) && <>
          <Link to="/Carrinho">Carrinho</Link>
          <Link to="/Catalogo">Catalogo</Link>
          
          <Link to="/Login">Login</Link>

        </>}


        {isAdmin && <Link to="/Administrativo/AdminHome">Administrativo</Link>}
          <div className="dsc-navbar-right">
            <div className="dsc-menu-items-container">
              <div className="dsc-menu-item">
                <img src={cart} alt="Carrinho de compras" />
              </div>
            </div>
            <Link to="/entrar"> 
              Entrar
            </Link>
          </div>
        </nav>
      </header>
    </>
  );
};

export default HeaderClient;
