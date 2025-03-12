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
    try {
      // Obtendo o carrinho do serviço e convertendo para JSON
      const storedCart = carrinhoService.getCarrinho();
      const cartArray: CartItem[] = storedCart ? JSON.parse(JSON.stringify(storedCart)) : [];

      // Calcula a quantidade total de itens no carrinho
      const totalCount = cartArray.reduce((acc, item) => acc + (item.quantidade || 1), 0);
      
      // Atualiza o contexto
      setContextCartCount(totalCount);
    } catch (error) {
      console.error("Erro ao recuperar o carrinho:", error);
    }
  }, [setContextCartCount, contextCartCount]); // Agora, o efeito será disparado quando o contador mudar

  return (
    <>
      <img src={cart} width="40px" alt="Carrinho de compras" />
      {contextCartCount > 0 && <div className="number">{contextCartCount}</div>}
    </>
  );
};

export { CartIcon };
