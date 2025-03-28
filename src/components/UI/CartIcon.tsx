import "../Layout/HeaderClient/Styles.css";
import { useContext, useEffect } from "react";
import * as carrinhoService from "../../services/CarrinhoService";
import ContextCartCount from "../../data/CartCountContext";
import { ShoppingCart } from "@mui/icons-material";

interface CartItem {
  quantidade: number;
}

const CartIcon = () => {
  const { contextCartCount, setContextCartCount } = useContext(ContextCartCount);

  useEffect(() => {
    try {
      const storedCart = carrinhoService.getCarrinho();
      const cartArray: CartItem[] = storedCart ? JSON.parse(JSON.stringify(storedCart)) : [];

      const totalCount = cartArray.reduce((acc, item) => acc + (item.quantidade || 1), 0);
      
      setContextCartCount(totalCount);
    } catch (error) {
      console.error("Erro ao recuperar o carrinho:", error);
    }
  }, [setContextCartCount, contextCartCount]); 

  return (
    <>
      
    <ShoppingCart className="iconeCarrinho" style={{ fontSize: 40, color: 'black' }} />
    {contextCartCount > 0 && (
      <div className="number">
        {contextCartCount}
      </div>
    )}
  
    </>
  );
};

export { CartIcon };
  