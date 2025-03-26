import "./styles.css";
import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import * as produtoService from "../../../services/ProdutoService";
import { CardProduto } from "../../../components/Layout/CardProduto";
import { BarraBuscar } from "../../../components/Layout/BarraBuscar";
import useCarrinho from "../../../hooks/useCarrinho";
import { HorarioBuscaPedidoContext } from "../../../data/HorarioBuscaPedidoContext";
import { ProdutoDTO } from "../../../models/dto/ProdutosDTO";
import { TEMPO_DE_BUSCA_PRODUTOS } from "../../../utils/system";

const Catalogo = () => {
  const [produtos, setProdutos] = useState<ProdutoDTO[]>([]);
  const [page, setPage] = useState(0);
  const [searchName, setSearchName] = useState('');
  const location = useLocation();
  const { loading, setLoading } = useCarrinho();
  const { setUltimaBusca, ultimaBusca } = useContext(HorarioBuscaPedidoContext);
  const [carregarMais, setCarregarMais] = useState("Carregar Mais");

  const isDetailsPage = location.pathname.includes("/Catalogo/Detalhes");

  const verificarProdutoExistente = (produtoNovo: ProdutoDTO, produtosLocal: ProdutoDTO[]) => {
    return produtosLocal.some(produto => produto.id === produtoNovo.id);
  };

  const salvarProdutosNoLocalStorage = (produtosRecebidos: ProdutoDTO[]) => {
    const produtosLocal = produtoService.getProdutoLocal();
    const produtosExistentes = produtosLocal && produtosLocal.content ? produtosLocal.content : [];

    const produtosParaSalvar = produtosRecebidos.filter((produtoNovo) =>
      !verificarProdutoExistente(produtoNovo, produtosExistentes)
    );

    if (produtosParaSalvar.length > 0) {
      const novosProdutos = [...produtosExistentes, ...produtosParaSalvar];
      produtoService.savarProdutoLocal({ ...produtosLocal, content: novosProdutos });
    }
  };

  const buscarProdutos = async () => {
    setLoading(true);
    try {
      let response;
      let produtosRecebidos: ProdutoDTO[] = [];

      if (searchName) {
        response = await produtoService.findByRequest(searchName);
        produtosRecebidos = response.data.content ?? response.data;
      } else {
        const produtosLocal = produtoService.getProdutoLocal();

        if (produtosLocal && produtosLocal.content && produtosLocal.content.length > 0) {
          produtosRecebidos = produtosLocal.content;
          setProdutos(produtosRecebidos);
        } else {
          response = await produtoService.findAll(page);
          produtosRecebidos = response.data.content ?? response.data;
          salvarProdutosNoLocalStorage(produtosRecebidos); 
          setProdutos(produtosRecebidos);
        }
      }

      setCarregarMais("Carregar Mais");
      setUltimaBusca(new Date()); 
    } catch (error) {
      console.error("Erro na busca:", error);
      setCarregarMais("Ocorreu um erro ao Buscar");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarProdutos(); 
  }, [page, searchName]);

  const carregarMaisProdutos = async () => {
    setCarregarMais("Aguarde");
    setPage((prevPage) => prevPage + 1); 
    const response = await produtoService.findAll(page + 1); 
    const produtosRecebidos = response.data.content ?? response.data;
    const produtosLocal = produtoService.getProdutoLocal();
    const localProdutos = produtosLocal && produtosLocal.content ? produtosLocal.content : [];
    const novosProdutos = [...localProdutos, ...produtosRecebidos];
    salvarProdutosNoLocalStorage(novosProdutos);
    setProdutos((prevProdutos) => [...prevProdutos, ...produtosRecebidos]); 
  };

  useEffect(() => {
    const currentTime = Date.now(); 
    const tempoDesdeUltimaBusca = currentTime - ultimaBusca.getTime(); 

    if (tempoDesdeUltimaBusca >= TEMPO_DE_BUSCA_PRODUTOS) {
      produtoService.limparProdutoLocal()
      buscarProdutos();
      setUltimaBusca(new Date()); 
    }
  }, [ultimaBusca]);

  if (isDetailsPage) {
    return <Outlet />;
  }

  return (
    <section id="catalog-section" className="alex-container">
      <BarraBuscar onSearch={(item) => {
        setSearchName(item);
        setPage(0);
      }} />

      <CardProduto produtos={produtos} loading={loading} />

      {!searchName && (
        <div className="alex-btn-next-page" onClick={carregarMaisProdutos}>
          {carregarMais}
        </div>
      )}

      <Outlet />
    </section>
  );
};

export default Catalogo;
