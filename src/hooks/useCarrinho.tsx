import { useState, useEffect } from 'react';
import { ProdutoDTO } from '../models/dto/ProdutosDTO';
import { storageCarrinho } from '../utils/system';

const useCarrinho = () => {
  const [produtos, setProdutos] = useState<ProdutoDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true); 

  useEffect(() => {
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

      setLoading(false); 
    }, (Math.random()*3000)); 
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
        }

        return { ...item, quantidade: newQuantity };
      }
      return item;
    });

    updateCarrinho(updatedProdutos);
  };

  return {
    produtos,
    loading,  
    handleQuantityChange,
    setProdutos
  };
};

export default useCarrinho;
