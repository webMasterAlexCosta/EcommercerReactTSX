import './styles.css';
import useCarrinho from '../../../hooks/useCarrinho'; // Certifique-se de apontar para o caminho correto do seu hook
import { useContext, useMemo, useState } from 'react';
import { storageCarrinho } from '../../../utils/system';
import * as carrinhoService from "../../../services/CarrinhoService"
import ContextCartCount from '../../../data/CartCountContext';
import { ProdutoDTO } from '../../../models/dto/ProdutosDTO';

import { ConteudoCarrinho } from '../../../components/Layout/ConteudoCarrinho';
import { AdicionarProdutos } from '../../../components/Layout/AdicionarProdutos';
import { CarregandoProdutos } from '../../../components/Layout/CarregandoProdutos';

const Carrinho = () => {
  const { produtos, loading, handleQuantityChange, cartIconNumber, setProdutos } = useCarrinho(); // Verifique se o hook retorna setProdutos
  const [alertData, setAlertData] = useState<{ title: string; text: string; icon: "success" | "error" } | null>(null);
  const { setContextCartCount } = useContext(ContextCartCount);

  // Memoizando os subtotais para cada item do carrinho
  const subtotais = useMemo(() => produtos.map((item) => item.preco * item.quantidade), [produtos]);

  // Cálculo do total do carrinho, com base nos subtotais
  const totalCarrinho = useMemo(() => subtotais.reduce((total, subtotal) => total + subtotal, 0), [subtotais]);

  // Formatação do total
  const totalFormatado = totalCarrinho.toFixed(2).replace('.', ',');

  const limparCarrinho = () => {
    setAlertData({ title: "Limpeza Carrinho", text: "Carrinho foi limpo", icon: "success" });
    setTimeout(() => {
      carrinhoService.removeCarirnho(storageCarrinho); // Limpa apenas os produtos, sem apagar todo o localStorage
      setProdutos([]); // Atualiza o estado do carrinho para refletir a remoção
      const newCart = JSON.parse(carrinhoService.getCarrinho() || "[]");
      setContextCartCount(newCart.reduce((total: number, item: ProdutoDTO) => total + item.quantidade, 0));
    }, 2000);
  };

  return (
    <main>
      {loading ? (
        <CarregandoProdutos title="Carregando Produtos"/>
      ) : produtos.length === 0 ? (
        <AdicionarProdutos />
      ) : (
        <ConteudoCarrinho handleQuantityChange={handleQuantityChange}
          limparCarrinho={limparCarrinho}
          totalFormatado={totalFormatado}
          cartIconNumber={cartIconNumber}
          alertData={alertData}
          setAlertData={setAlertData}
          produtos={produtos}
          subtotais={subtotais}
        />
      )}
    </main>
  );
};

export default Carrinho;
