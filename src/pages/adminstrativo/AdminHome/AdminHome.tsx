import './styles.css';

const AdminHome=()=>{
    return(
        <>
         <header className="dsc-header-admin">
      <nav className="dsc-container">
        <h1>DSC Admin</h1>
        <div className="dsc-navbar-right">
          <div className="dsc-menu-items-container">
            <div className="dsc-menu-item">
              <img src="images/home.svg" alt="Início" />
              <p>Início</p>
            </div>
            <div className="dsc-menu-item">
              <img src="images/products.svg" alt="Cadastro de produtos" />
              <p className="dsc-menu-item-active">Produtos</p>
            </div>
          </div>
          <div className="dsc-logged-user">
            <p>Maria Silva</p>
            <a href="#">Sair</a>
          </div>
        </div>
      </nav>
    </header>
    <main>
      <section id="admin-home-section" className="dsc-container">
        <h2 className="dsc-section-title dsc-mb20">Bem-vindo à àrea administrativa</h2>
      </section>
    </main>
        </>
    )
}
export default AdminHome;