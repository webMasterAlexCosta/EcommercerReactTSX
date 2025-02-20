import imagem from '../assets/images/computer.png';

// Definindo as interfaces para o Tipo
interface Categoria {
  id: number;
  nome: string;
}

interface Produto {
  id: number;
  nome: string;
  preco: number;
  imagem: string;
  descricao: string;
  categoria: Categoria[];
}

class ProdutoClass implements Produto {
  id: number;
  nome: string;
  preco: number;
  imagem: string;
  descricao: string;
  categoria: Categoria[];

  constructor(
    id: number,
    nome: string,
    preco: number,
    imagem: string,
    descricao: string,
    categoria: Categoria[]
  ) {
    this.id = id++;
    this.nome = nome;
    this.preco = preco;
    this.imagem = imagem;
    this.descricao = descricao;
    this.categoria = categoria;
  }
}

// Criando categorias e produtos
const produtos: Produto[] = [
  new ProdutoClass(
    1,
    "Computador Gamer XT",
    5000.00,
    imagem,
    "Computador gamer com performance de alta qualidade para jogos pesados e streamings. Equipado com os melhores componentes.",
    [
      { id: 1, nome: "Computadores" },
      { id: 2, nome: "Eletrônicos" },
      { id: 3, nome: "Gamer" }
    ]
  ),
  new ProdutoClass(
    2,
    "Notebook Gamer Pro",
    6500.00,
    imagem,
    "Notebook poderoso com placa gráfica avançada e tela de alta resolução. Ideal para quem busca portabilidade sem perder desempenho.",
    [
      { id: 1, nome: "Notebooks" },
      { id: 2, nome: "Eletrônicos" },
      { id: 3, nome: "Gamer" }
    ]
  ),
  new ProdutoClass(
    3,
    "Monitor Curvo 32''",
    3000.00,
    imagem,
    "Monitor curvo 144Hz, com resolução 4K, perfeito para gamers que buscam imersão e alto desempenho visual.",
    [
      { id: 1, nome: "Monitores" },
      { id: 2, nome: "Eletrônicos" },
      { id: 3, nome: "Gamer" }
    ]
  ),
  new ProdutoClass(
    4,
    "Teclado Mecânico RGB",
    550.00,
    imagem,
    "Teclado mecânico com iluminação RGB, switches de alta durabilidade e precisão para uma experiência de jogo imersiva.",
    [
      { id: 1, nome: "Acessórios" },
      { id: 2, nome: "Eletrônicos" },
      { id: 3, nome: "Gamer" }
    ]
  ),
  new ProdutoClass(
    5,
    "Mouse Gamer Precision",
    400.00,
    imagem,
    "Mouse ergonômico com sensor de alta precisão, perfeito para jogos rápidos e com vários botões programáveis.",
    [
      { id: 1, nome: "Acessórios" },
      { id: 2, nome: "Eletrônicos" },
      { id: 3, nome: "Gamer" }
    ]
  )
];

export default produtos;
