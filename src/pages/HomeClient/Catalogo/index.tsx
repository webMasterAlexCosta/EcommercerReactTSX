import "./styles.css";
import { Link, Outlet, useLocation } from "react-router-dom";
import ButtonActions from "../../../components/ButtonActions";
import axios from "axios";
import { useState, useEffect } from "react"; // Importando useState e useEffect

// Defina a interface para o produto
interface Produto {
  id: number;
  nome: string;
  preco: string;
  imgUrl: string;
  // Adicione outras propriedades conforme necessário
}

const Catalogo = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]); // Estado para armazenar os produtos
  const location = useLocation(); // Obtém a localização atual da URL

  // Verifica se a rota atual é para detalhes, se for, ocultamos o catálogo
  const isDetailsPage = location.pathname.includes("/Catalogo/Detalhes");

  // Efeito para buscar os produtos quando o componente for montado
  useEffect(() => {
    // Fazendo a requisição para obter os produtos
    axios.get("http://localhost:8080/produtos/lista")
      .then(response => {
        setProdutos(response.data); // Armazenando os produtos no estado (verificando se content existe)
        console.log("no catalogo"+response.data);
      })
      .catch(error => {
        console.error("Erro ao carregar os produtos", error);
      });
  }, []); // O array vazio faz com que o efeito seja executado apenas uma vez (quando o componente for montado)

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
        {produtos && produtos.length > 0 ? (
          produtos.map(itemProduto => (
            <div key={itemProduto.id} className="dsc-card">
              <div className="dsc-catalog-card-top dsc-line-bottom">
                <img src={itemProduto.imgUrl} alt={itemProduto.nome} />
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
          ))
        ) : (
          <p>Carregando produtos...</p> // Mensagem exibida enquanto os produtos não são carregados
        )}
      </div>

      <div className="dsc-btn-next-page">Carregar mais</div>

      {/* Aqui é onde o conteúdo do detalhe vai ser renderizado */}
      <Outlet />
    </section>
  );
};

export default Catalogo;
