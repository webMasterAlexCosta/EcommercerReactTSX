import { useEffect, useState } from 'react';
import { EnderecoDTO, UserDTO } from '../../../models/dto/UserDTO';
import './styles.css';
import * as authService from '../../../services/AuthService';
import requestBackEnd from '../../../utils/request';
import { AxiosRequestConfig } from 'axios';
import { HISTORICO_PEDIDO_USER } from '../../../utils/system';
import { PedidoHistorico } from '../../../models/dto/CarrinhoDTO';

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
            <section className="registro-formulario">
                <h2>Perfil do Usuário</h2>
                {/* Detalhes do perfil do usuário */}
                <div className="formulario-grupo">
                    <label htmlFor="nome">Nome</label>
                    <input type="text" id="nome" value={usuario.nome} readOnly />
                </div>
                <div className="formulario-grupo">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" value={usuario.email} readOnly />
                </div>
                <div className="formulario-grupo">
                    <label htmlFor="cep">CEP</label>
                    <input type="text" id="cep" value={usuario.endereco?.cep || ''} readOnly />
                </div>
                <div className="formulario-grupo">
                    <label htmlFor="logradouro">Logradouro</label>
                    <input type="text" id="logradouro" value={usuario.endereco?.logradouro || ''} readOnly />
                </div>
                <div className="formulario-grupo">
                    <label htmlFor="numero">Número</label>
                    <input type="text" id="numero" value={usuario.endereco?.numero || ''} readOnly />
                </div>
                <div className="formulario-grupo">
                    <label htmlFor="complemento">Complemento</label>
                    <input type="text" id="complemento" value={usuario.endereco?.complemento || ''} readOnly />
                </div>
                <div className="formulario-grupo">
                    <label htmlFor="bairro">Bairro</label>
                    <input type="text" id="bairro" value={usuario.endereco?.bairro || ''} readOnly />
                </div>
                <div className="formulario-grupo">
                    <label htmlFor="cidade">Cidade</label>
                    <input type="text" id="cidade" value={usuario.endereco?.cidade || ''} readOnly />
                </div>
                <div className="formulario-grupo">
                    <label htmlFor="estado">Estado</label>
                    <input type="text" id="estado" value={usuario.endereco?.uf || ''} readOnly />
                </div>
                <div className="formulario-grupo">
                    <label htmlFor="data-nascimento">Data de Nascimento</label>
                    <input type="date" id="data-nascimento" value={usuario.dataNascimento} readOnly />
                </div>

                {/* Botões para mudar senha e endereço */}
                <div className="container-btns">
                    <div className="formulario-grupo">
                        <a href="mudarSenha.html">
                            <button id="botao2">Mudar Senha</button>
                        </a>
                    </div>
                    <div className="formulario-grupo">
                        <a href="mudarEndereco.html">
                            <button id="botao1">Mudar Endereço</button>
                        </a>
                    </div>
                    <div className="formulario-grupo">
                        <button id="botao">Fazer Logout</button>
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
                                        <p>Data: {pedido.momento.replace("T"," - ").replace("Z","")}</p>
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
            </section>
        </main>
    );
};

export { Perfil };
