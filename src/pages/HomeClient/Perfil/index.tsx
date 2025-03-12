import { useEffect, useState } from 'react';
import { EnderecoDTO, UserDTO } from '../../../models/dto/UserDTO';
import './styles.css';
import * as authService from '../../../services/AuthService';

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

    useEffect(() => {
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
    }, []);

    return (
        <main>
            <section className="registro-formulario">
                <h2>Perfil do Usuário</h2>
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
                <h3>Histórico de Pedidos</h3>
                <div id="historico-pedidos">
                    <ul>
                        {/* Adicione os itens do histórico de pedidos aqui */}
                    </ul>
                </div>
            </section>
        </main>
    );
};

export { Perfil };
