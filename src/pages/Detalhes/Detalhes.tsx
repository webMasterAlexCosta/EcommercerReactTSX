import "./styles.css"
import computador from "../../assets/images/computer.png"
import HeaderClient from "../../components/HeaderClient"

const Detalhes=()=>{
return (
    <>
    <HeaderClient />
    <section id="product-details-section" className="dsc-container">
        <div className="dsc-card dsc-mb20">
          <div className="dsc-product-details-top dsc-line-bottom">
            <img src={computador} alt="Computador" />
          </div>
          <div className="dsc-product-details-bottom">
            <h3>R$ 5000,00</h3>
            <h4>Computador Gamer XT</h4>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <div className="dsc-category-container">
                <div className="dsc-category">
                    Eletrônicos
                </div>
                <div className="dsc-category">
                    Computadores
                </div>
            </div>
          </div>
        </div>
        <div className="dsc-btn-page-container">
            <div className="dsc-btn dsc-btn-blue">
                Comprar
            </div>
            <div className="dsc-btn dsc-btn-white">
                Início
            </div>
        </div>
      </section>
    </>
)
}
export default Detalhes