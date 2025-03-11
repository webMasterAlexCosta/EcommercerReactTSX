import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import ButtonActions from "../../../../components/UI/ButtonActions.tsx";
import "./styles.css";
import * as produtoService from "../../../../services/ProdutoService.ts";
import * as carinhoService from "../../../../services/CarrinhoService.ts";
import { ProdutoDTO } from "../../../../models/dto/ProdutosDTO.ts";
import { storageCarrinho } from "../../../../utils/system.ts";
import Alert from "../../../../components/UI/Alert"; 
import { DetalheProduto } from "../../../../components/Layout/DetalheProduto.tsx";
import ContextCartCount from "../../../../data/CartCountContext.ts";
import { Carregando } from "../../../../components/UI/Carregando.tsx";

const Detalhes = () => {
  const { id } = useParams();
  const [produtoAtual, setProdutoAtual] = useState<ProdutoDTO | null>(null);
  const [produtos, setProdutos] = useState<ProdutoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [alertData, setAlertData] = useState<{ title: string; text: string; icon: "success" | "error" } | null>(null);

const { setContextCartCount} = useContext(ContextCartCount)

  useEffect(() => {
    const buscarProduto = async () => {
      setError("");
      setLoading(true);

      if (!id || isNaN(parseInt(id))) {
        setError("ID inválido!");
        setLoading(false);
        return;
      }
      try {
        // Busca o produto específico
        const responseProduto = await produtoService.findById(Number(id));
        if (!responseProduto.data) {
          setError("Produto não encontrado!");
          console.log(error)
        } else {
          setProdutoAtual(responseProduto.data);
        }
        // Busca a lista de produtos para navegação
        const responseProdutos = await produtoService.findAll();
        console.log("Lista de produtos carregada:", responseProdutos.data.content);
        setProdutos(responseProdutos.data || []);
      } catch (err) {
        console.error("Erro ao carregar os dados:", err);
        setError("Erro ao carregar o produto!");
      } finally {
        setLoading(false);
      }
    };

    buscarProduto();
  }, [id,error]); 

 // if (loading) return <div>Carregando...</div>;

  // if (error || !produtoAtual) {
  //   return (
  //     <div>
  //       <p>{error || "Produto não encontrado!"}</p>
  //       <Link to="/Catalogo">
  //         <ButtonActions nome="Voltar ao Catálogo" className="dsc-btn dsc-btn-white" />
  //       </Link>
  //     </div>
  //   );
  // }
  // aqui bruno estou definindo a Lógica para pegar próximo e anterior
  const currentIndex = produtos.findIndex(produto => produto.id === produtoAtual?.id);
  const nextProduto = produtos[currentIndex + 1] || null;
  const lastProduto = produtos[currentIndex - 1] || null;

  const salvaProduto = async() => {
    const carrinhoExistente = JSON.parse( carinhoService.getCarrinho() || "[]");
    const produtoExistente = carrinhoExistente.find((item: ProdutoDTO) => item.id === produtoAtual?.id);

    if (produtoExistente) {
      setAlertData({ title: "Erro ao adicionar", text: "Produto já está no carrinho!", icon: "error" });
    } else {
      carrinhoExistente.push(produtoAtual);
      carinhoService.setCarrinho(storageCarrinho, JSON.stringify(carrinhoExistente));
      setAlertData({ title: "Sucesso", text: "Produto adicionado ao carrinho!", icon: "success" });
      const newCart = JSON.parse(carinhoService.getCarrinho() || "[]");
      setContextCartCount(newCart.reduce((total: number, item: ProdutoDTO) => total + item.quantidade,0));
    }
  };

  return (
    loading ? (
      <Carregando title="Carregando o Produto" />
    ) : (
      <section id="product-details-section" className="dsc-container">
        {alertData && <Alert {...alertData} onClose={() => setAlertData(null)} />}
  
        {produtoAtual && <DetalheProduto produtoAtual={produtoAtual} />}
  
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
    )
  );
  
}
export default Detalhes;
