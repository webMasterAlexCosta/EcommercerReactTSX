import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import ButtonActions from "../../../../components/UI/ButtonActions.tsx";
import "./styles.css";
import * as produtoService from "../../../../services/ProdutoService.ts";
import * as carinhoService from "../../../../services/CarrinhoService.ts";
import { ProdutoDTO } from "../../../../models/dto/ProdutosDTO.ts";
import Alert from "../../../../components/UI/Alert"; 
import { DetalheProduto } from "../../../../components/Layout/DetalheProduto.tsx";
import ContextCartCount from "../../../../data/CartCountContext.ts";
import { Carregando } from "../../../../components/UI/Carregando.tsx";

const Detalhes = () => {
  const { id } = useParams<{ id: string }>();
  const [produtoAtual, setProdutoAtual] = useState<ProdutoDTO | null>(null);
  const [produtos, setProdutos] = useState<ProdutoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertData, setAlertData] = useState<{ title: string; text: string; icon: "success" | "error" } | null>(null);

  const { setContextCartCount } = useContext(ContextCartCount);

 useEffect(() => {
  const buscarProduto = async () => {
    setLoading(true);

    if (!id || isNaN(parseInt(id))) {
      setLoading(false);
      return;
    }

    try {
      const responseProduto = await produtoService.findById(parseInt(id));

      if (!responseProduto.data || !responseProduto.data.id) {
        setAlertData({ title: "Erro", text: "Produto não encontrado!", icon: "error" });
      } else {
        setProdutoAtual(responseProduto.data);
      }

      const responseProdutos = await produtoService.findAll();
      setProdutos(responseProdutos.data || []);
    } catch (error) {
      setAlertData({ title: "Erro", text: "Ocorreu um erro ao buscar o produto.", icon: "error" });
      console.error(error);
    } finally {
      
      setTimeout(() => {
        setLoading(false);
      }, 2000); 
    }
  };

  buscarProduto();
}, [id]);


  const currentIndex = produtos.findIndex(produto => produto.id === produtoAtual?.id);
  const nextProduto = produtos[currentIndex + 1] || null;
  const lastProduto = produtos[currentIndex - 1] || null;

  const salvaProduto = async () => {
    if (!produtoAtual) {
      setAlertData({ title: "Erro", text: "Produto não encontrado.", icon: "error" });
      return;
    }

    const carrinhoExistente = carinhoService.getCarrinho();
    const produtoExistente = carrinhoExistente.find((item) => item.id === produtoAtual?.id);

    if (produtoExistente) {
      setAlertData({ title: "Erro ao adicionar", text: "Produto já está no carrinho!", icon: "error" });
    } else {
      if (produtoAtual.id !== undefined) {
        const carrinhoItem = {
          ...produtoAtual,
          id: produtoAtual.id,
          categorias: produtoAtual.categorias.map(categoria => categoria.nome)
        };
        carrinhoExistente.push(carrinhoItem);
      } else {
        setAlertData({ title: "Erro", text: "Produto inválido.", icon: "error" });
      }
      carinhoService.setCarrinho(carrinhoExistente);

      setAlertData({ title: "Sucesso", text: "Produto adicionado ao carrinho!", icon: "success" });

      const newCart = carinhoService.getCarrinho();
      setContextCartCount(newCart.reduce((total, item) => total + (item.quantidade || 1), 0));
    }
  };

  return (
    loading ? (
      <Carregando title="Carregando o Produto" />
    ) : (
      <section id="product-details-section" className="alex-container">
        {alertData && <Alert {...alertData} onClose={() => setAlertData(null)} />}

        {produtoAtual ? (
          <DetalheProduto produtoAtual={produtoAtual} />
        ) : (
          <p>Produto não encontrado!</p> 
        )}

        <div className="alex-btn-page-container">
          <ButtonActions nome="Comprar" onNewValue={salvaProduto} className="alex-btn alex-btn-blue" />
          <Link to="/Catalogo">
            <ButtonActions nome="Voltar ao Catálogo" className="alex-btn alex-btn-white" />
          </Link>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
            {lastProduto && (
              <Link to={`/Catalogo/Detalhes/${lastProduto.id}`}>
                <ButtonActions nome="Produto Anterior" className="alex-btn alex-btn-white" />
              </Link>
            )}
            {nextProduto && (
              <Link to={`/Catalogo/Detalhes/${nextProduto.id}`}>
                <ButtonActions nome="Próximo Produto" className="alex-btn alex-btn-blue" />
              </Link>
            )}
          </div>
        </div>
      </section>
    )
  );
};

export default Detalhes;
