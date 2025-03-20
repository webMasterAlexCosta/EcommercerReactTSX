import { useEffect, useState } from 'react';
import './styles.css';
import * as authService from '../../../services/AuthService';
import requestBackEnd from '../../../utils/request';
import { AxiosRequestConfig } from 'axios';
import { API_IMGBB, HISTORICO_PEDIDO_USER } from '../../../utils/system';
import { PedidoHistorico } from '../../../models/dto/CarrinhoDTO';
import { Link } from 'react-router-dom';
import { MudarSenha } from '../../../components/Layout/MudarSenha';
import { FormularioUser } from '../../../components/UI/Formulario';
import { EnderecoDTO, UserDTO } from '../../../models/dto/UserDTO';

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

    const [historicoPedidos, setHistoricoPedidos] = useState<PedidoHistorico[]>([]);
    const [mudarSenha, setMudarSenha] = useState<boolean>(false);
    const [fotoPerfil, setFotoPerfil] = useState<string>('');
    const [fotoSelecionada, setFotoSelecionada] = useState<File | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const [erroUpload, setErroUpload] = useState<string | null>(null);

    useEffect(() => {
        const obterUsuario = async () => {
            const idUserToken = authService.getAccessTokenPayload()?.sub;
            console.log(idUserToken);
            console.log("ID do usuário a partir do token: ", idUserToken);
            if (authService.isAuthenticated()) {
                const usuarioLogado = authService.getUser();
                setUsuario({
                    id: idUserToken || "",
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

        const obterHistoricoPedido = async () => {
            const config: AxiosRequestConfig = {
                method: "GET",
                url: HISTORICO_PEDIDO_USER,
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            };

            try {
                const response = await requestBackEnd(config);
                setHistoricoPedidos(response.data);
            } catch (error) {
                console.error('Erro ao obter histórico de pedidos', error);
            }
        };

        obterUsuario();
        obterHistoricoPedido();
    }, []);

    useEffect(() => {
        const obterFotoPerfil = async () => {
            if (!usuario.id) return;
            try {
                const response = await requestBackEnd({
                    method: 'GET',
                    url: `/api/usuarios/${usuario.id}/foto`,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });

                console.log("URL da foto de perfil recebida:", JSON.stringify(response.data));
                setFotoPerfil(response.data.fotoPerfil);

            } catch (error) {
                console.error('Erro ao buscar foto de perfil', error);
            }
        };

        if (usuario.id) {
            obterFotoPerfil();
        }
    }, [usuario.id]);

    const handleFotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            if (file.type.startsWith('image/')) {
                setFotoSelecionada(file);
                setErroUpload(null);
            } else {
                setErroUpload("O arquivo selecionado não é uma imagem válida.");
                setFotoSelecionada(null);
            }
            console.log("Foto selecionada para upload: ", file);
        }
    };

    const enviarFotoPerfil = async () => {
        if (!fotoSelecionada) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('image', fotoSelecionada);

        try {
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${API_IMGBB}`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (data.success) {
                const urlFoto = data.data.url;
                console.log("URL da foto de perfil:", urlFoto);

                const userDTO = { fotoPerfil: urlFoto };

                const updateResponse = await requestBackEnd({
                    method: 'PUT',
                    url: `/api/usuarios/${usuario.id}/foto`,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                    data: userDTO,
                });
                if (updateResponse) {
                    setFotoPerfil(urlFoto);
                    setFotoSelecionada(null);
                    setUploading(false);
                } else {
                    setErroUpload('Erro ao salvar a foto no perfil.');
                    setUploading(false);
                }
            } else {
                setErroUpload('Erro ao enviar a foto de perfil.');
                setUploading(false);
            }
        } catch (error) {
            console.error('Erro ao enviar foto de perfil', error);
            setErroUpload("Houve um erro ao enviar sua foto de perfil. Tente novamente mais tarde.");
            setUploading(false);
        }
    };

    return (
        <main>
            {mudarSenha ? (
                <MudarSenha />
            ) : (
                <section className="registro-formulario">
                    <h2>Perfil do Usuário</h2>

                    {/* Foto de Perfil */}
                    <div className="foto-perfil-container">
                        {fotoPerfil ? (
                            <img src={fotoPerfil} alt="Foto de Perfil" className="foto-perfil" />
                        ) : (
                            <p>Você ainda não tem uma foto de perfil.</p>
                        )}
                        {!fotoPerfil && !uploading && (
                            <div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFotoUpload}
                                    id="uploadFoto"
                                    hidden
                                />
                                <button onClick={() => document.getElementById('uploadFoto')?.click()}>
                                    Carregar Foto
                                </button>
                            </div>
                        )}
                        {fotoSelecionada && !uploading && (
                            <div>
                                <button onClick={enviarFotoPerfil}>Enviar Foto</button>
                            </div>
                        )}
                        {uploading && <p>Enviando...</p>}
                        {erroUpload && <p className="erro-upload">{erroUpload}</p>}
                    </div>

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
                                                            <img
                                                                className="img-pedido"
                                                                src={item.imgUrl}
                                                                alt={item.subTotal.toString()}
                                                            />
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
            )}
        </main>
    );
};

export { Perfil };
