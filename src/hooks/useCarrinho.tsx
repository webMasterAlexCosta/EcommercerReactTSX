import { useState, useEffect, useContext } from 'react';
import { ProdutoDTO } from '../models/dto/ProdutosDTO';
import { storageCarrinho } from '../utils/system';
import * as carrinhoService from "../services/CarrinhoService";
import ContextCartCount from '../data/CartCountContext';

const useCarrinho = () => {
  const [produtos, setProdutos] = useState<ProdutoDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true); 
  const { setContextCartCount } = useContext(ContextCartCount);

  // Função otimizada de contagem de itens no carrinho
  const cartIconNumber = () => {
    const totalItems = produtos.reduce((total: number, item: ProdutoDTO) => total + item.quantidade, 0);
    setContextCartCount(totalItems);  // Atualiza o contador global do carrinho
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
    cartIconNumber(); // Atualiza o número do carrinho no ícone logo após o carregamento
  }, []); 

  const updateCarrinho = (updatedProdutos: ProdutoDTO[]) => {
    setProdutos(updatedProdutos);
    localStorage.setItem(storageCarrinho, JSON.stringify(updatedProdutos));
    cartIconNumber(); // Atualiza o contador após qualquer alteração
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
          // Remover item quando a quantidade é 1 e o usuário tenta diminuir para 0
          return null; // Marcar para remoção
        }

        return { ...item, quantidade: newQuantity };
      }
      return item;
    }).filter((item) => item !== null); // Remove os itens com valor null (marcados para remoção)

    updateCarrinho(updatedProdutos as ProdutoDTO[]); // Atualiza o carrinho com os itens restantes

    // Se o carrinho estiver vazio, podemos chamar o serviço para limpar o carrinho
    if (updatedProdutos.length === 0) {
      carrinhoService.removeCarrinho();
    }
  };

  return {
    produtos,
    loading,  
    handleQuantityChange,
    setProdutos,
    cartIconNumber,  // Renomeado para refletir a mudança de nome
    setLoading
  };
};

export default useCarrinho;
