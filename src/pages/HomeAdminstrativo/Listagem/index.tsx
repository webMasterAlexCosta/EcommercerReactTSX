import { Link } from "react-router-dom";
import ListaProdutos from "../../../components/Layout/ListaProdutosAdmin";
import "./style.css";
import { BarraBuscar } from "../../../components/Layout/BarraBuscar";
import { useEffect, useState } from "react";
import { ProdutoDTO } from "../../../models/dto/ProdutosDTO";
import { findByRequest, findAll } from "../../../services/ProdutoService";
import { Carregando } from "../../../components/UI/Carregando";
import { TEXTO_PADRAO_SOLICITACAO } from "../../../utils/system";

const Listagem = () => {
  const [searchName, setSearchName] = useState('');
  const [loading, setLoading] = useState(false);
  const [produtos, setProdutos] = useState<ProdutoDTO[]>([]);
  const [page, setPage] = useState(0);

  const buscarProdutos = async () => {
    setLoading(true);
    try {
      let response;
      let produtosRecebidos: ProdutoDTO[] = [];

      if (searchName) {
        response = await findByRequest(searchName);
        produtosRecebidos = response.data.content ?? response.data;
      } else {
        response = await findAll(page);
        produtosRecebidos = response.data.content ?? response.data;
      }

      setProdutos(produtosRecebidos);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  const carregarMaisProdutos = async () => {
    setLoading(true);
    setPage(prevPage => prevPage + 1);  
    try {
      let response;
      let produtosRecebidos: ProdutoDTO[] = [];

      if (searchName) {
        response = await findByRequest(searchName);
        produtosRecebidos = response.data.content ?? response.data;
      } else {
        response = await findAll(page + 1);  
        produtosRecebidos = response.data.content ?? response.data;
      }

      setProdutos(prevProdutos => [...prevProdutos, ...produtosRecebidos]);
    } catch (error) {
      console.error("Erro ao carregar mais produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarProdutos(); 
  }, [searchName, page]);  

  return (
    <main>
      <section id="product-listing-section" className="alex-container">
        <h2 className="alex-section-title alex-mb20">Cadastro de produtos</h2>

        <div className="alex-btn-page-container alex-mb20">
          <Link to="/Administrativo/CriarNovoProduto/novo" className="alex-btn alex-btn-white">
            Novo
          </Link>
        </div>

        <BarraBuscar onSearch={(item) => {
          setSearchName(item); 
          setPage(0);  
        }} />

        {loading ? (
          <Carregando title={TEXTO_PADRAO_SOLICITACAO}/>
        ) : (
          
              <ListaProdutos produtosRecebidos={produtos} />
          
        )}

        {!loading && (
          <div className="alex-btn-next-page" onClick={carregarMaisProdutos}>
            Carregar mais
          </div>
        )}
      </section>
    </main>
  );
};

export default Listagem;
