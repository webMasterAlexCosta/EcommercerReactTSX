import { Send, LocationOn, Apartment, Public, Place, LocationCity, Streetview, Close } from '@mui/icons-material';
import { useEffect, useState } from "react";
import { FormularioUser } from "../UI/Formulario";
import { Endereco } from "../../models/dto/CredenciaisDTO";
import * as authService from "../../services/AuthService";
import * as userService from "../../services/UserServices";
import { useNavigate } from "react-router-dom";
import { ViaCepService } from '../../utils/funcoes';
import { TEXTO_PADRAO_SOLICITACAO } from '../../utils/system';
import { Carregando } from '../UI/Carregando';
import { Alert, IconButton } from '@mui/material';
import * as userServices from "../../services/UserServices";

const NovoEndereco = () => {
    const [enderecoUsuario, setEnderecoUsuario] = useState<Endereco>({
        cep: '',
        logradouro: '',
        numero: 0,
        complemento: '',
        bairro: '',
        cidade: '',
        uf: ''
    });

    const [alertData, setAlertData] = useState<{
        title: string;
        text: string;
        icon: "success" | "error" | "warning" | "info";
    } | null>(null);

    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const [textoCarregando, setTextoCarregando] = useState(TEXTO_PADRAO_SOLICITACAO);

    useEffect(() => {
        const verificar = async () => {
            if (!(await userService.getTokenService() && authService.isAuthenticated())) {
                navigate("/login");
                throw new Error();
            }
        };
        verificar();
    }, [navigate]);

    const buscarEnderecoPorCep = async (cep: string) => {
        if (cep.length === 8) {
            setTextoCarregando("Aguarde, buscando seu CEP...");
            setLoading(true);

            try {
                const response = await ViaCepService(cep);

                if (!response || response.data.erro) {
                    setAlertData({
                        title: "Erro",
                        text: "CEP não encontrado.",
                        icon: "error"
                    });
                } else {
                    setAlertData(null); // Limpar qualquer alerta anterior
                    setEnderecoUsuario({
                        ...enderecoUsuario,
                        cep: response.data.cep || '',
                        logradouro: response.data.logradouro,
                        bairro: response.data.bairro,
                        cidade: response.data.localidade,
                        uf: response.data.uf
                    });
                }
            } catch {
                setAlertData({
                    title: "Erro",
                    text: "Não foi possível buscar o CEP.",
                    icon: "error"
                });
            } finally {
                setLoading(false);
                setTextoCarregando(TEXTO_PADRAO_SOLICITACAO);
            }
        }
    };

    const handleOnchangeFormulario = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'cep') {
            const cepFormatado = value.replace(/\D/g, '');
            if (cepFormatado.length <= 8) {
                setEnderecoUsuario({
                    ...enderecoUsuario,
                    [name]: cepFormatado
                });
                if (cepFormatado.length === 8) {
                    buscarEnderecoPorCep(cepFormatado);
                }
            }
        } else {
            setEnderecoUsuario({
                ...enderecoUsuario,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const cepFormatado = enderecoUsuario.cep.replace(/\D/g, '');
        if (cepFormatado.length !== 8) {
            setAlertData({
                title: "Erro",
                text: "O CEP deve conter 8 dígitos.",
                icon: "error"
            });
            setLoading(false);
            return;
        }

        const payload = await authService.getAccessTokenPayload();
        const id = payload?.sub || null;
        
        // Envia os dados para alterar o endereço
        const enviar = await userServices.mudarEnderecoUserAutenticado({
            ...enderecoUsuario,
            cep: cepFormatado
        }, id!);

        // Alerta de sucesso após a operação
        setAlertData({
            title: "Cadastro realizado com sucesso!",
            text: `${enviar}`,
            icon: "success"
        });

        // Recarrega a página após 4 segundos
        setTimeout(() => {
            userService.setUserService();
            sessionStorage.clear()
            window.location.reload();
        }, 4000);

        setLoading(false);
    };

    return (
        <main>
            <form onSubmit={handleSubmit} className="registro-formulario">
                {loading ? (
                    <Carregando title={textoCarregando} />
                ) : (
                    <>
                        <h1>Novo Endereço</h1>

                        <FormularioUser
                            className="formulario-grupo"
                            label="CEP"
                            htmlFor="cep"
                            name="cep"
                            type="text"
                            id="cep"
                            value={enderecoUsuario?.cep}
                            icon={<LocationOn />}
                            onChange={handleOnchangeFormulario}
                            minLength={0}
                            maxLength={8}
                            required={true}
                        />

                        {alertData && alertData.icon === "error" && (
                           <Alert
                           severity={alertData.icon}
                           sx={{
                               width: '400px',
                               height: '80px',
                               fontSize: '24px',
                               fontWeight: 'bold',
                               position: 'fixed',
                               top: '95%',
                               left: '50%',
                               transform: 'translate(-50%, -50%)',
                               zIndex: 1300,
                               color: 'blue',
                               '& .MuiAlert-message': {
                                   color: 'green',
                               },
                               
                           }}
                           action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="large"
                                onClick={()=>  setAlertData(null)} 
                            >
                                <Close />
                            </IconButton>
                        }
                    >
                           
                       
                           {alertData.text}
                       </Alert>
                        )}

                        {alertData && alertData.icon === "success" && (
                            <Alert
                            severity={alertData.icon}                        
                            sx={{
                                width: '400px',
                                height: '100px',
                                fontSize: '24px',
                                fontWeight: 'bold',
                                position: 'fixed',
                                top: '85%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                zIndex: 1300,
                                color: 'blue',
                                '& .MuiAlert-message': {
                                    color: 'green',
                                },
                            }}
                            action={
                                <IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="large"
                                    onClick={()=>  setAlertData(null)} 
                                >
                                    <Close />
                                </IconButton>
                            }
                        
                        >
                            {alertData.title="Sucesso ao cadastrar seu endereco novo"}
                        </Alert>
                        )}

                        <FormularioUser
                            className="formulario-grupo"
                            label="Logradouro"
                            htmlFor="logradouro"
                            name="logradouro"
                            type="text"
                            id="logradouro"
                            value={enderecoUsuario?.logradouro || ''}
                            icon={<Streetview />}
                            onChange={handleOnchangeFormulario}
                            required={true}
                        />

                        <FormularioUser
                            className="formulario-grupo"
                            label="Número"
                            htmlFor="numero"
                            name="numero"
                            type="text"
                            id="numero"
                            value={enderecoUsuario?.numero || ''}
                            icon={<Apartment />}
                            onChange={handleOnchangeFormulario}
                            required={true}
                        />

                        <FormularioUser
                            className="formulario-grupo"
                            label="Complemento"
                            htmlFor="complemento"
                            name="complemento"
                            type="text"
                            id="complemento"
                            value={enderecoUsuario?.complemento || ''}
                            icon={<Public />}
                            onChange={handleOnchangeFormulario}
                            required={true}
                        />

                        <FormularioUser
                            className="formulario-grupo"
                            label="Bairro"
                            htmlFor="bairro"
                            name="bairro"
                            type="text"
                            id="bairro"
                            value={enderecoUsuario?.bairro || ''}
                            icon={<Place />}
                            onChange={handleOnchangeFormulario}
                            required={true}
                        />

                        <FormularioUser
                            className="formulario-grupo"
                            label="Cidade"
                            htmlFor="cidade"
                            name="cidade"
                            type="text"
                            id="cidade"
                            value={enderecoUsuario?.cidade || ''}
                            icon={<LocationCity />}
                            onChange={handleOnchangeFormulario}
                            required={true}
                        />

                        <FormularioUser
                            className="formulario-grupo"
                            label="Estado"
                            htmlFor="uf"
                            name="uf"
                            type="text"
                            id="uf"
                            value={enderecoUsuario?.uf || ''}
                            icon={<Place />}
                            onChange={handleOnchangeFormulario}
                            maxLength={2}
                            required={true}
                        />

                        <div className="submit-container">
                            <button type="submit" className="submit-button" disabled={loading}>
                                <Send style={{ marginRight: 8 }} /> Enviar
                            </button>
                        </div>
                    </>
                )}
            </form>
        </main>
    );
};

export { NovoEndereco };
