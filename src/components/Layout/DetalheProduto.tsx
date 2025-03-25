import { ProdutoDTO } from "../../models/dto/ProdutosDTO"
import ButtonCategoria from "../../components/UI/ButtonCategoria.tsx";

interface DetalheProp{
    produtoAtual:ProdutoDTO
}

const DetalheProduto=({produtoAtual}:DetalheProp)=>{
  
    return (
        <>
         <div className="dsc-card dsc-mb20">
        <div className="dsc-product-details-top dsc-line-bottom">
          <img src={produtoAtual.imgUrl} alt={produtoAtual.nome} />
        </div>
        <div className="dsc-product-details-bottom">
          <h3>{produtoAtual.preco}</h3>
          <h4>{produtoAtual.nome}</h4>
          <p>{produtoAtual.descricao}</p>
          <div className="dsc-category-container">
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