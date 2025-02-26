import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import ButtonCategoria from "../../../../components/UI/ButtonCategoria.tsx";
import ButtonActions from "../../../../components/UI/ButtonActions.tsx";
import "./styles.css";
import * as produtoService from "../../../../services/ProdotoService.ts";
import { ProdutoDTO } from "../../../../models/dto/ProdutosDTO.ts";
import { storageCarrinho } from "../../../../utils/system.ts";

const Detalhes = () => {
  const { id } = useParams(); // Pega o id do produto da URL
  const [produtoAtual, setProdutoAtual] = useState<ProdutoDTO | null>(null); // Estado para armazenar o produto
  const [produtos, setProdutos] = useState<ProdutoDTO[]>([]); // Estado para armazenar todos os produtos
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [error, setError] = useState<string>(""); // Estado de erro, caso ocorra algum problema

  useEffect(() => {
    const fetchProduto = async () => {
      setError(""); // Limpa o erro anterior
      setLoading(true); // Inicia o carregamento
      if (id && !isNaN(Number(id))) { // Valida se o id é válido
        try {
          const response = await produtoService.findById(Number(id));
          setProdutoAtual(response.data); // Armazenando o produto no estado
        } catch (err) {
          console.error("Erro ao carregar o produto:", err);
          setError("Produto não encontrado!");
        }
      } else {
        setError("ID inválido!");
      }

      // Carregar todos os produtos (para navegação entre produtos)
      try {
        const response = await produtoService.findAll();
        setProdutos(response.data); // Armazenando todos os produtos no estado
      } catch (err) {
        console.error("Erro ao carregar os produtos", err);
        setError("Erro ao carregar produtos.");
      } finally {
        setLoading(false); // Finaliza o carregamento
      }
    };
    fetchProduto();
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

  const salvaProduto = () => {
    // Recupera os produtos já presentes no carrinho
    const carrinhoExistente = JSON.parse(localStorage.getItem(storageCarrinho) || "[]");
  
    // Adiciona o produto atual ao carrinho
    carrinhoExistente.push(produtoAtual);
  
    // Salva novamente no localStorage
    localStorage.setItem(storageCarrinho, JSON.stringify(carrinhoExistente));
  };


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
            
            {produtoAtual.categorias.map(categoria => (
              <ButtonCategoria key={categoria.id} nomeCategoria={categoria.nome} />
            ))}
          </div>
        </div>
      </div>

      <div className="dsc-btn-page-container">
        <ButtonActions nome="Comprar" onNewValue={salvaProduto} className="dsc-btn dsc-btn-blue" />
        <Link to="/Catalogo">
          <ButtonActions nome="Voltar ao Catálogo" className="dsc-btn dsc-btn-white" />
        </Link>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
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
