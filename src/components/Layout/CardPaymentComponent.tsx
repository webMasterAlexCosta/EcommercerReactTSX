import  "../../pages/HomeClient/Carrinho/styles.css"
import React, { useEffect } from 'react';
import { PUBLIC_KEY } from '../../utils/system';

declare global {
  interface Window {
    MercadoPago: {
      new (publicKey: string, options?: { locale: string }): {
        bricks: () => {
          create: (type: string, containerId: string, settings: { initialization: { amount: number; payer: { email: string; }; }; customization: { visual: { style: { theme: string; customVariables: object; }; }; paymentMethods: { maxInstallments: number; }; }; callbacks: { onReady: () => void; onSubmit: (cardFormData: unknown) => Promise<void>; onError: (error: unknown) => void; }; }) => Promise<unknown>;
        };
      };
    };
    cardPaymentBrickController?: ReturnType<ReturnType<InstanceType<typeof window.MercadoPago>['bricks']>['create']>;
  }
}

const CardPaymentComponent: React.FC = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.async = true;
    script.onload = () => {
      const mp = new window.MercadoPago(PUBLIC_KEY, {
        locale: 'pt-BR'
      });
      const bricksBuilder = mp.bricks();
    interface Payer {
      email: string;
    }

    interface Initialization {
      amount: number;
      payer: Payer;
    }

    interface CustomVariables {
          [key: string]: unknown;
    }

    interface Style {
      theme: string;
      customVariables: CustomVariables;
    }

    interface Visual {
      style: Style;
    }

    interface PaymentMethods {
      maxInstallments: number;
    }

    interface Customization {
      visual: Visual;
      paymentMethods: PaymentMethods;
    }

    interface Callbacks {
      onReady: () => void;
      onSubmit: (cardFormData: { [key: string]: string | number | boolean }) => Promise<void>;
      onError: (error: Error) => void;
    }

    interface Settings {
      initialization: Initialization;
      customization: Customization;
      callbacks: Callbacks;
    }

    const renderCardPaymentBrick = async (bricksBuilder: ReturnType<typeof window.MercadoPago.prototype.bricks>) => {
      const settings: Settings = {
        initialization: {
        amount: 100, // valor total a ser pago
        payer: {
          email: "",
        },
        },
        customization: {
        visual: {
          style: {
            theme: 'default', // | 'dark' | 'bootstrap' | 'flat'
            customVariables: {
            }
          }
        },
        paymentMethods: {
          maxInstallments: 1,
        }
        },
        callbacks: {
        onReady: () => {
          // callback chamado quando o Brick estiver pronto
        },
        onSubmit: (cardFormData: { [key: string]: string | number | boolean }) => {
          //  callback chamado o usuário clicar no botão de submissão dos dados
          //  exemplo de envio dos dados coletados pelo Brick para seu servidor
          return new Promise((resolve, reject) => {
            fetch("/process_payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(cardFormData)
            })
            .then((response) => {
              console.log(response);
              resolve();
            })
            .catch((error) => {
                console.error(error);
              reject();
            })
          });
        },
        onError: (error: Error) => {
            console.error(error);
        },
        },
      };
      window.cardPaymentBrickController = await bricksBuilder.create('cardPayment', 'cardPaymentBrick_container', settings);
    };
      renderCardPaymentBrick(bricksBuilder);
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div id="cardPaymentBrick_container" style={{
        width: '400px',
        height: '400px',
        marginTop: '20px',
        padding: '20px',
        borderRadius: '5px',
        margin: '0 auto',
    }}></div>
  );
};

export default CardPaymentComponent;