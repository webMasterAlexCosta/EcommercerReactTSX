import { ProdutoDTO } from "../../models/dto/ProdutosDTO"
import ButtonCategoria from "../../components/UI/ButtonCategoria.tsx";

interface DetalheProp{
    produtoAtual:ProdutoDTO
}

const DetalheProduto=({produtoAtual}:DetalheProp)=>{
  
    return (
        <>
         <div className="alex-card alex-mb20">
        <div className="alex-product-details-top alex-line-bottom">
          <img src={produtoAtual.imgUrl} alt={produtoAtual.nome} />
        </div>
        <div className="alex-product-details-bottom">
          <h3>{produtoAtual.preco}</h3>
          <h4>{produtoAtual.nome}</h4>
          <p>{produtoAtual.descricao}</p>
          <div className="alex-category-container">
            {produtoAtual.categorias.map(categoria => (
              <ButtonCategoria key={categoria.id} nomeCategoria={categoria.nome} />
            ))}
          </div>
        </div>
      </div>
        </>
    )

}
export {DetalheProduto}