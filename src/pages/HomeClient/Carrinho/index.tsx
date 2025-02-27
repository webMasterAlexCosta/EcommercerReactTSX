import './styles.css';
import { useEffect, useState } from 'react';
import { ProdutoDTO } from '../../../models/dto/ProdutosDTO';
import { storageCarrinho } from '../../../utils/system';

const Carrinho = () => {
  const [produtos, setProdutos] = useState<ProdutoDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulando um tempo de carregamento de 3 segundos
    setTimeout(() => {
      const produtosNoCarrinho = localStorage.getItem(storageCarrinho);

      if (produtosNoCarrinho) {
        try {
          const produtosParsed: ProdutoDTO[] = JSON.parse(produtosNoCarrinho);
          setProdutos(produtosParsed);
        } catch (error) {
          console.error('Erro ao parsear os produtos do localStorage', error);
        }
      }

      setLoading(false); // Finaliza o carregamento após 3 segundos
    }, 1000); // Espera 3000ms (3 segundos)
  }, []);

  return (
    <main>
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando seus produtos...</p>
        </div>
      ) : produtos.length === 0 ? (
        <section className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Seu carrinho está vazio</h2>
          <p>Adicione alguns produtos para começar a comprar!</p>
          <div className="empty-cart-buttons">
            <button className="dsc-btn dsc-btn-blue">Continuar Comprando</button>
          </div>
        </section>
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
