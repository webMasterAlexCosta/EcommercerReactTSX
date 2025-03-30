import { useEffect, useState, useRef } from 'react';
import './styles.css';
import * as authService from '../../../services/AuthService';
import requestBackEnd from '../../../utils/request';
import { FOTO_PERFIL_LOCAL } from '../../../utils/system';
import { PedidoHistorico } from '../../../models/dto/CarrinhoDTO';
import { Link, useNavigate } from 'react-router-dom';
import { MudarSenha } from '../MudarSenha';
import { FormularioUser } from '../../UI/Formulario';
import { EnderecoDTO, UserDTO } from '../../../models/dto/UserDTO';
import { PhotoCamera, UploadFile, Delete, Send, AccountCircle, Error } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import { NovoEndereco } from '../NovoEndereco';
import * as userService from "../../../services/UserServices"
import * as perfilFotoService from "../../../services/PerfilFotoService"
import PedidoUsuario from '../../UI/Pedido';

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
    const [mudarEndereco, setMudarEndereco] = useState<boolean>(false);
    const [fotoPerfil, setFotoPerfil] = useState<string>('');
    const [fotoSelecionada, setFotoSelecionada] = useState<File | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const [erroUpload, setErroUpload] = useState<string | null>(null);
    const navigate = useNavigate()
    const [stream, setStream] = useState<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const modalRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [showCameraModal, setShowCameraModal] = useState<boolean>(false);
    const uploadFotoRef = useRef<HTMLInputElement | null>(null);
    const [fotoCarregada, setFotoCarregada] = useState<boolean>(false);
    const [mostrarPedido, setMostrarPedido] = useState<boolean>(false)
    const [caminhoSenha, setCaminhoSenha] = useState<string>("/PerfilClient/MudarSenha")
    const [caminhoEndereco, setCaminhoEndereco] = useState<string>("/PerfilClient/NovoEndereco")

    useEffect(() => {
        const obterPerfil = async () => {
            const response = await userService.getUserService()
            if (response.perfil.includes("ADMIN")) {
                setCaminhoSenha("/Administrativo/PerfilAdmin/MudarSenha")
                setCaminhoEndereco("/Administrativo/PerfilAdmin/NovoEndereco")
                console.log("caminhoSenha set to Administrativo/MudarSenha")
                console.log("caminhoEndereco set to Administrativo/NovoEndereco")
            }
        }
        obterPerfil()
    }, [])

    useEffect(() => {
        const verificar = async () => {
            if (!(await userService.getTokenService() && authService.isAuthenticated())) {
                navigate("/login");
                return;
            }
        }
        verificar()
        const obterUsuario = async () => {
            const accessTokenPayload = await authService.getAccessTokenPayload();
            const idUserToken = accessTokenPayload?.sub;

            const usuarioLogado = await userService.getUserService();
            setUsuario({
                id: idUserToken || "",
                nome: usuarioLogado?.nome || "",
                email: usuarioLogado?.email || "",
                telefone: usuarioLogado?.telefone || "",
                cpf: usuarioLogado?.cpf || "",
                dataNascimento: usuarioLogado?.dataNascimento || "",
                perfil: usuarioLogado?.perfil || [],
                endereco: usuarioLogado?.endereco || {} as EnderecoDTO
            });

        };



        obterUsuario();

    }, [navigate]);

    useEffect(() => {
        const fotoLocalStorage = localStorage.getItem(FOTO_PERFIL_LOCAL);
        if (fotoLocalStorage) {
            setFotoPerfil(fotoLocalStorage);
            setFotoCarregada(true);
        } else {
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
                    const fotoUrl = response.data.fotoPerfil;
                    if (fotoUrl) {
                        await perfilFotoService.salvarFotoNoLocalStorage(fotoUrl);
                    }
                } catch {
                    setFotoPerfil("");
                } finally {
                    setFotoCarregada(true);
                }
            };

            if (usuario.id) {
                obterFotoPerfil();
            }
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
        }
    };

    const enviarFotoPerfil = async (foto: File | string) => {
        setUploading(true);
        try {
            const updateResponse = await perfilFotoService.enviarFotoService(foto);

            if (updateResponse !== null && updateResponse !== undefined) {
                setFotoPerfil(perfilFotoService.getFoto() || '');
                setFotoSelecionada(null);
                setUploading(false);
                stopCamera();
                setCapturedImage(null);
                setErroUpload(null);
            } else {
                setErroUpload('Erro ao salvar a foto no perfil.');
                setUploading(false);
            }
        } catch {
            setErroUpload("Houve um erro ao enviar sua foto de perfil. Tente novamente mais tarde.");
            setUploading(false);
        }
    };


    const stopCamera = async () => {
        if (stream && typeof stream.getTracks === 'function') {
            const tracks = stream.getTracks();
            await Promise.all(tracks.map(track => new Promise<void>((resolve) => {
                track.stop();
                resolve();
            })));
            setStream(null);
        }
    };

    const startCamera = async () => {
        try {
            const userMedia = await navigator.mediaDevices.getUserMedia({ video: true });
            setStream(userMedia);
            if (videoRef.current) {
                videoRef.current.srcObject = userMedia;
            }
        } catch {
            //console.error('Erro ao acessar a câmera', error);
        }
    };

    const captureImage = () => {
        if (canvasRef.current && videoRef.current) {
            const context = canvasRef.current.getContext("2d");
            if (context) {
                context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
                const imageData = canvasRef.current.toDataURL('image/png');
                setCapturedImage(imageData);
            }
        }
    };

    const handleUploadClick = () => {
        if (uploadFotoRef.current) {
            uploadFotoRef.current.click();
        }
    };

    const handleRemoveFoto = async () => {
        if (await perfilFotoService.deleteFoto()) setFotoPerfil("");

    };

    const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !(modalRef.current as HTMLElement).contains(event.target as Node)) {
            setShowCameraModal(false);
            stopCamera();
        }
    };

    const handleKeyDown = (event: KeyboardEvent): void => {
        if (event.key === 'Escape') {
            setShowCameraModal(false);
            stopCamera();
        }
    };

    useEffect(() => {
        if (showCameraModal) {
            startCamera();

            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleKeyDown);
        } else {
            stopCamera();
        }

        return () => {
            stopCamera();
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [showCameraModal]);


    const toggleMostrarPedido = () => setMostrarPedido(!mostrarPedido);



    useEffect(() => {
        if (mostrarPedido) {
            const obterPedido = async () => {

                const response = await userService.obterHistoricoPedidoService()
                if (response) {
                    setHistoricoPedidos(response.data);
                }
            }
            obterPedido()
        }
    }, [mostrarPedido])
    return (
        <main className="perfil-container">
            {showCameraModal && (
                <div className="camera-modal-overlay" ref={modalRef}>
                    <div className="camera-modal-content">
                        <h3>Pré visualização da imagem</h3>
                        <video ref={videoRef} autoPlay width="100%" height="auto" className="camera-video" />
                        <canvas ref={canvasRef} style={{ display: 'none' }} width="640" height="480" />
                        <div className="upload-container-modal">
                            <button className="camera-button" onClick={captureImage}>
                                <PhotoCamera /> Capturar
                            </button>
                        </div>
                        {capturedImage && (
                            <>
                                <h3>Imagem a ser salva</h3>
                                <div className="upload-container-modal">
                                    <img src={capturedImage} alt="Imagem Capturada" className="captured-image" />
                                    <button
                                        className="close-modal"
                                        onClick={() => {
                                            setShowCameraModal(false);
                                            if (capturedImage) enviarFotoPerfil(capturedImage);
                                        }}
                                    >
                                        <UploadFile /> Salvar
                                    </button>
                                </div>
                            </>
                        )}
                        <button className="close-button" onClick={() => setShowCameraModal(false)}>
                            Fechar
                        </button>
                    </div>
                </div>
            )}
            {mudarSenha ? (
                <MudarSenha />
            ) : mudarEndereco ? (
                <NovoEndereco />

            ) : (
                <section className="registro-formulario">
                    <h2>Perfil do Usuário</h2>

                    <div className="foto-perfil-container">
                        {fotoCarregada ? (
                            fotoPerfil ? (
                                <>
                                    <img src={fotoPerfil} alt="Foto de Perfil" className="foto-perfil" />
                                    <button className="remove-button" onClick={handleRemoveFoto}>
                                        <Delete /><h3>Remover</h3>
                                    </button>
                                </>
                            ) : (
                                <div className="no-profile-msg">
                                    <AccountCircle fontSize="large" />
                                    <p>Você ainda não tem uma foto de perfil. <span>Adicione uma foto clicando na câmera</span></p>
                                </div>
                            )
                        ) : (
                            <CircularProgress />
                        )}

                        {!fotoPerfil && !uploading && fotoCarregada && (
                            <div className="upload-container">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFotoUpload}
                                    ref={uploadFotoRef}
                                    hidden
                                />
                                <button className="upload-button" onClick={handleUploadClick}>
                                    <UploadFile /> <span className="icon-camera">Procurar</span>
                                </button>
                                <button
                                    className="camera-button"
                                    onClick={() => {
                                        setShowCameraModal(true);
                                        startCamera();
                                    }}
                                >
                                    <PhotoCamera /><span className="icon-camera">Iniciar</span>
                                </button>
                            </div>
                        )}
                        {fotoSelecionada && !uploading && (
                            <div>
                                <button
                                    className="upload-button"
                                    onClick={() =>
                                        fotoSelecionada && enviarFotoPerfil(fotoSelecionada)
                                    }
                                >
                                    <Send /> <span className='icon-camera'>Enviar</span>
                                </button>
                            </div>
                        )}
                        {uploading && (
                            <div className="enviando-msg">
                                <CircularProgress />
                                <p>Enviando...</p>
                            </div>
                        )}
                        {erroUpload && (
                            <div className="erro-upload">
                                <Error />
                                <p>{erroUpload}</p>
                            </div>
                        )}
                    </div>
                    <div className="user-info">
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
                    </div>

                    <div className="container-btns">
                        <div className="formulario-grupo">
                            <Link to={caminhoSenha}>
                                <button id="botao2" onClick={() => setMudarSenha(true)}>
                                    Mudar Senha
                                </button>
                            </Link>
                        </div>
                        <div className="formulario-grupo">
                            <Link to={caminhoEndereco}>
                                <button id="botao1" onClick={() => setMudarEndereco(true)}>Mudar Endereço</button>
                            </Link>
                        </div>
                    </div>

                    {!usuario.perfil.includes("ADMIN") && (
                        <div>
                            <h3>Histórico de Pedidos</h3>
                            <div id="historico-pedidos">
                                <ul>
                                    {!mostrarPedido ? (
                                        <button onClick={toggleMostrarPedido}>Mostrar Pedido</button>
                                    ) : (
                                        <PedidoUsuario
                                            historicoPedidos={historicoPedidos.map(pedido => ({
                                                ...pedido,
                                                numeroPedido: pedido.numeroPedido
                                            }))}
                                        />
                                    )}
                                </ul>
                            </div>
                        </div>
                    )}

                </section>
            )}
        </main>
    );
};

export { Perfil };