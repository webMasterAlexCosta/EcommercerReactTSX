import './styles.css';

const Confirmacao = () => {
    return (
        <>
        <header className="dsc-header-client">
      <nav className="dsc-container">
        <h1>DSCommerce</h1>
        <div className="dsc-navbar-right">
          <div className="dsc-menu-items-container">
            <div className="dsc-menu-item">
              <img src="images/admin.svg" alt="Admin" />
            </div>
            <div className="dsc-menu-item">
              <img src="images/cart.svg" alt="Carrinho de compras" />
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
      <section id="confirmation-section" className="dsc-container">
        <div className="dsc-card dsc-mb20">
          <div className="dsc-cart-item-container dsc-line-bottom">
            <div className="dsc-cart-item-left">
              <img src="images/computer.png" alt="Computador" />
              <div className="dsc-cart-item-description">
                <h3>Computador Gamer XT</h3>
                <div className="dsc-cart-item-quantity-container">
                  <p>1</p>
                </div>
              </div>
            </div>
            <div className="dsc-cart-item-right">
              R$ 5000,00
            </div>
          </div>
          <div className="dsc-cart-item-container dsc-line-bottom">
            <div className="dsc-cart-item-left">
              <img src="images/computer.png" alt="Computador" />
              <div className="dsc-cart-item-description">
                <h3>Computador Gamer XT</h3>
                <div className="dsc-cart-item-quantity-container">
                  <p>1</p>
                </div>
              </div>
            </div>
            <div className="dsc-cart-item-right">
              R$ 5000,00
            </div>
          </div>
          <div className="dsc-cart-total-container">
            <h3>R$ 15000,00</h3>
          </div>
        </div>
        <div className="dsc-confirmation-message dsc-mb20">
          Pedido realizado! Número 35
        </div>
        <div className="dsc-btn-page-container">
            <div className="dsc-btn dsc-btn-white">
              Início
            </div>
        </div>
      </section>
    </main>
        </>
    );
}
export default Confirmacao;