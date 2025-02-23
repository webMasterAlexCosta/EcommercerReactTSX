import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import ButtonCategoria from "../../../../components/ButtonCategoria.tsx";
import ButtonActions from "../../../../components/ButtonActions.tsx";
import axios from "axios";
import "./styles.css";
import { BASE_URL_LOCAL } from "../../../../utils/system.ts";

// Defina a interface para o produto
interface Produto {
  id: number;
  nome: string;
  preco: string;
  imgUrl: string;
  descricao: string;
  categorias: { id: number; nome: string }[];
}

const Detalhes = () => {
  const { id } = useParams(); // Pega o id do produto da URL
  const [produtoAtual, setProdutoAtual] = useState<Produto | null>(null); // Estado para armazenar o produto
  const [produtos, setProdutos] = useState<Produto[]>([]); // Estado para armazenar todos os produtos
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [error, setError] = useState<string>(""); // Estado de erro, caso ocorra algum problema
  

  useEffect(() => {
    // Carregar o produto específico
    
    if (id) {
      axios.get(`${BASE_URL_LOCAL}/produtos/${id}`)
        .then(response => {
          setProdutoAtual(response.data); // Armazenando o produto no estado
          setLoading(false);
        })
        .catch(err => {
          console.error("Erro ao carregar o produto:", err);
          setError("Produto não encontrado!");
          setLoading(false);
        });
    }

    // Carregar todos os produtos (para navegação entre produtos)
    axios.get(`${BASE_URL_LOCAL}/produtos/lista`)
      .then(response => {
        setProdutos(response.data); // Armazenando todos os produtos no estado
      })
      .catch(err => {
        console.error("Erro ao carregar os produtos", err);
      });
  }, [id]); // Requisita os dados sempre que o id mudar

  if (loading) {
    return <div>Carregando...</div>; // Mostra enquanto os dados estão sendo carregados
  }

  if (error || !produtoAtual) {
    return <div>{error}</div>; // Exibe erro se o produto não for encontrado ou se ocorrer um erro
  }

  // Encontra o índice do produto atual
  const currentIndex = produtos.findIndex(produto => produto.id === produtoAtual.id);

  // Encontra o próximo produto, caso exista
  const nextProduto = produtos[currentIndex + 1];
  const lastProduto = produtos[currentIndex - 1];

  return (
    <section id="product-details-section" className="dsc-container">
      <div className="dsc-card dsc-mb20">
        <div className="dsc-product-details-top dsc-line-bottom">
          <img src={produtoAtual.imgUrl} alt={produtoAtual.nome} />
        </div>
        <div className="dsc-product-details-bottom">
          <h3>{produtoAtual.preco}</h3>
          <h4>{produtoAtual.nome}</h4>
          <p>{produtoAtual.descricao}</p>
          <div className="dsc-category-container">
            {/*  acessar 'categorias' */}
            {produtoAtual.categorias.map(categoria => (
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
        <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
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
