import { useState, useEffect, useContext } from 'react';
import { ProdutoDTO } from '../models/dto/ProdutosDTO';
import { storageCarrinho } from '../utils/system';
import * as carrinhoService from "../services/CarrinhoService";
import ContextCartCount from '../data/CartCountContext';

const useCarrinho = () => {
  const [produtos, setProdutos] = useState<ProdutoDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true); 
  const { setContextCartCount } = useContext(ContextCartCount);

  const cartIconNumber = () => {
    const newCart = JSON.parse(carrinhoService.getCarrinho() || "[]");
    setContextCartCount(newCart.reduce((total: number, item: ProdutoDTO) => total + item.quantidade, 0));
  };

  useEffect(() => {
    
      const produtosNoCarrinho = localStorage.getItem(storageCarrinho);

      if (produtosNoCarrinho) {
        try {
          const produtosParsed: ProdutoDTO[] = JSON.parse(produtosNoCarrinho);
          setProdutos(produtosParsed);
        } catch (error) {
          console.error('Erro ao parsear os produtos do localStorage', error);
        }
      }

      setLoading(false);
    
  }, []); 

  const updateCarrinho = (updatedProdutos: ProdutoDTO[]) => {
    setProdutos(updatedProdutos);
    localStorage.setItem(storageCarrinho, JSON.stringify(updatedProdutos));
  };

  const handleQuantityChange = (id: number, action: '+' | '-') => {
    const updatedProdutos = produtos.map((item) => {
      if (item.id === id) {
        let newQuantity = item.quantidade;
  
        if (action === '+') {
          newQuantity++;
        } else if (action === '-' && newQuantity > 1) {
          newQuantity--;
        } else if (action === '-' && newQuantity === 1) {
          // Quando a quantidade é 1 e o usuário tenta diminuir para 0, removemos o item
          return null; // Marcar o item para remoção
        }
  
        return { ...item, quantidade: newQuantity };
      }
      return item;
    }).filter((item) => item !== null); // Remove itens com valor null
  
    updateCarrinho(updatedProdutos as ProdutoDTO[]); // Atualiza o carrinho com os itens restantes
    cartIconNumber();  // Atualiza o contador do ícone após a alteração da quantidade
    if(updatedProdutos.length ===0){
      return carrinhoService.removeCarirnho(storageCarrinho);
    }
  };
  

  return {
    produtos,
    loading,  
    handleQuantityChange,
    setProdutos,
    cartIconNumber,
    setLoading
  };
};

export default useCarrinho;
