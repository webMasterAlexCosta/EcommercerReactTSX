import "./styles.css";
import { Outlet, useLocation } from "react-router-dom";

import { useState, useEffect } from "react";
import * as produtoService from "../../../services/ProdutoService";
import { ProdutoDTO } from "../../../models/dto/ProdutosDTO";
import { CardProduto } from "../../../components/UI/CardProduto";



const Catalogo = () => {
  const [produtos, setProdutos] = useState<ProdutoDTO[]>([]); // Estado para armazenar os produtos
  const [loading, setLoading] = useState<boolean>(false); // Estado para o carregamento
  const [error, setError] = useState<string | null>(null); // Estado para o erro
  const [page, setPage] = useState<number>(0); // Para carregar mais produtos
  console.log(page)
  console.log(produtos)
  const location = useLocation(); // Obtém a localização atual da URL

  const isDetailsPage = location.pathname.includes("/Catalogo/Detalhes");

  useEffect(() => {
    const buscarProdutos = async () => {
      setLoading(true);
      setError(null); // Limpa erros anteriores
      try {
        const response = await produtoService.findAll(page);
        setProdutos(item => [...item, ...response.data.content]);

      } catch (error) {
        setError("Erro ao carregar os produtos." + error);
      } finally {
        setLoading(false);
      }
    };
    buscarProdutos();
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

      <CardProduto produtos={produtos} loading={loading} />

      {/* Botão de carregar mais produtos */}
      <div className="dsc-btn-next-page" onClick={() => setPage(prevPage => prevPage + 1)}>
        Carregar mais
      </div>

      <Outlet />
    </section>
  );
};

export default Catalogo;
