import { useState } from 'react';



const CriarNovoProduto = () => {
  const [produto, setProduto] = useState({
    nome: '',
    preco: '',
    imagem: '',
    descricao: '',
    categoria: []
  });

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduto((prevProduto) => ({
      ...prevProduto,
      [name]: value
    }));
  };



  return (
    <>
      
      <main>
        <section id="product-form-section" className="dsc-container">
          <div className="dsc-product-form-container">
            <form className="dsc-card dsc-form">
              <h2>Criar Novo Produto</h2>
              <div className="dsc-form-controls-container">
                <div>
                  <input
                    className="dsc-form-control"
                    type="text"
                    name="nome"
                    placeholder="Nome do Produto"
                    value={produto.nome}
                    onChange={handleChange}
                    // ou posso usar  assim  pra n esquecer onChange={(e) => setProduto({ ...produto, [e.target.name]: e.target.value })}

                    required
                  />
                </div>
                <div>
                  <input
                    className="dsc-form-control"
                    type="number"
                    name="preco"
                    placeholder="Preço"
                    value={produto.preco}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <input
                    className="dsc-form-control"
                    type="text"
                    name="imagem"
                    placeholder="Imagem (URL)"
                    value={produto.imagem}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <select
                    className="dsc-form-control dsc-select"
                    name="categoria"
                    value={produto.categoria}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Categorias</option>
                    <option value="1">Categoria 1</option>
                    <option value="2">Categoria 2</option>
                  
                  </select>
                </div>
                <div>
                  <textarea
                    className="dsc-form-control dsc-textarea"
                    name="descricao"
                    placeholder="Descrição do Produto"
                    value={produto.descricao}
                    onChange={handleChange}
                    required
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

export default CriarNovoProduto;
