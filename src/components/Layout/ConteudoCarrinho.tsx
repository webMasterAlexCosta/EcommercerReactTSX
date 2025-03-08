import { ProdutoDTO } from '../../models/dto/ProdutosDTO';
import Alert from '../UI/Alert';
import { ContinuarComprando } from '../UI/ContinuarComprando';
import { FinalizarPedido } from '../UI/FinalizarPedido';
import { Limpar } from '../UI/Limpar';

interface IConteudoCarrinho {
    handleQuantityChange: (id: number, action: "+" | "-") => void;
    limparCarrinho: () => void;
    totalFormatado: string;
    cartIconNumber: () => void;
    alertData: { title: string; text: string; icon: "success" | "error" } | null;
    setAlertData: React.Dispatch<React.SetStateAction<{ title: string; text: string; icon: "success" | "error" } | null>>;
    produtos: ProdutoDTO[];
    subtotais: number[];

}

const ConteudoCarrinho = ({ handleQuantityChange
    , limparCarrinho
    , totalFormatado
    , cartIconNumber
    , alertData
    , setAlertData
    , produtos
    , subtotais


}
    : IConteudoCarrinho) => {
    return (
        <>
            <section id="cart-container-section" className="dsc-container">
                <div className="dsc-card dsc-mb20">
                    {produtos.map((item, index) => (
                        <div key={`${item.id}-${index}`} className="dsc-cart-item-container dsc-line-bottom">
                            <div className="dsc-cart-item-left">
                                <img src={item.imgUrl} alt={item.nome} />
                                <div className="dsc-cart-item-description">
                                    <h3>{item.nome}</h3>
                                    <div className="dsc-cart-item-quantity-container">
                                        <button className="dsc-cart-item-quantity-btn" onClick={() => { handleQuantityChange(item.id, '-'); cartIconNumber(); }}>
                                            -
                                        </button>
                                        <p>{item.quantidade}</p>
                                        <button className="dsc-cart-item-quantity-btn" onClick={() => { handleQuantityChange(item.id, '+'); cartIconNumber(); }}>
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="dsc-cart-item-right">
                                <h3>R$ {subtotais[index].toFixed(2).replace('.', ',')}</h3>
                            </div>
                        </div>
                    ))}

                    <div className="dsc-cart-total-container">
                        <h3>Total: R$ {totalFormatado} </h3>
                    </div>
                </div>
                <div className="dsc-btn-page-container">
                    <FinalizarPedido title="Finalizar Pedido" />
                    <ContinuarComprando link="/catalogo" title="Continuar Comprando" />
                    <Limpar onClickHandle={limparCarrinho} title="Limpar Carrinho" />

                    {alertData && <Alert {...alertData} onClose={() => setAlertData(null)} />}
                </div>
            </section>
        </>
    )
}
export { ConteudoCarrinho }