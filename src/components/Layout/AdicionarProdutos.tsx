
import { ShoppingCartOutlined } from "@mui/icons-material"; // Ícone de carrinho
import { ContinuarComprando } from "../UI/ContinuarComprando";

const AdicionarProdutos = () => {
  return (
    <>
      <section className="empty-cart">
        <div className="empty-cart-icon">
          <ShoppingCartOutlined style={{ fontSize: "64px", color: "#000" }} />
        </div>
        <h2>Seu carrinho está vazio</h2>
        <p>Adicione alguns produtos para começar a comprar!</p>
        <div className="empty-cart-buttons">
          <ContinuarComprando
            className="dsc-btn dsc-btn-blue"
            link="/catalogo"
            title="Continuar Comprando"
          />
        </div>
      </section>
    </>
  );
};

export { AdicionarProdutos };