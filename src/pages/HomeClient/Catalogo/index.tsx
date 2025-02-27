import "./styles.css";
import { Link, Outlet, useLocation } from "react-router-dom";
import ButtonActions from "../../../components/UI/ButtonActions";
import { useState, useEffect } from "react";
import * as produtoService from "../../../services/ProdutoService";
import { ProdutoDTO } from "../../../models/dto/ProdutosDTO";



const Catalogo = () => {
  const [produtos, setProdutos] = useState<ProdutoDTO[]>([]); // Estado para armazenar os produtos
  const [loading, setLoading] = useState<boolean>(false); // Estado para o carregamento
  const [error, setError] = useState<string | null>(null); // Estado para o erro
  const [page, setPage] = useState<number>(1); // Para carregar mais produtos

  const location = useLocation(); // Obtém a localização atual da URL

  const isDetailsPage = location.pathname.includes("/Catalogo/Detalhes");

  useEffect(() => {
    const fetchProdutos = async () => {
      setLoading(true);
      setError(null); // Limpa erros anteriores
      try {
        const response = await produtoService.findAll();
        setProdutos(response.data);
        console.log(response.data)
      } catch (error) {
        setError("Erro ao carregar os produtos." + error);
      } finally {
        setLoading(false);
      }
    };

    fetchProdutos();
  }, [page]); // Dependência para carregar novos produtos quando a página mudar

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

      {/* Exibe mensagem de erro, se houver */}
      {error && <p className="error-message">{error}</p>}

      {/* O catálogo em si */}
      <div className="dsc-catalog-cards dsc-mb20 dsc-mt20">
        {loading ? (
          <p>Carregando produtos...</p> // Exibe o texto de carregamento
        ) : produtos && produtos.length > 0 ? (
          produtos.map(itemProduto => (
            <div key={itemProduto.id} className="dsc-card">
              <div className="dsc-catalog-card-top dsc-line-bottom">
                <img src={itemProduto.imgUrl} alt={itemProduto.nome} />
              </div>
              <div style={{ width: "auto" }}>
                <Link to={`/Catalogo/Detalhes/${itemProduto.id}`}>
                  <ButtonActions nome="Detalhes" className="dsc-btn dsc-btn-blue" />
                </Link>
              </div>
              <div className="dsc-catalog-card-bottom">
                <h3>{itemProduto.preco}</h3>
                <h4>{itemProduto.nome}</h4>
              </div>
            </div>
          ))
        ) : (
          <p>Nenhum produto encontrado.</p> // Caso não haja produtos
        )}
      </div>

      {/* Botão de carregar mais produtos */}
      <div className="dsc-btn-next-page" onClick={() => setPage(prevPage => prevPage + 1)}>
        Carregar mais
      </div>

      <Outlet />
    </section>
  );
};

export default Catalogo;
