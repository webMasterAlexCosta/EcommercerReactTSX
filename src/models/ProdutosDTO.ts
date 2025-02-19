import imagem from '../assets/images/computer.png';

const ProdutoDTO = [
  {
    id: 1,
    nome: "Computador Gamer XT",
    preco: 5000.00,
    imagem: imagem,
    descricao: "Computador gamer com performance de alta qualidade para jogos pesados e streamings. Equipado com os melhores componentes.",
    categoria: [
      { id: 1, nome: "Computadores" },
      { id: 2, nome: "Eletrônicos" },
      { id: 3, nome: "Gamer" }
    ]
  },
  {
    id: 2,
    nome: "Notebook Gamer Pro",
    preco: 6500.00,
    imagem: imagem,
    descricao: "Notebook poderoso com placa gráfica avançada e tela de alta resolução. Ideal para quem busca portabilidade sem perder desempenho.",
    categoria: [
      { id: 1, nome: "Notebooks" },
      { id: 2, nome: "Eletrônicos" },
      { id: 3, nome: "Gamer" }
    ]
  },
  {
    id: 3,
    nome: "Monitor Curvo 32''",
    preco: 3000.00,
    imagem: imagem,
    descricao: "Monitor curvo 144Hz, com resolução 4K, perfeito para gamers que buscam imersão e alto desempenho visual.",
    categoria: [
      { id: 1, nome: "Monitores" },
      { id: 2, nome: "Eletrônicos" },
      { id: 3, nome: "Gamer" }
    ]
  },
  {
    id: 4,
    nome: "Teclado Mecânico RGB",
    preco: 550.00,
    imagem: imagem,
    descricao: "Teclado mecânico com iluminação RGB, switches de alta durabilidade e precisão para uma experiência de jogo imersiva.",
    categoria: [
      { id: 1, nome: "Acessórios" },
      { id: 2, nome: "Eletrônicos" },
      { id: 3, nome: "Gamer" }
    ]
  },
  {
    id: 5,
    nome: "Mouse Gamer Precision",
    preco: 400.00,
    imagem: imagem,
    descricao: "Mouse ergonômico com sensor de alta precisão, perfeito para jogos rápidos e com vários botões programáveis.",
    categoria: [
      { id: 1, nome: "Acessórios" },
      { id: 2, nome: "Eletrônicos" },
      { id: 3, nome: "Gamer" }
    ]
  }
];

export default ProdutoDTO;
