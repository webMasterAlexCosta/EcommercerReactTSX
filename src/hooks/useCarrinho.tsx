import { useState, useEffect, useContext } from 'react';
import { ProdutoDTO } from '../models/dto/ProdutosDTO';
import * as carrinhoService from "../services/CarrinhoService";
import ContextCartCount from '../data/CartCountContext';

const useCarrinho = () => {
  const [produtos, setProdutos] = useState<ProdutoDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true); 
  const { setContextCartCount } = useContext(ContextCartCount);

  // Atualiza o contador do carrinho
  const cartIconNumber = (cart?: ProdutoDTO[]) => {
    const newCart = cart ?? carrinhoService.getCarrinho();
    const totalItems = (newCart as ProdutoDTO[]).reduce((total: number, item: ProdutoDTO) => total + (item.quantidade || 0), 0);
    setContextCartCount(totalItems);
  };

  useEffect(() => {
    try {
      const produtosNoCarrinho = carrinhoService.getCarrinho();
      if (produtosNoCarrinho) {
        const produtosParsed: ProdutoDTO[] = JSON.parse(JSON.stringify(produtosNoCarrinho));
        setProdutos(produtosParsed);
        cartIconNumber(produtosParsed); // Atualiza o contador ao carregar
      }
    } catch (error) {
      console.error('Erro ao parsear os produtos do localStorage', error);
    } finally {
      setLoading(false);
    }
  }, []); 

  const updateCarrinho = (updatedProdutos: ProdutoDTO[]) => {
    if (updatedProdutos.length === 0) {
      carrinhoService.removeCarrinho();
      setProdutos([]);
      cartIconNumber([]); // Atualiza o contador para 0
      
    } else {
      setProdutos(updatedProdutos);
      // Convert ProdutoDTO[] to CarrinhoItem[] by mapping categorias from CategoriasDTO[] to string[]
      const carrinhoItems = updatedProdutos.map((produto) => ({
        ...produto,
        categorias: produto.categorias.map((categoria) => categoria.nome)
      }));
      carrinhoService.setCarrinho(carrinhoItems);
      cartIconNumber(updatedProdutos); // Atualiza o contador corretamente
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
            return null; // Remove o item do carrinho
          }

          return { ...item, quantidade: newQuantity };
        }
        return item;
      })
      .filter((item) => item !== null) as ProdutoDTO[]; // Remove `null` e mantém a tipagem correta

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
