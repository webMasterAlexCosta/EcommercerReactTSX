import { useEffect, useState } from 'react';
import { CategoriasDTO, ProdutoDTO } from '../../../models/dto/ProdutosDTO';
import * as produtoService from "../../../services/ProdutoService";
import { useNavigate } from 'react-router-dom';
import { Alert } from '@mui/material';

const CriarNovoProduto = () => {
  const navigate = useNavigate();
  const [produto, setProduto] = useState<ProdutoDTO>({
    id: 0,
    nome: '',
    preco: 0,
    imgUrl: '',
    descricao: '',
    categorias: [],
    quantidade: 0
  });
  const [categorias, setCategorias] = useState<CategoriasDTO[]>([]);
  const [alertData, setAlertData] = useState<{
    title: string;
    text: string;
    icon: "success" | "error" | "warning" | "info";
  } | null>(null);

  useEffect(() => {
    const buscar = async () => {
      const response = await produtoService.findAllCategories();
      setCategorias(response);
    };
    buscar();
  }, []);

  const handleSubmit = async (produto: ProdutoDTO) => {
    try {
      const response = await produtoService.novoProduto(produto);

      if (response?.status === 200) {
        // Alerta de sucesso
        setAlertData({
          title: "Produto Criado",
          text: "O produto foi criado com sucesso!",
          icon: "success"
        });
      } else {
        setAlertData({
          title: "Erro",
          text: "Houve um erro ao criar o produto.",
          icon: "error"
        });
      }
    } catch (error) {
      console.error(error);
      setAlertData({
        title: "Erro",
        text: "Ocorreu um erro ao tentar criar o produto. Tente novamente.",
        icon: "error"
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'categorias') {
      const categoriaId = parseInt(value);
      const selectedCategoria = categorias.find(categoria => categoria.id === categoriaId);

      if (selectedCategoria) {
        setProduto((produto) => ({
          ...produto,
          categorias: [selectedCategoria]
        }));
      }
    } else {
      setProduto((produto) => ({
        ...produto,
        [name]: value
      }));
    }
  };

  const handleAlertClose = () => {
    if (alertData?.icon === "success") {
      navigate('/Administrativo/Listagem');
    }
    setAlertData(null); 
  };

  return (
    <main>
      <section id="product-form-section" className="dsc-container">
        <div className="dsc-product-form-container">
          <form
            className="dsc-card dsc-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(produto);
            }}
          >
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
                  name="imgUrl"
                  placeholder="Imagem (URL)"
                  value={produto.imgUrl}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <select
                  className="dsc-form-control dsc-select"
                  name="categorias"
                  value={produto.categorias.length > 0 ? produto.categorias[0].id.toString() : ''}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Categorias
                  </option>
                  {categorias.map((categoria: CategoriasDTO) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nome}
                    </option>
                  ))}
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
              <button type="reset" className="dsc-btn dsc-btn-white">
                Cancelar
              </button>
              <button type="submit" className="dsc-btn dsc-btn-blue">
                Salvar
              </button>
            </div>
          </form>
        </div>
      </section>

      {alertData && (
        <Alert
          severity={alertData.icon}
          onClose={handleAlertClose} 
        >
          {alertData.text}
        </Alert>
      )}
    </main>
  );
};

export default CriarNovoProduto;
