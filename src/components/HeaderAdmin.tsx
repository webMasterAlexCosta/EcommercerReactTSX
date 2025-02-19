import homeImg from '../assets/images/home.svg';
import produtosImg from '../assets/images/products.svg';
import { Link} from 'react-router-dom';

const HeaderAdmin = () => {
    return (
        <>
        <header className="dsc-header-admin">
        <nav className="dsc-container">
          <Link to="/Administrativo/AdminHome"><h1>DSC Admin</h1></Link>

          <div className="dsc-navbar-right">
            <div className="dsc-menu-items-container">
              <div className="dsc-menu-item">
                <img src={homeImg} alt="Início" />
                <Link to="/">
                  <p>Início</p>
                </Link>
              </div>
              <div className="dsc-menu-item">
                <img src={produtosImg} alt="Cadastro de produtos" />
                <p className="dsc-menu-item-active"><Link to="../Listagem">Produtos</Link></p>
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