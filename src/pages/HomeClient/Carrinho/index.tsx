import './styles.css';
import useCarrinho from '../../../hooks/useCarrinho';
import { useMemo, useState } from 'react';
import { AxiosResponse } from 'axios';
import * as carrinhoService from "../../../services/CarrinhoService"
import * as userService from "../../../services/UserServices";
import { ConteudoCarrinho } from '../../../components/Layout/ConteudoCarrinho';
import { AdicionarProdutos } from '../../../components/Layout/AdicionarProdutos';
import { Carregando } from '../../../components/UI/Carregando';
import { PedidoFeito } from '../../../models/dto/CarrinhoDTO';
import gerarPDF from './../../../components/UI/Pdf';
import * as authService from "../../../services/AuthService"
import { useNavigate } from 'react-router-dom';
const Carrinho = () => {
  const { produtos, loading, handleQuantityChange, cartIconNumber, setProdutos, setContextCartCount } = useCarrinho();
  const [alertData, setAlertData] = useState<{ title: string; text: string; icon: "success" | "error" } | null>(null);
  const navigate = useNavigate();

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
   
    const isUserAutenticado= authService.isAuthenticated();
    
      if(!isUserAutenticado){
        setAlertData({ title: "Você precisa estar autenticado", text: "", icon: "error" });
        setTimeout(() => {
          navigate("/login"); 
        }
        , 1000);
        return Promise.reject(new Error("Usuário não autenticado"));
      }
    

    setAlertData({ title: "Pedido Enviado com Sucesso", text: "Obrigado pela sua compra!", icon: "success" });
    const response = await userService.enviarPedido();
   
    setTimeout(async () => {
      try {
  
        await gerarPDF(response.data as PedidoFeito); 
        setContextCartCount(0);
        carrinhoService.removeCarrinho();
        setProdutos([]);

     
        return response;
      } catch (error) {
        setAlertData({ title: "Erro ao Enviar Pedido", text: "Ocorreu um erro ao enviar seu pedido. Tente novamente.", icon: "error" });
        console.error("Erro ao enviar pedido: ", error);
        throw error;
      }
    }, 2000);
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
