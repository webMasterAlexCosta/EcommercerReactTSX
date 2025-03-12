import "./styles.css";  // Certifique-se de importar o arquivo de estilos
import { ProdutoDTO } from "../../../models/dto/ProdutosDTO";
import { Link } from "react-router-dom";
import ButtonActions from "../../UI/ButtonActions";
import { Carregando } from "../../UI/Carregando";

interface ICard {
    produtos: ProdutoDTO[];
    loading: boolean;
}

const CardProduto = ({ produtos, loading }: ICard) => {

    const renderProdutos = () => {
        return produtos.map(itemProduto => (
            <div key={itemProduto.id} className="dsc-card">
                <div className="dsc-catalog-card-top dsc-line-bottom">
                    <img
                        src={itemProduto.imgUrl}
                        alt={`Imagem do produto ${itemProduto.nome}`}
                    />
                </div>
                <div>
                    <Link to={`/Catalogo/Detalhes/${itemProduto.id}`}>
                        <ButtonActions nome="Detalhes" className="dsc-btn dsc-btn-blue" />
                    </Link>
                </div>
                <div className="dsc-catalog-card-bottom">
                    <h3>R$ {itemProduto.preco}</h3>
                    <h4>{itemProduto.nome}</h4>
                </div>
            </div>
        ));
    };

    return (
        <>
            {loading ? (
               <Carregando title="Carregando Produtos"/>
            ) : produtos.length === 0 ? (
                <Carregando className="nenhum-produto" title="nenhum produto encontrado"/>
            ) : (
                <div className="dsc-catalog-cards dsc-mb20 dsc-mt20">
                    {renderProdutos()}
                </div>
            )}
        </>
    );
};

export { CardProduto };
