import { useParams, Link } from "react-router-dom";
import produtoDTO from "../../../../models/ProdutosDTO.ts";
import ButtonCategoria from "../../../../components/ButtonCategoria.tsx";
import ButtonActions from "../../../../components/ButtonActions.tsx";
import "./styles.css";

const Detalhes = () => {
  const { id } = useParams();
  const produtoAtual = produtoDTO.find((produto) => produto.id === parseInt(id!));

  if (!produtoAtual) {
    return <div>Produto não encontrado!</div>;
  }

  // Encontra o índice do produto atual
  const currentIndex = produtoDTO.findIndex((produto) => produto.id === parseInt(id!));

  // Encontra o próximo produto, caso exista
  const nextProduto = produtoDTO[currentIndex + 1]; // Pega o próximo item na lista
  const lastProduto = produtoDTO[currentIndex - 1]; // Pega o último item da lista

  return (
    <section id="product-details-section" className="dsc-container">
      <div className="dsc-card dsc-mb20">
        <div className="dsc-product-details-top dsc-line-bottom">
          <img src={produtoAtual.imagem} alt={produtoAtual.nome} />
        </div>
        <div className="dsc-product-details-bottom">
          <h3>{produtoAtual.preco}</h3>
          <h4>{produtoAtual.nome}</h4>
          <p>{produtoAtual.descricao}</p>
          <div className="dsc-category-container">
            {produtoAtual.categoria.map((categoria) => (
              <ButtonCategoria key={categoria.id} nomeCategoria={categoria.nome} />
            ))}
          </div>
        </div>
      </div>

      <div className="dsc-btn-page-container">
        <ButtonActions nome="Comprar" className="dsc-btn dsc-btn-blue" />
        <Link to="/Catalogo">
          <ButtonActions nome="Voltar ao Catálogo" className="dsc-btn dsc-btn-white" />
        </Link>
        <div style={{ display: "flex", justifyContent: "space-between",gap: "10px" }}>
          {/* Botão Próximo - exibe o próximo produto, se existir */}
          {nextProduto && (
            <Link to={`/Catalogo/Detalhes/${nextProduto.id}`}>
              <ButtonActions nome="Próximo Produto" className="dsc-btn dsc-btn-blue" />
            </Link>
          )}
          {lastProduto && (
            <Link to={`/Catalogo/Detalhes/${lastProduto.id}`}>
              <ButtonActions nome="Produto Anterior" className="dsc-btn dsc-btn-white" />
            </Link>
          )}

        </div>

      </div>
    </section>
  );
};

export default Detalhes;
