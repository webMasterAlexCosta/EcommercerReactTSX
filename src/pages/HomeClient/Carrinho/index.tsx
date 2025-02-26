import './styles.css';
import { useEffect, useState } from 'react';
import { ProdutoDTO } from '../../../models/dto/ProdutosDTO';
import { storageCarrinho } from '../../../utils/system';

const Carrinho = () => {
  const [produtos, setProdutos] = useState<ProdutoDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Carregar os produtos do localStorage
  useEffect(() => {
    const produtosNoCarrinho = localStorage.getItem(storageCarrinho);

    if (produtosNoCarrinho) {
      try {
        // Parse no conteúdo e verificar se a estrutura é um array
        const produtosParsed: ProdutoDTO[] = JSON.parse(produtosNoCarrinho);
        setProdutos(produtosParsed);
      } catch (error) {
        console.error('Erro ao parsear os produtos do localStorage', error);
      }
    }

    // Mudar o estado para "loading" false após a leitura do localStorage
    setLoading(false);
  }, []);

  return (
    <main>
      {loading ? (
        <div>Carregando...</div> // Exibe "Carregando..." enquanto os produtos são carregados
      ) : produtos.length === 0 ? (
        <div>Carrinho Vazio</div> // Exibe quando não houver produtos no carrinho
      ) : (
        <section id="cart-container-section" className="dsc-container">
          <div className="dsc-card dsc-mb20">
            {produtos.map((item) => (
              <div key={item.id} className="dsc-cart-item-container dsc-line-bottom">
                <div className="dsc-cart-item-left">
                  <img src={item.imgUrl} alt={item.nome} />
                  <div className="dsc-cart-item-description">
                    <h3>{item.nome}</h3>
                    <div className="dsc-cart-item-quantity-container">
                      <div className="dsc-cart-item-quantity-btn">-</div>
                      <p>1</p>
                      <div className="dsc-cart-item-quantity-btn">+</div>
                    </div>
                  </div>
                </div>
                <div className="dsc-cart-item-right">
                  {item.preco}
                </div>
              </div>
            ))}

            <div className="dsc-cart-total-container">
              <h3>R$ 15000,00</h3> {/* Aqui você pode calcular o total dinamicamente */}
            </div>
          </div>
          <div className="dsc-btn-page-container">
            <div className="dsc-btn dsc-btn-blue">
              Finalizar pedido
            </div>
            <div className="dsc-btn dsc-btn-white">
              Continuar comprando
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default Carrinho;
