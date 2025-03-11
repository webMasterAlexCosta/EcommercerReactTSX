import './styles.css';
import useCarrinho from '../../../hooks/useCarrinho'; 
import {  useMemo, useState } from 'react';
import { AxiosResponse } from 'axios';
import * as carrinhoService from "../../../services/CarrinhoService"
import { ConteudoCarrinho } from '../../../components/Layout/ConteudoCarrinho';
import { AdicionarProdutos } from '../../../components/Layout/AdicionarProdutos';
import { Carregando } from '../../../components/UI/Carregando';

const Carrinho = () => {
  const { produtos, loading, handleQuantityChange, cartIconNumber, setProdutos ,setContextCartCount} = useCarrinho();
  const [alertData, setAlertData] = useState<{ title: string; text: string; icon: "success" | "error" } | null>(null);

  const subtotais = useMemo(() => produtos.map((item) => item.preco * item.quantidade), [produtos]);
  const totalCarrinho = useMemo(() => subtotais.reduce((total, subtotal) => total + subtotal, 0), [subtotais]);
  const totalFormatado = totalCarrinho.toFixed(2).replace('.', ',');

  const limparCarrinho = () => {
    
    setAlertData({ title: "Limpeza Carrinho", text: "Carrinho foi limpo", icon: "success" });
    setTimeout(() => {
      try {
        carrinhoService.removeCarrinho();
        setProdutos([]);
        setContextCartCount(0);
      } catch (error) {
        setAlertData({ title: "Erro", text: "Ocorreu um erro ao limpar o carrinho.", icon: "error" });
        console.error("Erro ao limpar carrinho: ", error);
      }
    }, 2000);
  };

  const enviarPedido = async (): Promise<AxiosResponse<unknown, unknown>> => {
    // Primeiro, mostramos o alerta de sucesso
    setAlertData({ title: "Pedido Enviado com Sucesso", text: "Obrigado pela sua compra!", icon: "success" });

    // Aguardar um tempo antes de continuar com o envio do pedido
    setTimeout(async () => {
      try {
        const response = await carrinhoService.enviarPedido();

        // Se o pedido for enviado com sucesso, limpar o carrinho
        setContextCartCount(0);
        carrinhoService.removeCarrinho();
        setProdutos([]);
        
        // O alerta já foi setado acima, então o fluxo está controlado aqui
        return response;
      } catch (error) {
        setAlertData({ title: "Erro ao Enviar Pedido", text: "Ocorreu um erro ao enviar seu pedido. Tente novamente.", icon: "error" });
        console.error("Erro ao enviar pedido: ", error);
        throw error;
      }
    }, 2000); // Atraso para garantir que o alerta seja exibido antes de realizar o envio
    return Promise.resolve({} as AxiosResponse<unknown, unknown>);
  };

  return (
    <main>
      {loading ? (
        <Carregando title="Carregando Produtos" />
      ) : produtos.length === 0 ? (
        <AdicionarProdutos />
      ) : (
        <ConteudoCarrinho
          handleQuantityChange={handleQuantityChange}
          limparCarrinho={limparCarrinho}
          totalFormatado={totalFormatado}
          cartIconNumber={cartIconNumber}
          alertData={alertData}
          setAlertData={setAlertData}
          produtos={produtos}
          setProdutos={setProdutos}
          subtotais={subtotais}
          enviar={enviarPedido} 
        />
      )}
    </main>
  );
};

export default Carrinho;
