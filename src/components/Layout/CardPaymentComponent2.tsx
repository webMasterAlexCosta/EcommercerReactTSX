import React, { useEffect } from 'react';
import { PUBLIC_KEY } from './../../utils/system';

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
    onSubmit: (params: { selectedPaymentMethod: unknown; formData: unknown }) => Promise<void>;
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
    // Carregar o script do MercadoPago
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.async = true;
    script.onload = () => {
      // Inicializa o MercadoPago após o carregamento do script
      const mp = new MercadoPago(PUBLIC_KEY, { locale: 'pt' });
      const bricksBuilder = mp.bricks();

      const renderPaymentBrick = async (bricksBuilder: MercadoPagoBricksBuilder) => {
        const settings = {
          initialization: {
            amount: 10000, // Quantia total a pagar
            preferenceId: '<PREFERENCE_ID>', // Substitua pelo ID da preferência
            payer: {
              firstName: '',
              lastName: '',
              email: '',
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
              // Callback chamado quando o Brick estiver pronto
            },
            onSubmit: ({ formData }: { selectedPaymentMethod: unknown; formData: unknown }) => {
              // Callback quando há click no botão de envio de dados
              return new Promise<void>((resolve, reject) => {
                fetch('/process_payment', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(formData),
                })
                  .then((response) => response.json())
                  .then((response) => {
                    console.log(response);
                    resolve();
                  })
                  .catch((error) => {
                    // Tratar erro
                    reject(error);
                  });
              });
            },
            onError: (error: unknown) => {
              // Callback para todos os casos de erro do Brick
              console.error(error);
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

    document.body.appendChild(script);

    // Limpeza: Remover o script quando o componente for desmontado
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
