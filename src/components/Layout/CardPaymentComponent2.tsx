import React, { useEffect } from 'react';
import { PUBLIC_KEY } from './../../utils/system';

export const BASE_URL_LOCAL = "http://localhost:8080";
export const BASE_URL_LOCAL2 = "https://quaint-adele-alevivaldi-a5632bd1.koyeb.app/";

export const storageCarrinho = "br.com.alexcosta/carrinho";
export const CLIENT_ID = "myclientid";
export const CLIENT_SECRET = "myclientsecret";
export const TOKEN_KEY = "token";
export const RECUPERAR_SENHA = "/api/recuperacao/solicitar";
export const CADASTRO_NOVO_USUARIO = "/usuarios/cadastro";
export const ENVIAR_PEDIDO = "/pedidos/salvar";
export const PAGAMENTO = "/api/payments";
export const ACCEES_TOKEN_MERCADO_PAGO = "TEST-2623568966153379-031404-2fa83210378353e1ec568105924c47bd-728051548";

declare global {
  interface Window {
    paymentBrickController: unknown;
  }
}

interface PaymentBrickSettings {
  initialization: {
    amount: number;
    preferenceId: string;
    payer: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
  customization: {
    visual: {
      style: {
        theme: string;
      };
    };
    paymentMethods: {
      creditCard: string;
      debitCard: string;
      ticket: string;
      bankTransfer: string;
      atm: string;
      onboarding_credits: string;
      wallet_purchase: string;
      maxInstallments: number;
    };
  };
  callbacks: {
    onReady: () => void;
    onSubmit: (params: { selectedPaymentMethod: unknown; formData: { token: string; issuer_id: string; payment_method_id: string; transaction_amount: number; installments: number; payer: { email: string; firstName: string; identification: { type: string; number: string; }; }; }; }) => Promise<void>;
    onError: (error: unknown) => void;
  };
}

type PaymentBrickResponse = unknown;

interface MercadoPagoBricksBuilder {
  create: (brickType: string, containerId: string, settings: PaymentBrickSettings) => Promise<PaymentBrickResponse>;
}

interface MercadoPagoInstance {
  bricks(): MercadoPagoBricksBuilder;
}

declare const MercadoPago: {
  new (publicKey: string, options: { locale: string }): MercadoPagoInstance;
};

const CardPaymentComponent2: React.FC = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.async = true;
    script.onload = () => {
      console.log('MercadoPago SDK loaded successfully');

      const mp = new MercadoPago(PUBLIC_KEY, { locale: 'pt' });
      const bricksBuilder = mp.bricks();

      const renderPaymentBrick = async (bricksBuilder: MercadoPagoBricksBuilder) => {
        const settings = {
          initialization: {
            amount: 10000, // Quantia total a pagar
            preferenceId: '<PREFERENCE_ID>', // Substitua pelo ID da preferência
            payer: {
              firstName: 'John',
              lastName: 'Doe',
              email: 'john.doe@example.com',
            },
          },
          customization: {
            visual: {
              style: {
                theme: 'default',
              },
            },
            paymentMethods: {
              creditCard: 'all',
              debitCard: 'all',
              ticket: 'all',
              bankTransfer: 'all',
              atm: 'all',
              onboarding_credits: 'all',
              wallet_purchase: 'all',
              maxInstallments: 1,
            },
          },
          callbacks: {
            onReady: () => {
              console.log('Payment Brick is ready');
            },
            onSubmit: async (params: { selectedPaymentMethod: unknown; formData: { token: string; issuer_id: string; payment_method_id: string; transaction_amount: number; installments: number; payer: { email: string; firstName: string; identification: { type: string; number: string; }; }; }; }) => {
              const { formData } = params;

              // Verifique o conteúdo de formData
              console.log('Form Data:', formData);

              // Verifique se formData.transaction_amount está definido
              if (formData.transaction_amount === undefined) {
                console.error('Erro: formData.transaction_amount está undefined');
                return;
              }

              // Dados para obter o token do cartão
              const cardData = {
                cardNumber: "4830775860044663", // Substitua pelo número do cartão do usuário
                securityCode: "655", // Substitua pelo código de segurança do cartão
                expirationMonth: 11, // Substitua pelo mês de expiração
                expirationYear: 2033, // Substitua pelo ano de expiração
                cardholder: {
                  name: "APRO",
                  identification: {
                    type: "CPF",
                    number: "12345678909",
                  },
                },
              };

              try {
                // Passo 1: Obter o token do cartão via backend
                const tokenResponse = await fetch('http://localhost:8080/api/payment/card-token', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(cardData),
                });

                if (!tokenResponse.ok) {
                  throw new Error('Erro ao obter token do cartão');
                }

                const tokenData = await tokenResponse.json();
                const cardToken = tokenData.id;

                // Passo 2: Fazer o pagamento com o token
                const paymentRequest = {
                  transactionAmount: formData.transaction_amount.toString(), // Converta para string
                  token: cardToken, // Token obtido na etapa anterior
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
                  throw new Error('Erro ao processar pagamento');
                }

                const paymentResult = await paymentResponse.text(); // Alterado para .text() em vez de .json()
                console.log('Pagamento realizado com sucesso:', paymentResult);
              } catch (error) {
                console.error('Erro:', error);
              }
            },
            onError: (error: unknown) => {
              console.error('Payment Brick error:', error);
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

      renderPaymentBrick(bricksBuilder);
    };

    script.onerror = () => {
      console.error('Failed to load MercadoPago SDK');
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      <div id="paymentBrick_container"></div>
    </div>
  );
};

export default CardPaymentComponent2;
