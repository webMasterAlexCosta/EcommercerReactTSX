import "./styles.css";
import computador from "../../../assets/images/computer.png";
import { Link, Outlet, useLocation } from "react-router-dom"; // Importando useLocation
import ButtonActions from "../../../components/ButtonActions";
import produtoDTO from "../../../models/ProdutosDTO";

const Catalogo = () => {
  const location = useLocation(); // Obtém a localização atual da URL

  // Verifica se a rota atual é para detalhes, se for, ocultamos o catálogo
  const isDetailsPage = location.pathname.includes("/Catalogo/Detalhes");

  if (isDetailsPage) {
    return <Outlet />; // Quando estiver na página de detalhes, apenas renderiza o Outlet
  }

  return (
    <section id="catalog-section" className="dsc-container">
      <form className="dsc-search-bar">
        <button type="submit">🔎︎</button>
        <input type="text" placeholder="Nome do produto" />
        <button type="reset">🗙</button>
      </form>

      {/* O catálogo em si */}
      <div className="dsc-catalog-cards dsc-mb20 dsc-mt20">
        {produtoDTO.map((itemProduto) => (
          <div key={itemProduto.id} className="dsc-card">
            <div className="dsc-catalog-card-top dsc-line-bottom">
              <img src={computador} alt={itemProduto.nome} />
            </div>
            <div style={{ width: "auto" }}>
              {/* Link para a página de detalhes do produto */}
              <Link to={`/Catalogo/Detalhes/${itemProduto.id}`}>
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

      {/* Aqui é onde o conteúdo do detalhe vai ser renderizado */}
      <Outlet />
    </section>
  );
};

export default Catalogo;
