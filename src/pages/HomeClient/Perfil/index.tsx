import { useEffect, useState } from 'react';
import { EnderecoDTO, UserDTO } from '../../../models/dto/UserDTO';
import './styles.css';
import * as authService from '../../../services/AuthService';
import requestBackEnd from '../../../utils/request';
import { AxiosRequestConfig } from 'axios';
import { HISTORICO_PEDIDO_USER } from '../../../utils/system';
import { PedidoHistorico } from '../../../models/dto/CarrinhoDTO';
import { Link } from 'react-router-dom';
import { MudarSenha } from '../../../components/Layout/MudarSenha';
import { FormularioUser } from '../../../components/UI/Formulario';


const Perfil = () => {
    const [usuario, setUsuario] = useState<UserDTO>({
        id: "",
        nome: "",
        email: "",
        telefone: "",
        cpf: "",
        dataNascimento: "",
        perfil: [],
        endereco: {} as EnderecoDTO
    });

    const [historicoPedidos, setHistoricoPedidos] = useState<PedidoHistorico[]>([]); // Estado para armazenar os pedidos
    const [mudarSenha, setMudarSenha] = useState<boolean>(false)
    useEffect(() => {
        // Função para obter as informações do usuário
        const obterUsuario = async () => {
            if (authService.isAuthenticated()) {
                const usuarioLogado = authService.getAccessTokenPayload();
                setUsuario({
                    id: usuarioLogado?.id || "",
                    nome: usuarioLogado?.nome || "",
                    email: usuarioLogado?.email || "",
                    telefone: usuarioLogado?.telefone || "",
                    cpf: usuarioLogado?.cpf || "",
                    dataNascimento: usuarioLogado?.dataNascimento || "",
                    perfil: usuarioLogado?.perfis || [],
                    endereco: usuarioLogado?.endereco || {} as EnderecoDTO
                });
            }
        };
        obterUsuario();

        // Função para obter o histórico de pedidos
        const obterHisticoPedido = async () => {
            const config: AxiosRequestConfig = {
                method: "GET",
                url: HISTORICO_PEDIDO_USER,
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,  // Se precisar enviar cookies, mantém esta linha
            };

            try {
                const response = await requestBackEnd(config);
                setHistoricoPedidos(response.data);  // Atualiza o estado com o histórico de pedidos
            } catch (error) {
                console.error('Erro ao obter histórico de pedidos', error);
            }
        };

        obterHisticoPedido();  // Chama a função para buscar o histórico de pedidos
    }, []);

    return (
        <main>
            {mudarSenha ? (
                <MudarSenha />)
                : (
                    <section className="registro-formulario">
                        <h2>Perfil do Usuário</h2>
                        <FormularioUser
                            className="formulario-grupo"
                            label="Nome"
                            htmlFor="nome"
                            type="text"
                            id="nome"
                            value={usuario.nome}
                            readOnly
                        />

                        <FormularioUser
                            className="formulario-grupo"
                            label="Email"
                            htmlFor="email"
                            type="email"
                            id="email"
                            value={usuario.email}
                            readOnly
                        />

                        <FormularioUser
                            className="formulario-grupo"
                            label="CEP"
                            htmlFor="cep"
                            type="text"
                            id="cep"
                            value={usuario.endereco?.cep || ''}
                            readOnly
                        />

                        <FormularioUser
                            className="formulario-grupo"
                            label="Logradouro"
                            htmlFor="logradouro"
                            type="text"
                            id="logradouro"
                            value={usuario.endereco?.logradouro || ''}
                            readOnly
                        />

                        <FormularioUser
                            className="formulario-grupo"
                            label="Número"
                            htmlFor="numero"
                            type="text"
                            id="numero"
                            value={usuario.endereco?.numero || ''}
                            readOnly
                        />

                        <FormularioUser
                            className="formulario-grupo"
                            label="Complemento"
                            htmlFor="complemento"
                            type="text"
                            id="complemento"
                            value={usuario.endereco?.complemento || ''}
                            readOnly
                        />

                        <FormularioUser
                            className="formulario-grupo"
                            label="Bairro"
                            htmlFor="bairro"
                            type="text"
                            id="bairro"
                            value={usuario.endereco?.bairro || ''}
                            readOnly
                        />

                        <FormularioUser
                            className="formulario-grupo"
                            label="Cidade"
                            htmlFor="cidade"
                            type="text"
                            id="cidade"
                            value={usuario.endereco?.cidade || ''}
                            readOnly
                        />

                        <FormularioUser
                            className="formulario-grupo"
                            label="Estado"
                            htmlFor="estado"
                            type="text"
                            id="estado"
                            value={usuario.endereco?.uf || ''}
                            readOnly
                        />

                        <FormularioUser
                            className="formulario-grupo"
                            label="Data de Nascimento"
                            htmlFor="data-nascimento"
                            type="date"
                            id="data-nascimento"
                            value={usuario.dataNascimento}
                            readOnly
                        />

                        {/* Botões para mudar senha e endereço */}
                        <div className="container-btns">
                            <div className="formulario-grupo">
                                <Link to='/perfil/MudarSenha'>
                                    <button id="botao2" onClick={() => setMudarSenha(true)}>Mudar Senha</button>
                                </Link>
                            </div>
                            <div className="formulario-grupo">
                                <a href="mudarEndereco.html">
                                    <button id="botao1">Mudar Endereço</button>
                                </a>
                            </div>

                        </div>

                        {/* Histórico de Pedidos */}
                        <h3>Histórico de Pedidos</h3>
                        <div id="historico-pedidos">
                            <ul>
                                {historicoPedidos.length === 0 ? (
                                    <li>Você ainda não tem pedidos.</li>
                                ) : (
                                    historicoPedidos.map((pedido, index) => (
                                        <li key={index}>
                                            <div className="pedido">
                                                <h4>Pedido #{pedido.numeroPedido}</h4>
                                                <p>Status: {pedido.statusPedido}</p>
                                                <p>Data: {pedido.momento.replace("T", " - ").replace("Z", "")}</p>
                                                <p>Total: R$ {pedido.total.toFixed(2)}</p>

                                                <div>
                                                    <h5>Itens do Pedido:</h5>
                                                    <ul>
                                                        {pedido.items.map((item, idx) => (
                                                            <li key={idx}>
                                                                <img className='img-pedido' src={item.imgUrl} alt={item.subTotal.toString()} />
                                                                <p>Preço: R$ {item.preco.toFixed(2)}</p>
                                                                <p>Quantidade: {item.quantidade}</p>
                                                                <p>Subtotal: R$ {item.subTotal.toFixed(2)}</p>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>
                    </section>)}

        </main>
    );
};

export { Perfil };
