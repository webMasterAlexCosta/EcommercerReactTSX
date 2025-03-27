import { useEffect, useState, useRef } from 'react';
import './styles.css';
import * as authService from '../../../services/AuthService';
import requestBackEnd from '../../../utils/request';
import { AxiosRequestConfig } from 'axios';
import { API_IMGBB, HISTORICO_PEDIDO_USER } from '../../../utils/system';
import { PedidoHistorico } from '../../../models/dto/CarrinhoDTO';
import { Link, useNavigate } from 'react-router-dom';
import { MudarSenha } from '../../../components/Layout/MudarSenha';
import { FormularioUser } from '../../../components/UI/Formulario';
import { EnderecoDTO, UserDTO } from '../../../models/dto/UserDTO';
import { PhotoCamera, UploadFile, Delete, Send, AccountCircle, Error } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import { NovoEndereco } from '../../../components/Layout/NovoEndereco';
import * as userService from "../../../services/UserServices"
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
    const [fotoCarregada, setFotoCarregada] = useState<boolean>(false); // Novo estado para indicar se a foto foi carregada

    

    useEffect(() => {

        if (!(userService.getTokenService() && authService.isAuthenticated())) {
            navigate("/login")
            throw Error;
        }

        const obterUsuario = async () => {
            const idUserToken = authService.getAccessTokenPayload()?.sub;
            if (authService.isAuthenticated()) {
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
            } catch {
              //  console.error('Erro ao obter histórico de pedidos', error);
            }
        };

        obterUsuario();
        obterHistoricoPedido();
    }, [navigate]);

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
                setFotoPerfil(response.data.fotoPerfil);
            } catch {
                setFotoPerfil(""); 
            } finally {
                setFotoCarregada(true); 
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
        }
    };



    const enviarFotoPerfil = async (foto: File | string) => {
        setUploading(true);
    
        const formData = new FormData();
    
        // Se for uma string (Data URL), convertemos para Blob
        if (typeof foto === 'string') {
            const blob = dataURLtoBlob(foto);
            formData.append('image', blob);
        } else {
            formData.append('image', foto);
        }
    
        try {
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${API_IMGBB}`, {
                method: 'POST',
                body: formData,
            });
    
            const data = await response.json();
    
            if (data.success) {
                const urlFoto = data.data.url;
                userService.saveFoto(urlFoto);
    
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
                    setFotoPerfil(userService.getFoto() || '');
                    setFotoSelecionada(null);
                    setUploading(false);
                    stopCamera();
                    setCapturedImage(null);
                    setErroUpload(null);
                } else {
                    setErroUpload('Erro ao salvar a foto no perfil.');
                    setUploading(false);
                }
            } else {
                setErroUpload('Erro ao enviar a foto de perfil.');
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
        } catch  {
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

    const dataURLtoBlob = (dataURL: string) => {
        const [meta, base64] = dataURL.split(',');
        const byteString = atob(base64);
        const mimeString = meta.split(';')[0].split(':')[1];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
    };

    const handleUploadClick = () => {
        if (uploadFotoRef.current) {
            uploadFotoRef.current.click();
        }
    };

    const handleRemoveFoto = async () => {
        if (!usuario.id) return;
    
            const response = await requestBackEnd({
                method: 'DELETE',
                url: `/api/usuarios/${usuario.id}/foto`,
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });

            if (response.status === 200) {
                userService.deleteFoto();
                setFotoPerfil('');
            } 
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
                            <Link to="/perfil/MudarSenha">
                                <button id="botao2" onClick={() => setMudarSenha(true)}>
                                    Mudar Senha
                                </button>
                            </Link>
                        </div>
                        <div className="formulario-grupo">
                            <Link to="/perfil/NovoEndereco">
                                <button id="botao1" onClick={() => setMudarEndereco(true)}>Mudar Endereço</button>
                            </Link>
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