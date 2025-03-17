import React, { useEffect, useState } from 'react';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import gerarPDF from './Pdf';
import * as authService from "../../services/AuthService";
import { AxiosResponse } from 'axios';
import useCarrinho from '../../hooks/useCarrinho';
import { PedidoFeito } from '../../models/dto/CarrinhoDTO';
import * as userService from "../../services/UserServices";
import * as carrinhoService from "../../services/CarrinhoService";  
import { useNavigate } from 'react-router-dom';
import Alert from './Alert';
import { PUBLIC_STRIPE } from '../../utils/system';
import requestBackEnd from '../../utils/request';

const stripePromise = loadStripe(PUBLIC_STRIPE);

const CardPaymentComponent2: React.FC = () => {
  const [alertData, setAlertData] = useState<{ title: string; text: string; icon: "success" | "error" } | null>(null);
  const { setProdutos, setContextCartCount } = useCarrinho();
  const navigate = useNavigate();
  const [valor, setValor] = useState<number>(0);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const enviarPedido = async (): Promise<AxiosResponse<PedidoFeito, PedidoFeito>> => {
    const isUserAutenticado = authService.isAuthenticated();
    if (!isUserAutenticado) {
      setAlertData({ title: "Você precisa estar autenticado", text: "", icon: "error" });
      setTimeout(() => {
        navigate("/login");
      }, 1000);
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
    return Promise.resolve({} as AxiosResponse<PedidoFeito, PedidoFeito>);
  };

  useEffect(() => {
    let subTotal = 0;
    carrinhoService.getCarrinho().forEach(item => {
      subTotal += item.preco * item.quantidade;
    });
    setValor(Number(subTotal));
  }, []);

  useEffect(() => {
    if (valor > 0) {
      const fetchClientSecret = async () => {
        try {
          const response = await requestBackEnd({
            method: "get",
            url: `create-payment-intent?amount=${valor}`,
          });

          setClientSecret(response.data.clientSecret);
        } catch (error) {
          console.error("Erro ao buscar o clientSecret", error);
        }
      };

      fetchClientSecret();
    }
  }, [valor]);

  const options: StripeElementsOptions = {
    clientSecret: clientSecret || '', 
    appearance: {
      theme: 'stripe',
    },
  };

  const PaymentForm: React.FC = () => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();

      if (!stripe || !elements || !clientSecret) {
        return;
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (error) {
        console.error('Erro ao processar pagamento:', error.message);
        setAlertData({ title: "Erro ao Processar Pagamento", text: error.message || "Ocorreu um erro no pagamento.", icon: "error" });
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('Pagamento realizado com sucesso:', paymentIntent);
        enviarPedido();
      }
    };

    return (
      <form onSubmit={handleSubmit}>
        <CardElement />
        <button type="submit" disabled={!stripe}>Pagar R$ {valor.toFixed(2)}</button>
      </form>
    );
  };

  return (
    <div className="payment-container">
      <h1 className="title">Realize seu Pagamento</h1>
      {clientSecret ? (
        <div className="payment-form-wrapper">
          <Elements stripe={stripePromise} options={options}>
            <PaymentForm />
          </Elements>
        </div>
      ) : (
        <p className="loading-text">Carregando...</p>
      )}
      {alertData && <Alert {...alertData} onClose={() => setAlertData(null)} />}
    </div>
  );
};

export default CardPaymentComponent2;
