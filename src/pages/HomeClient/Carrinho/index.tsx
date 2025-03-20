import './styles.css';
import useCarrinho from '../../../hooks/useCarrinho';
import { useMemo, useState } from 'react';
import { AxiosResponse } from 'axios';
import * as carrinhoService from "../../../services/CarrinhoService";
import { ConteudoCarrinho } from '../../../components/Layout/ConteudoCarrinho';
import { AdicionarProdutos } from '../../../components/Layout/AdicionarProdutos';
import { Carregando } from '../../../components/UI/Carregando';

import { Outlet, useNavigate } from 'react-router-dom';
import { PedidoFeito } from '../../../models/dto/CarrinhoDTO';

const Carrinho = () => {
  const { produtos, loading, handleQuantityChange, cartIconNumber, setProdutos, setContextCartCount } = useCarrinho();
  const [alertData, setAlertData] = useState<{ title: string; text: string; icon: "success" | "error" } | null>(null);
  const navigate = useNavigate();

 
  const subtotais = useMemo(() => produtos.map((item) => item.preco * item.quantidade), [produtos]);
  const totalCarrinho = useMemo(() => subtotais.reduce((total, subtotal) => total + subtotal, 0), [subtotais]);
  const totalFormatado = totalCarrinho.toFixed(2).replace('.', ',');

  
  const [fazerPedido, setFazerPedido] = useState<boolean>(false);

 
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

  const pedidoFeito= async (): Promise<AxiosResponse<  PedidoFeito,  PedidoFeito>> => {
    setFazerPedido(true); 
    navigate("/Carrinho/Pagamento"); 

    return Promise.resolve({} as AxiosResponse<PedidoFeito, PedidoFeito>);
  };

  return (
    <main className='carrinhoOutlet'>
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
          clickpedido={pedidoFeito}
          fazerPedido={fazerPedido}  
        />
      )}

      {fazerPedido && <Outlet />} 
    </main>
  );
};

export default Carrinho;
