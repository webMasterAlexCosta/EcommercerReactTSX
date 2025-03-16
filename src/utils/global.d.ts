// global.d.ts
interface Window {
    MercadoPago: new (publicKey: string, options: { locale: string }) => MercadoPagoInstance;
  }
  
  interface MercadoPagoInstance {
    bricks: () => BricksBuilder;
  }
  
  interface BricksBuilder {
    create: (
      brickType: string,
      containerId: string,
      settings: any // Substitua 'any' por uma interface mais específica, se necessário
    ) => Promise<unknown>;
  }