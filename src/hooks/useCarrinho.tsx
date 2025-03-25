import { useState, useEffect, useContext, useCallback } from 'react';
import { ProdutoDTO } from '../models/dto/ProdutosDTO';
import * as carrinhoService from "../services/CarrinhoService";
import ContextCartCount from '../data/CartCountContext';

const useCarrinho = () => {
  const [produtos, setProdutos] = useState<ProdutoDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true); 
  const { setContextCartCount } = useContext(ContextCartCount);

  const cartIconNumber = useCallback((cart?: ProdutoDTO[]) => {
    const newCart = cart ?? carrinhoService.getCarrinho();
    const totalItems = (newCart as ProdutoDTO[]).reduce((total: number, item: ProdutoDTO) => total + (item.quantidade || 0), 0);
    setContextCartCount(totalItems);
  }, [setContextCartCount]);

  useEffect(() => {
    try {
      const produtosNoCarrinho = carrinhoService.getCarrinho();
      if (produtosNoCarrinho) {
        const produtosParsed: ProdutoDTO[] = JSON.parse(JSON.stringify(produtosNoCarrinho));
        setProdutos(produtosParsed);
        cartIconNumber(produtosParsed); 
      }
    } catch (error) {
      console.error('Erro ao parsear os produtos do localStorage', error);
    } finally {
      setLoading(false);
    }
  }, [cartIconNumber]); 

  const updateCarrinho = (updatedProdutos: ProdutoDTO[]) => {
    if (updatedProdutos.length === 0) {
      carrinhoService.removeCarrinho();
      setProdutos([]);
      cartIconNumber([]); 
      
    } else {
      setProdutos(updatedProdutos);
      const carrinhoItems = updatedProdutos.map((produto) => ({
        ...produto,
        id: produto.id ?? 0, 
        categorias: produto.categorias.map((categoria) => categoria.nome)
      }));
      carrinhoService.setCarrinho(carrinhoItems);
      cartIconNumber(updatedProdutos); 
    }
  };

  const handleQuantityChange = (id: number, action: '+' | '-') => {
    const updatedProdutos = produtos
      .map((item) => {
        if (item.id === id) {
          let newQuantity = item.quantidade;

          if (action === '+') {
            newQuantity++;
          } else if (action === '-' && newQuantity > 1) {
            newQuantity--;
          } else if (action === '-' && newQuantity === 1) {
            return null; 
          }

          return { ...item, quantidade: newQuantity };
        }
        return item;
      })
      .filter((item) => item !== null) as ProdutoDTO[]; 

    updateCarrinho(updatedProdutos);
  };

  return {
    produtos,
    loading,  
    handleQuantityChange,
    setProdutos,
    cartIconNumber,
    setLoading,
    setContextCartCount
  };
};

export default useCarrinho;
