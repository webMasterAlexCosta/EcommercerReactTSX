import "./styles.css";  // Certifique-se de importar o arquivo de estilos
import { ProdutoDTO } from "../../../models/dto/ProdutosDTO";
import { Link } from "react-router-dom";
import ButtonActions from "../../UI/ButtonActions";
import { CarregandoProdutos } from "../CarregandoProdutos";

interface ICard {
    produtos: ProdutoDTO[];
    loading: boolean;
}

const CardProduto = ({ produtos, loading }: ICard) => {

    // Função para renderizar os produtos
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
               <CarregandoProdutos title="Carregando Produtos"/>
            ) : produtos.length === 0 ? (
                // Quando não houver produtos, mostrar a mensagem de "Nenhum produto encontrado"
                <CarregandoProdutos className="nenhum-produto" title="nenhum produto encontrado"/>
            ) : (
                // Quando houver produtos, renderizar a lista de produtos com a classe dsc-catalog-cards
                <div className="dsc-catalog-cards dsc-mb20 dsc-mt20">
                    {renderProdutos()}
                </div>
            )}
        </>
    );
};

export { CardProduto };
