import { useParams, useNavigate } from "react-router-dom";
import { ProdutoDTO } from "../../../models/dto/ProdutosDTO"; 
import "./styles.css";
import { useEffect, useState } from "react";
import * as produtoService from "../../../services/ProdutoService";
import { Alert } from "@mui/material";

const Formulario = () => {
    const { id } = useParams();
    const navigate = useNavigate(); 

    const [produto, setProduto] = useState<ProdutoDTO | null>(null);
    const [categoria, setCategoria] = useState<number>(0);
    const [nomeProduto, setNomeProduto] = useState<string>("");
    const [precoProduto, setPrecoProduto] = useState<number>(0);
    const [imagemProduto, setImagemProduto] = useState<string>("");
    const [descricaoProduto, setDescricaoProduto] = useState<string>("");

    // Estado para o alerta
    const [alertData, setAlertData] = useState<{
        title: string;
        text: string;
        icon: "success" | "error" | "warning" | "info";
    } | null>(null);

    useEffect(() => {
        const buscarProduto = async () => {
            try {
                const response = await produtoService.findById(Number(id));
                const produtoEncontrado = response.data;

                if (!produtoEncontrado) {
                    navigate("/Administrativo/AdminHome/Listagem");
                    return;
                }
                setProduto(produtoEncontrado);
                setCategoria(produtoEncontrado.categorias[0]?.id || 0);
                setNomeProduto(produtoEncontrado.nome);
                setPrecoProduto(produtoEncontrado.preco);
                setImagemProduto(produtoEncontrado.imgUrl);
                setDescricaoProduto(produtoEncontrado.descricao);
            } catch (error) {
                console.error("Erro ao buscar produto:", error);
                navigate("/Administrativo/AdminHome/Listagem");
            }
        };

        if (id) {
            buscarProduto();
        }
    }, [id, navigate]);

    // Função de envio do formulário
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!produto) return;

        const updatedProduto: ProdutoDTO = {
            ...produto, 
            nome: nomeProduto,
            preco: precoProduto,
            imgUrl: imagemProduto,
            descricao: descricaoProduto,
            categorias: [{ id: categoria, nome: "Categoria" }],
        };

        try {
            const response = await produtoService.updateProduto(updatedProduto);

            if (response?.status === 200) {
                setAlertData({
                    title: "Produto Atualizado",
                    text: "O produto foi atualizado com sucesso!",
                    icon: "success"
                });
            } else {
                setAlertData({
                    title: "Erro",
                    text: "Houve um erro ao atualizar o produto.",
                    icon: "error"
                });
            }
        } catch (error) {
            console.error("Erro ao atualizar produto:", error);
            setAlertData({
                title: "Erro",
                text: "Ocorreu um erro ao tentar atualizar o produto. Tente novamente.",
                icon: "error"
            });
        }
    };

    const handleAlertClose = () => {
        if (alertData?.icon === "success") {
            navigate("/Administrativo/Listagem"); 
        }
        setAlertData(null); 
    };

    return (
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
                                    {produto?.categorias.map((cat) => (
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

export default Formulario;
