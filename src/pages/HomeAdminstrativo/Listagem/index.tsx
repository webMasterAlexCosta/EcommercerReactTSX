import { Link } from "react-router-dom";
import ListaProdutos from "../../../components/Layout/ListaProdutosAdmin";

const Listagem = () => {
  return (
    <>
      
      <main>
        <section id="product-listing-section" className="dsc-container">
          <h2 className="dsc-section-title dsc-mb20">Cadastro de produtos</h2>

          <div className="dsc-btn-page-container dsc-mb20">

            <Link to="/Administrativo/CriarNovoProduto/novo" className="dsc-btn dsc-btn-white">
              Novo
            </Link>
          </div>

          <form className="dsc-search-bar">
            <button type="submit">🔎︎</button>
            <input type="text" placeholder="Nome do produto" />
            <button type="reset">🗙</button>
          </form>

          <table className="dsc-table dsc-mb20 dsc-mt20">
            <thead>
              <tr>
                <th className="dsc-tb576">ID</th>
                <th></th>
                <th className="dsc-tb768">Preço</th>
                <th className="dsc-txt-left">Nome</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <ListaProdutos />
            
            </tbody>
          </table>

          <div className="dsc-btn-next-page">Carregar mais</div>
        </section>
      </main>
    </>
  )
}
export default Listagem;