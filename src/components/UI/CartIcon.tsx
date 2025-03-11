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
  
  useEffect(() => {
    const storedCart: CartItem[] = carrinhoService.getCarrinho();

    const totalCount = storedCart.reduce((acc, item) => acc + (item.quantidade || 1), 0);
    
    setContextCartCount(totalCount);
  }, [setContextCartCount]);

  return (
    <>
      <img src={cart} width="40px" alt="Carrinho de compras" />
      {contextCartCount > 0 && <div className="number">{contextCartCount}</div>}
    </>
  );
};

export { CartIcon };
