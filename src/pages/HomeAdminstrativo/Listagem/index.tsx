import { Link } from "react-router-dom";
import ListaProdutos from "../../../components/Layout/ListaProdutosAdmin";
import "./style.css"
const Listagem = () => {
  return (
    <>
      
      <main>
        <section id="product-listing-section" className="alex-container">
          <h2 className="alex-section-title alex-mb20">Cadastro de produtos</h2>

          <div className="alex-btn-page-container alex-mb20">

            <Link to="/Administrativo/CriarNovoProduto/novo" className="alex-btn alex-btn-white">
              Novo
            </Link>
          </div>

          <form className="alex-search-bar">
            <button type="submit">🔎︎</button>
            <input type="text" placeholder="Nome do produto" />
            <button type="reset">🗙</button>
          </form>

          <table className="alex-table alex-mb20 alex-mt20">
           
            <tbody>
              <ListaProdutos />
            
            </tbody>
          </table>

          <div className="alex-btn-next-page">Carregar mais</div>
        </section>
      </main>
    </>
  )
}
export default Listagem;