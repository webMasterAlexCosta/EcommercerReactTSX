import "../Layout/HeaderClient/Styles.css";
import cart from '../../assets/images/cart.svg';
import { useContext, useEffect } from "react";
import * as carrinhoService from "../../services/CarrinhoService";
import ContextCartCount from "../../data/CartCountContext";

interface CartItem {
  quantidade: number;
}

const CartIcon = () => {
  const { contextCartCount, setContextCartCount } = useContext(ContextCartCount);
  
  // Recupera o carrinho do localStorage e converte de volta para o array
  useEffect(() => {
    // Recupera o carrinho do localStorage e converte de volta para o array
    const storedCart = JSON.parse(carrinhoService.getCarrinho() || "[]") || [];
    
    // Calcular a quantidade total de itens no carrinho
    const totalCount: number = storedCart.reduce((acc: number, item: CartItem) => acc + (item.quantidade || 1), 0);
    
    // Atualizar o contexto com o total de itens
    setContextCartCount(totalCount);
  }, [setContextCartCount]); // Recalcula sempre que o carrinho mudar

  return (
    <>
      <img src={cart}width="40px" alt="Carrinho de compras" />
      {contextCartCount > 0 && (
        <div className="number">{contextCartCount}</div>
      )}
    </>
  );
};

export { CartIcon };
