import React, { useEffect, useState } from 'react';
import gerarPDF from '../UI/Pdf';
import * as authService from "../../services/AuthService";
import { PUBLIC_KEY } from './../../utils/system';
import { AxiosResponse } from 'axios';
import useCarrinho from '../../hooks/useCarrinho';
import { PedidoFeito } from '../../models/dto/CarrinhoDTO';
import * as userService from "../../services/UserServices";
import * as carrinhoService from "../../services/CarrinhoService";  
import { useNavigate } from 'react-router-dom';
import Alert from '../UI/Alert';

declare global {
  interface Window {
    paymentBrickController: unknown;
  }
}

interface MercadoPagoInstance {
  bricks: () => MercadoPagoBricks;
}

interface MercadoPagoBricks {
  create: (type: string, containerId: string, settings: Record<string, unknown>) => Promise<unknown>;
}

interface MercadoPagoConstructor {
  new(publicKey: string, options: { locale: string }): MercadoPagoInstance;
}

interface FormData {
  token: string;
  issuer_id: string;
  payment_method_id: string;
  transaction_amount: number;
  installments: number;
  payer: {
    email: string;
    firstName: string;
    identification: {
      type: string;
      number: string;
    },
  };
}

const CardPaymentComponent2: React.FC = () => {
  const [alertData, setAlertData] = useState<{ title: string; text: string; icon: "success" | "error" } | null>(null);
  const { setProdutos, setContextCartCount } = useCarrinho();
  const navigate = useNavigate();
  const [valor, setValor] = useState<number>(0);

  const enviarPedido = async (): Promise<AxiosResponse<unknown, unknown>> => {
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
    return Promise.resolve({} as AxiosResponse<unknown, unknown>);
  };

  // useEffect para calcular o valor total do carrinho
  useEffect(() => {
    let subTotal = 0;
    carrinhoService.getCarrinho().forEach(item => {
      subTotal += item.preco * item.quantidade;
    });
    setValor(subTotal);
  }, []); // Esse useEffect roda apenas uma vez, ao carregar o componente

  // useEffect para carregar o SDK do MercadoPago e renderizar o Payment Brick
  useEffect(() => {
    if (valor > 0) { // Só executa a renderização se o valor for maior que zero
      const script = document.createElement('script');
      script.src = 'https://sdk.mercadopago.com/js/v2';
      script.async = true;
      script.onload = () => {
        console.log('MercadoPago SDK loaded successfully');

        const mp = new ((window as unknown as { MercadoPago: MercadoPagoConstructor }).MercadoPago)(PUBLIC_KEY, { locale: 'pt-BR' });
        const bricksBuilder = mp.bricks();

        const renderPaymentBrick = async () => {
          const settings = {
            initialization: {
              amount: valor, // Valor total da transação (em reais)
            },
            customization: {
              visual: {
                style: {
                  theme: 'default', // Tema visual do Payment Brick
                },
              },
              paymentMethods: {
                creditCard: 'all',
                debitCard: 'all',
                ticket: 'all',
                bankTransfer: 'all',
              },
            },
            callbacks: {
              onReady: () => {
                console.log('Payment Brick is ready');
              },
              onSubmit: async ({ formData }: { formData: FormData }) => {
                console.log('FormData received:', formData);
                try {
                  // Validação dos campos obrigatórios
                  if (!formData.token) {
                    console.error('Erro: Token não encontrado.');
                    alert('Erro: Token do cartão não encontrado.');
                    return;
                  }
                  if (!formData.transaction_amount) {
                    console.error('Erro: Valor da transação não encontrado.');
                    alert('Erro: Valor da transação não encontrado.');
                    return;
                  }

                  const paymentRequest = {
                    transactionAmount: formData.transaction_amount,
                    token: formData.token,
                    description: "Pagamento via Payment Brick",
                    installments: formData.installments,
                    paymentMethodId: formData.payment_method_id,
                    payer: {
                      email: formData.payer.email,
                      firstName: formData.payer.firstName,
                      identification: {
                        type: formData.payer.identification.type,
                        number: formData.payer.identification.number,
                      },
                    },
                  };
                  
                  console.log('Payment Request:', paymentRequest);

                  const paymentResponse = await fetch('http://localhost:8080/api/payment/credit-card', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(paymentRequest),
                  });

                  if (!paymentResponse.ok) {
                    console.error('Erro ao processar pagamento:', paymentResponse.statusText);
                    throw new Error('Erro ao processar pagamento');
                  }

                  const paymentResult = await paymentResponse.json();
                  console.log('Pagamento realizado com sucesso:', paymentResult);
                  enviarPedido();
                } catch (error) {
                  console.error('Erro ao processar o pagamento:', error);
                  alert('Erro ao processar o pagamento. Verifique os logs.');
                }
              },
              onError: (error: unknown) => {
                console.error('Payment Brick error:', error);
                alert('Ocorreu um erro ao processar o pagamento. Verifique os logs.');
              },
            },
          };

          try {
            window.paymentBrickController = await bricksBuilder.create(
              'payment',
              'paymentBrick_container',
              settings
            );
          } catch (error) {
            console.error('Error initializing MercadoPago payment brick', error);
          }
        };

        renderPaymentBrick();
      };

      script.onerror = () => {
        console.error('Failed to load MercadoPago SDK');
      };

      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [valor]); // Executa novamente sempre que o valor mudar

  return (
    <div>
      <h1>Realize seu Pagamento</h1>
      <div id="paymentBrick_container" style={{ width: '600px', height: '400px' }}></div>
      {alertData && <Alert {...alertData} onClose={() => setAlertData(null)} />}
    </div>
  );
};

export default CardPaymentComponent2;
