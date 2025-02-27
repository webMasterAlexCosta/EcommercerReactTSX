import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import ButtonCategoria from "../../../../components/UI/ButtonCategoria.tsx";
import ButtonActions from "../../../../components/UI/ButtonActions.tsx";
import "./styles.css";
import * as produtoService from "../../../../services/ProdutoService.ts"; // Corrigido o nome do serviço
import { ProdutoDTO } from "../../../../models/dto/ProdutosDTO.ts";
import { storageCarrinho } from "../../../../utils/system.ts";
import Alert from "../../../../components/UI/Alert"; // Componente de alerta

const Detalhes = () => {
  const { id } = useParams();
  const [produtoAtual, setProdutoAtual] = useState<ProdutoDTO | null>(null);
  const [produtos, setProdutos] = useState<ProdutoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [alertData, setAlertData] = useState<{ title: string; text: string; icon: "success" | "error" } | null>(null);

  useEffect(() => {
    const fetchProduto = async () => {
      setError("");
      setLoading(true);

      if (id && !isNaN(Number(id))) {
        try {
          const response = await produtoService.findById(Number(id));
          setProdutoAtual(response.data);
        } catch (err) {
          console.error("Erro ao carregar o produto:", err);
          setError("Produto não encontrado!");
        }
      } else {
        setError("ID inválido!");
      }

      try {
        const response = await produtoService.findAll();
        setProdutos(response.data);
      } catch (err) {
        console.error("Erro ao carregar os produtos", err);
        setError("Erro ao carregar produtos.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduto();
  }, [id]);

  if (loading) return <div>Carregando...</div>;

  if (error || !produtoAtual) {
    return (
      <div>
        <p>{error || "Produto não encontrado!"}</p>
        <Link to="/Catalogo">
          <ButtonActions nome="Voltar ao Catálogo" className="dsc-btn dsc-btn-white" />
        </Link>
      </div>
    );
  }

  const currentIndex = produtos.findIndex(produto => produto.id === produtoAtual.id);
  const nextProduto = produtos[currentIndex + 1];
  const lastProduto = produtos[currentIndex - 1];

  const salvaProduto = () => {
    const carrinhoExistente = JSON.parse(localStorage.getItem(storageCarrinho) || "[]");
    const produtoExistente = carrinhoExistente.find((item: ProdutoDTO) => item.id === produtoAtual.id);

    if (produtoExistente) {
      setAlertData({ title: "Erro ao adicionar", text: "Produto já está no carrinho!", icon: "error" });
    } else {
      carrinhoExistente.push(produtoAtual);
      localStorage.setItem(storageCarrinho, JSON.stringify(carrinhoExistente));
      setAlertData({ title: "Sucesso", text: "Produto adicionado ao carrinho!", icon: "success" });
    }
  };

  return (
    <section id="product-details-section" className="dsc-container">
      {alertData && <Alert {...alertData} onClose={() => setAlertData(null)} />}

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
          {lastProduto && (
            <Link to={`/Catalogo/Detalhes/${lastProduto.id}`}>
              <ButtonActions nome="Produto Anterior" className="dsc-btn dsc-btn-white" />
            </Link>
          )}
          {nextProduto && (
            <Link to={`/Catalogo/Detalhes/${nextProduto.id}`}>
              <ButtonActions nome="Próximo Produto" className="dsc-btn dsc-btn-blue" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default Detalhes;
