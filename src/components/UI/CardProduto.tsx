import { ProdutoDTO } from "../../models/dto/ProdutosDTO"
import { Link } from "react-router-dom";
import ButtonActions from "../../components/UI/ButtonActions";
interface ICard {
    produtos: ProdutoDTO[]
    loading:boolean
}

const CardProduto = ({ produtos,loading }: ICard) => {


    return (
        <>
            {/* O catálogo em si */}
            <div className="dsc-catalog-cards dsc-mb20 dsc-mt20">
                {loading ? (
                    <p>Carregando produtos...</p> // Exibe o texto de carregamento
                ) : produtos && produtos.length > 0 ? (
                    produtos.map(itemProduto => (
                        <div key={itemProduto.id} className="dsc-card">
                            <div className="dsc-catalog-card-top dsc-line-bottom">
                                <img src={itemProduto.imgUrl} alt={itemProduto.nome} />
                            </div>
                            <div style={{ width: "auto" }}>
                                <Link to={`/Catalogo/Detalhes/${itemProduto.id}`}>
                                    <ButtonActions nome="Detalhes" className="dsc-btn dsc-btn-blue" />
                                </Link>
                            </div>
                            <div className="dsc-catalog-card-bottom">
                                <h3>R$ {itemProduto.preco}</h3>
                                <h4>{itemProduto.nome}</h4>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Nenhum produto encontrado.</p> // Caso não haja produtos
                )}
            </div>
        </>
    )
}
export { CardProduto }