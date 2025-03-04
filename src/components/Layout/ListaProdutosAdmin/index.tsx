import "../../../pages/HomeAdminstrativo/Formulario/styles.css"
import "./styles.css"
import editar from "../../../assets/images/edit.svg";
import deletar from "../../../assets/images/delete.svg";
import * as produtoService from "../../../services/ProdutoService"
import { useEffect, useState } from "react";
import { ProdutoDTO } from "../../../models/dto/ProdutosDTO";
import { Link } from "react-router-dom";

const ListaProdutos = () => {
    const [produto, setProduto] = useState<ProdutoDTO[]>([])
    


    useEffect(()=>{
        const buscarProduto=async()=>{
          const prod=await  produtoService.findAll();
          return prod
        }
        buscarProduto().then(prod => setProduto(prod.data))
    },[])
    return (
        <>
            {produto.map((produto) => (
                <tr key={produto.id}>
                    <td className="dsc-tb576">{produto.id}</td>
                    <td>
                        <img
                            className="dsc-product-listing-image"
                            src={produto.imgUrl}
                            alt="Produto"
                        />
                    </td>
                    <td className="dsc-tb768">{produto.preco}</td>
                    <td className="dsc-txt-left">{produto.nome}</td>
                    <td>
                        <Link to={`/Administrativo/Formulario/${produto.id}`}>
                            <img
                                className="dsc-product-listing-btn"
                                src={editar}
                                alt="Editar"
                            />
                        </Link>
                    </td>
                    <td>
                        <img
                            className="dsc-product-listing-btn"
                            src={deletar}
                            alt="Deletar"
                        />
                    </td>
                </tr>
            ))} 
        </>
    );
};

export default ListaProdutos;
