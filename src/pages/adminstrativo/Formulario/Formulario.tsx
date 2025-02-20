import { useParams, useNavigate } from 'react-router-dom';
import ProdutoDTO from "../../../models/ProdutosDTO";
import HeaderAdmin from '../../../components/HeaderAdmin';
import './styles.css';

const Formulario = () => {
  const { id } = useParams(); // Pega o id da URL
  const produto = ProdutoDTO.find((produto) => produto.id === Number(id)); // Encontra o produto pelo id
  const navigate = useNavigate(); // Para redirecionar o usuário se o produto não for encontrado

  if (!produto) {
    // Caso o produto não seja encontrado, redirecionamos para a listagem de produtos
    navigate("/Administrativo/Listagem");
    return <div>Produto não encontrado!</div>;
  }

  return (
    <>
      <HeaderAdmin />
      <main>
        <section id="product-form-section" className="dsc-container">
          <div className="dsc-product-form-container">
            <form className="dsc-card dsc-form">
              <h2>Dados do produto</h2>
              <div className="dsc-form-controls-container">
                <div>
                  <input
                    className="dsc-form-control"
                    type="text"
                    placeholder="Nome"
                    value={produto.nome}
                    readOnly // Não permitir edição do nome diretamente
                  />
                </div>
                <div>
                  <input
                    className="dsc-form-control"
                    type="number"
                    placeholder="Preço"
                    value={produto.preco}
                    readOnly // Não permitir edição direta do preço
                  />
                </div>
                <div>
                  <input
                    className="dsc-form-control"
                    type="text"
                    placeholder="Imagem"
                    value={produto.imagem}
                    readOnly // Não permitir edição direta da imagem
                  />
                </div>
                <div>
                  <select
                    className="dsc-form-control dsc-select"
                    value={produto.categoria[0].id} // Seleciona a primeira categoria (ou ajuste conforme necessário)
                    required
                  >
                    <option value="" disabled>Categorias</option>
                    {produto.categoria.map((categoria) => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <textarea
                    className="dsc-form-control dsc-textarea"
                    placeholder="Descrição"
                    value={produto.descricao}
                    readOnly // Não permitir edição direta da descrição
                  ></textarea>
                </div>
              </div>

              <div className="dsc-product-form-buttons">
                <button type="reset" className="dsc-btn dsc-btn-white">Cancelar</button>
                <button type="submit" className="dsc-btn dsc-btn-blue">Salvar</button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </>
  );
};

export default Formulario;
