import HeaderClient from "../../components/HeaderClient.tsx";
import ButtonCategoria from "../../components/ButtonCategoria.tsx";
import produtoDTO from "../../models/ProdutosDTO.ts";
import ButtonActions from "../../components/ButtonActions.tsx";
import "./styles.css";
import { useParams } from "react-router-dom";

const Detalhes = () => {
  const { id } = useParams(); // Pega o id da URL
  const produto = produtoDTO.find((produto) => produto.id === parseInt(id!)); // Encontra o produto pelo id

  if (!produto) {
    return <div>Produto não encontrado!</div>; // Caso não encontre o produto
  }

  return (
    <>
      <HeaderClient />
      <section id="product-details-section" className="dsc-container">
        <div className="dsc-card dsc-mb20">
          <div className="dsc-product-details-top dsc-line-bottom">
            <img src={produto.imagem} alt={produto.nome} />
          </div>
          <div className="dsc-product-details-bottom">
            <h3>{produto.preco}</h3>
            <h4>{produto.nome}</h4>
            <p>{produto.descricao}</p>
            <div className="dsc-category-container">
              {produto.categoria.map((categoria) => (
                <ButtonCategoria key={categoria.id} nomeCategoria={categoria.nome} />
              ))}
            </div>
          </div>
        </div>
        <div className="dsc-btn-page-container">
          <ButtonActions nome="Comprar" className="dsc-btn dsc-btn-blue" />
          <ButtonActions nome="Início" className="dsc-btn dsc-btn-white" />
        </div>
      </section>
    </>
  );
};

export default Detalhes;
