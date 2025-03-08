import "./styles.css";
import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import * as produtoService from "../../../services/ProdutoService";
import { ProdutoDTO } from "../../../models/dto/ProdutosDTO";
import { CardProduto } from "../../../components/Layout/CardProduto";
import { BarraBuscar } from "../../../components/Layout/BarraBuscar";
import useCarrinho from "../../../hooks/useCarrinho";

const Catalogo = () => {
  const [produtos, setProdutos] = useState<ProdutoDTO[]>([]);
//const [montando, setMontando] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [searchName, setSearchName] = useState<string>(""); 
  const location = useLocation();
  const {loading,setLoading} = useCarrinho()
  const isDetailsPage = location.pathname.includes("/Catalogo/Detalhes");
  const [carregarMais,setCarregarMais] = useState<string>("Carregar Mais")

  useEffect(() => {
    const buscarProdutos = async () => {
      setLoading(true);
      try {
        let response;
        if (searchName) {
          console.log(`Buscando por nome: ${searchName}`);
          response = await produtoService.findByRequest(searchName);
          console.log("Resposta da busca:", response.data);
        } else {
          response = await produtoService.findAll(page);
        }

        const produtosRecebidos = response.data.content ?? response.data; 
        console.log("Produtos recebidos:", produtosRecebidos);

        setProdutos((prevProdutos) =>
          page === 0 || searchName ? produtosRecebidos : [...prevProdutos, ...produtosRecebidos]
        );
        setCarregarMais("Carregar Mais")
      } catch (error) {
        console.error("Erro na busca:", error);
       setCarregarMais("Ocorreu um erro ao Buscar")
      } finally {
        setLoading(false);
      }
    };

    buscarProdutos();
  }, [page, searchName, setLoading]); 

  if (isDetailsPage) {
    return <Outlet />;
  }

  return (
    <section id="catalog-section" className="dsc-container">
      <BarraBuscar onSearch={(item) => {
        setSearchName(item);
        setPage(0); // Reseta a página ao buscar
      }} />

      

      <CardProduto produtos={produtos} loading={loading} />

      {!searchName && ( 
        <div className="dsc-btn-next-page" onClick={() => { setPage((prevPage) => prevPage + 1); setCarregarMais("Aguarde"); }}>
          {carregarMais}
        </div>
      )}

      <Outlet />
    </section>
  );
};

export default Catalogo;
