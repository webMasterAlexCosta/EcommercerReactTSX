import "../../../pages/HomeAdminstrativo/Formulario/styles.css";
import editar from "../../../assets/images/edit.svg";
import deletar from "../../../assets/images/delete.svg";
import * as produtoService from "../../../services/ProdutoService";
import { useState } from "react";
import { ProdutoDTO } from "../../../models/dto/ProdutosDTO";
import { Link } from "react-router-dom";
import { Alert } from "@mui/material";

interface IListaProdutos {
  produtosRecebidos?: ProdutoDTO[];  // Espera a lista de produtos recebidos como prop
}

const ListaProdutos = ({ produtosRecebidos }: IListaProdutos) => {
  const [alertData, setAlertData] = useState<{
    title: string;
    text: string;
    icon: "success" | "error" | "warning" | "info";
  } | null>(null);  // Estado para o alerta

  const handleDelete = async (id: number | undefined) => {
    if (id === undefined) {
      console.error("Produto ID is undefined");
      return;
    }

    try {
      const response = await produtoService.deleteProduto(id);
      
      if (response?.status === 200) {
        setAlertData({
          title: "Produto Deletado",
          text: "O produto foi deletado com sucesso!",
          icon: "success",
        });
      } else {
        setAlertData({
          title: "Erro",
          text: "Houve um erro ao deletar o produto.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      setAlertData({
        title: "Erro",
        text: "Ocorreu um erro ao tentar deletar o produto. Tente novamente.",
        icon: "error",
      });
    }
  };

  const handleAlertClose = () => {
    setAlertData(null);
  };

  return (
    <>
      {alertData && (
        <div className="alert-container">
          <Alert severity={alertData.icon} onClose={handleAlertClose}>
            {alertData.text}
          </Alert>
        </div>
      )}

      <table className="product-list-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Imagem</th>
            <th>Preço</th>
            <th>Nome</th>
            <th>Editar</th>
            <th>Deletar</th>
          </tr>
        </thead>
        <tbody>
          {produtosRecebidos?.map((produto) => (
            <tr key={produto.id}>
              <td className="alex-tb576">{produto.id}</td>
              <td>
                <img
                  className="alex-product-listing-image"
                  src={produto.imgUrl}
                  alt="Produto"
                />
              </td>
              <td className="alex-tb768">{produto.preco}</td>
              <td className="alex-txt-left">{produto.nome}</td>
              <td>
                <Link to={`/Administrativo/Formulario/${produto.id}`}>
                  <img
                    className="alex-product-listing-btn"
                    src={editar}
                    alt="Editar"
                  />
                </Link>
              </td>
              <td>
                <button onClick={() => handleDelete(produto.id)}>
                  <img
                    className="alex-product-listing-btn"
                    src={deletar}
                    alt="Deletar"
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ListaProdutos;
