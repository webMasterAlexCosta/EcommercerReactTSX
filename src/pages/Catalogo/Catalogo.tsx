import HeaderClient from "../../components/HeaderClient";
import computador from "../../assets/images/computer.png";
import { Link } from "react-router-dom";
import ButtonActions from "../../components/ButtonActions";
import produtoDTO from "../../models/ProdutosDTO";

const Catalogo = () => {
  return (
    <>
      <HeaderClient />
      <section id="catalog-section" className="dsc-container">
        <form className="dsc-search-bar">
          <button type="submit">🔎︎</button>
          <input type="text" placeholder="Nome do produto" />
          <button type="reset">🗙</button>
        </form>

        <div className="dsc-catalog-cards dsc-mb20 dsc-mt20">
          {produtoDTO.map((itemProduto) => (
            <div key={itemProduto.id} className="dsc-card">
              <div className="dsc-catalog-card-top dsc-line-bottom">
                <img src={computador} alt={itemProduto.nome} />
              </div>
              <div style={{ width: "20%" }}>
                <Link to={`/Detalhes/${itemProduto.id}`}>
                  <ButtonActions nome="Detalhes" className="dsc-btn dsc-btn-blue" />
                </Link>
              </div>
              <div className="dsc-catalog-card-bottom">
                <h3>{itemProduto.preco}</h3>
                <h4>{itemProduto.nome}</h4>
              </div>
            </div>
          ))}
        </div>

        <div className="dsc-btn-next-page">Carregar mais</div>
      </section>
    </>
  );
};

export default Catalogo;
