import './styles.css';
import useCarrinho from '../../../hooks/useCarrinho'; // Certifique-se de apontar para o caminho correto do seu hook
import { useMemo, useState } from 'react';
import Alert from '../../../components/UI/Alert';
import { storageCarrinho } from '../../../utils/system';
import { Link } from 'react-router-dom';

const Carrinho = () => {
  const { produtos, loading, handleQuantityChange, setProdutos } = useCarrinho(); // Verifique se o hook retorna setProdutos
  const [alertData, setAlertData] = useState<{ title: string; text: string; icon: "success" | "error" } | null>(null);

  // Memoizando os subtotais para cada item do carrinho
  const subtotais = useMemo(() => produtos.map((item) => item.preco * item.quantidade), [produtos]);

  // Cálculo do total do carrinho, com base nos subtotais
  const totalCarrinho = useMemo(() => subtotais.reduce((total, subtotal) => total + subtotal, 0), [subtotais]);

  // Formatação do total
  const totalFormatado = totalCarrinho.toFixed(2).replace('.', ',');

  const limparCarrinho = () => {
    setAlertData({ title: "Limpeza Carrinho", text: "Carrinho foi limpo", icon: "success" });
    setTimeout((()=>{
      localStorage.removeItem(storageCarrinho); // Limpa apenas os produtos, sem apagar todo o localStorage
    setProdutos([]); // Atualiza o estado do carrinho para refletir a remoção
   
    }), 2000)
  };

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
            {produtos.map((item, index) => (
              <div key={`${item.id}-${index}`} className="dsc-cart-item-container dsc-line-bottom">
                <div className="dsc-cart-item-left">
                  <img src={item.imgUrl} alt={item.nome} />
                  <div className="dsc-cart-item-description">
                    <h3>{item.nome}</h3>
                    <div className="dsc-cart-item-quantity-container">
                      <button className="dsc-cart-item-quantity-btn" onClick={() => handleQuantityChange(item.id, '-')}>
                        -
                      </button>
                      <p>{item.quantidade}</p>
                      <button className="dsc-cart-item-quantity-btn" onClick={() => handleQuantityChange(item.id, '+')}>
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div className="dsc-cart-item-right">
                  <h3>R$ {subtotais[index].toFixed(2).replace('.', ',')}</h3>
                </div>
              </div>
            ))}

            <div className="dsc-cart-total-container">
              <h3>Total: R$ {totalFormatado} </h3>
            </div>
          </div>
          <div className="dsc-btn-page-container">
            <div className="dsc-btn dsc-btn-blue">Finalizar pedido</div>
            <Link to="/Catalogo">
            <div className="dsc-btn dsc-btn-white" >Continuar comprando</div>
            </Link>
            <div className="dsc-btn dsc-btn-white" onClick={limparCarrinho}>
              Limpar Carrinho
            </div>
            {alertData && <Alert {...alertData} onClose={() => setAlertData(null)} />}
          </div>
        </section>
      )}
    </main>
  );
};

export default Carrinho;
