import { useParams, useNavigate } from 'react-router-dom';
import ProdutoDTO from "../../../models/ProdutosDTO"; // Certifique-se de que ProdutoDTO seja um array de produtos
import './styles.css';
import { useState } from 'react';

const Formulario = () => {
  const { id } = useParams(); // Pega o id da URL
  const navigate = useNavigate(); // Para redirecionar o usuário

  const produto = ProdutoDTO.find((produto) => produto.id === Number(id)); // Encontra o produto pelo id
  // Inicializando os estados com os valores do produto
  const [categoria, setCategoria] = useState<number>(produto?.categoria[0]?.id || 0);
  const [nomeProduto, setNomeProduto] = useState<string>(produto?.nome || '');
  const [precoProduto, setPrecoProduto] = useState<number>(produto?.preco || 0);
  const [imagemProduto, setImagemProduto] = useState<string>(produto?.imagem || '');
  const [descricaoProduto, setDescricaoProduto] = useState<string>(produto?.descricao || '');
  // Caso o produto não seja encontrado, redirecionamos para a listagem de produtos
  if (!produto) {
    navigate("/Administrativo/AdminHome/Listagem");
    return <div>Produto não encontrado!</div>;
  }



  // Função para salvar o produto
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Atualizar o produto no array ProdutoDTO
    const updatedProduto = {
      id: produto.id, // Mantém o mesmo id
      nome: nomeProduto,
      preco: precoProduto,
      imagem: imagemProduto,
      descricao: descricaoProduto,
      categoria: [{ id: categoria, nome: 'Categoria' }], // Ou use um array de categorias se necessário
    };

    // Substituindo o produto antigo pelo atualizado
    const index = ProdutoDTO.findIndex((p) => p.id === produto.id);
    if (index !== -1) {
      ProdutoDTO[index] = updatedProduto;
    }

    // Após salvar, redireciona para a listagem de produtos
    navigate("/Administrativo/AdminHome/Listagem");
  };

  return (
    <>

      <main>
        <section id="product-form-section" className="dsc-container">
          <div className="dsc-product-form-container">
            <form className="dsc-card dsc-form" onSubmit={handleSubmit}>
              <h2>Dados do produto</h2>
              <div className="dsc-form-controls-container">
                <div>
                  <input
                    className="dsc-form-control"
                    type="text"
                    placeholder="Nome"
                    value={nomeProduto}
                    onChange={(e) => setNomeProduto(e.target.value)}
                  />
                </div>
                <div>
                  <input
                    className="dsc-form-control"
                    type="number"
                    placeholder="Preço"
                    value={precoProduto}
                    onChange={(e) => setPrecoProduto(Number(e.target.value))}
                  />
                </div>
                <div>
                  <input
                    className="dsc-form-control"
                    type="text"
                    placeholder="Imagem"
                    value={imagemProduto}
                    onChange={(e) => setImagemProduto(e.target.value)}
                  />
                </div>
                <div>
                  <select
                    className="dsc-form-control dsc-select"
                    value={categoria}
                    required
                    onChange={(e) => setCategoria(Number(e.target.value))}
                  >
                    <option value="" disabled>
                      Categorias
                    </option>
                    {produto.categoria.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <textarea
                    className="dsc-form-control dsc-textarea"
                    placeholder="Descrição"
                    value={descricaoProduto}
                    onChange={(e) => setDescricaoProduto(e.target.value)}
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
