import { ProdutoDTO } from "../../models/dto/ProdutosDTO";
import Alert from "../UI/Alert";
import { ContinuarComprando } from "../UI/ContinuarComprando";
import { FinalizarPedido } from "../UI/FinalizarPedido";
import { Limpar } from "../UI/Limpar";
import { useEffect, useState } from "react";
import { Carregando } from "../UI/Carregando";

interface IConteudoCarrinho {
    handleQuantityChange: (id: number, action: "+" | "-") => void;
    limparCarrinho: () => void;
    totalFormatado: string;
    cartIconNumber: () => void;
    alertData: { title: string; text: string; icon: "success" | "error" } | null;
    setAlertData: React.Dispatch<React.SetStateAction<{ title: string; text: string; icon: "success" | "error" } | null>>;
    produtos: ProdutoDTO[];
    subtotais: number[];
    setProdutos: React.Dispatch<React.SetStateAction<ProdutoDTO[]>>;
    clickpedido: () => void;
    fazerPedido: boolean;
}

const ConteudoCarrinho = ({
    handleQuantityChange,
    limparCarrinho,
    totalFormatado,
    cartIconNumber,
    alertData,
    setAlertData,
    produtos,
    subtotais,
    clickpedido,
    fazerPedido,
}: IConteudoCarrinho) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [isCarrinho, setIsCarrinho] = useState<boolean>(false);

    useEffect(() => {
        if (isCarrinho) {
            setAlertData({
                title: "Pedido Enviado com Sucesso",
                icon: "success",
                text: "Obrigado pela sua preferência!",
            });

            setTimeout(() => {
                setAlertData(null);
            }, 5000);
            setLoading(false);
            setIsCarrinho(false);
        }
    }, [isCarrinho, setAlertData]);

    return (
        <>
            {loading ? (
                <Carregando title="Enviando Seu Pedido, Aguarde" />
            ) : (
                <section id="cart-container-section" className="alex-container">
                    <div className="alex-card alex-mb20">
                        {produtos.map((item, index) => (
                            <div key={`${item.id}-${index}`} className="alex-cart-item-container alex-line-bottom">
                                <div className="alex-cart-item-left">
                                    <img src={item.imgUrl} alt={item.nome} />
                                    <div className="alex-cart-item-description">
                                        <h3>{item.nome}</h3>
                                        <div className="alex-cart-item-quantity-container">
                                            <button
                                                className="alex-cart-item-quantity-btn"
                                                onClick={() => {
                                                    if (item.id !== undefined) {
                                                        handleQuantityChange(item.id, "-");
                                                    }
                                                    cartIconNumber();
                                                }}
                                            >
                                                -
                                            </button>
                                            <p>{item.quantidade}</p>
                                            <button
                                                className="alex-cart-item-quantity-btn"
                                                onClick={() => {
                                                    if (item.id !== undefined) {
                                                        handleQuantityChange(item.id, "+");
                                                    }
                                                    cartIconNumber();
                                                }}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="alex-cart-item-right">
                                    <h3>R$ {subtotais[index].toFixed(2).replace(".", ",")}</h3>
                                </div>
                            </div>
                        ))}

                        <div className="alex-cart-total-container">
                            <h3>Total: R$ {totalFormatado} </h3>
                        </div>
                    </div>

                    <div className="alex-btn-page-container">
                        {!fazerPedido && (
                            <FinalizarPedido
                                title="Finalizar Pedido"
                                clickpedido={clickpedido}  
                            />
                        )}

                        <ContinuarComprando link="/catalogo" title="Continuar Comprando" />
                        <Limpar onClickHandle={limparCarrinho} title="Limpar Carrinho" />

                        {alertData && <Alert {...alertData} onClose={() => setAlertData(null)} />}
                    </div>
                </section>
            )}
        </>
    );
};

export { ConteudoCarrinho };
