import { useState } from "react";
import axios, { AxiosResponse } from "axios";
import Alert from "../UI/Alert";
import { Carregando } from "../UI/Carregando";
import { PersonAdd, LockOutlined, PersonOutline, MailOutline, Phone, CalendarToday, Description, Home, LocationCity, Public } from "@mui/icons-material";
import { CadastroUserDTO } from "../../models/dto/CadastroUserDTO";
import * as userServices from "../../services/UserServices"
import { TEXTO_PADRAO_SOLICITACAO } from "../../utils/system";
import { IPasswordVisibilityState, PasswordVisibility, formatTelefoneParaExibicao, formatTelefoneParaSalvar } from "../../utils/funcoes";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
interface ViaCepResponse {
    erro?: boolean;
    logradouro: string;
    bairro: string;
    localidade: string;
    uf: string;
}

interface NovoCadastroProps {
    isSubmitted: boolean;
}

const NovoCadastro: React.FC<NovoCadastroProps> = ({ isSubmitted }) => {
    const [alertData, setAlertData] = useState<{
        title: string;
        text: string;
        icon: "success" | "error" | "warning" | "info";
    } | null>(null);

    const [loading, setLoading] = useState<boolean>(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState<IPasswordVisibilityState>({ senha: false });
    const [textoCarregando, setTextoCarregando] = useState(TEXTO_PADRAO_SOLICITACAO)
    const [formData, setFormData] = useState<CadastroUserDTO>({
        nome: "",
        email: "",
        telefone: "",
        dataNascimento: "",
        senha: "",
        cpf: "",
        endereco: {
            logradouro: "",
            cep: "",
            numero: "",
            cidade: "",
            bairro: "",
            complemento: "",
            uf: ""
        }
    });



    const buscarEnderecoPorCep = async (cep: string) => {
        if (cep.length === 8) {
            setTextoCarregando("Aguarde, buscado seu CEP")
            setLoading(true);

            try {
                const response: AxiosResponse<ViaCepResponse> = await new Promise((resolve) =>
                    setTimeout(() => resolve(axios.get(`https://viacep.com.br/ws/${cep}/json/`)), 1000)
                );

                if (response.data.erro) {
                    setAlertData({
                        title: "Erro",
                        text: "CEP não encontrado.",
                        icon: "error"
                    });
                } else {
                    setFormData((prevState) => ({
                        ...prevState,
                        endereco: {
                            ...prevState.endereco,
                            logradouro: response.data.logradouro,
                            bairro: response.data.bairro,
                            cidade: response.data.localidade,
                            uf: response.data.uf
                        }
                    }));
                }
            } catch (error) {
                console.log(error);
                setAlertData({
                    title: "Erro",
                    text: "Não foi possível buscar o CEP.",
                    icon: "error"
                });
            } finally {
                setLoading(false);
                setTextoCarregando(TEXTO_PADRAO_SOLICITACAO)
            }
        }
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === "telefone") {
            const formattedTelefone = formatTelefoneParaSalvar(value);
            setFormData((prevState) => ({
                ...prevState,
                [name]: formattedTelefone
            }));
        } else if (name === "cpf" || name === "cep") {
            const numericValue = value.replace(/\D/g, '');
            if (name === "cpf" && numericValue.length <= 11) {
                setFormData((prevState) => ({
                    ...prevState,
                    [name]: numericValue
                }));
            } else if (name === "cep" && numericValue.length <= 8) {
                setFormData((prevState) => ({
                    ...prevState,
                    endereco: {
                        ...prevState.endereco,
                        [name]: numericValue
                    }
                }));
                if (numericValue.length === 8) {
                    buscarEnderecoPorCep(numericValue);
                }
            }
        } else if (name === "email") {
            setFormData((prevState) => ({
                ...prevState,
                [name]: value.toLocaleLowerCase()
            }));
        } else {
            setFormData((prevState) => ({
                ...prevState,
                [name]: value
            }));
        }
    };





    const handleEnderecoChange = (e: React.ChangeEvent<HTMLInputElement>, valor: string) => {
        const { value } = e.target;

        if (valor === "numero" && (value.length <= 11 || value.length < formData.endereco.numero.length)) {
            setFormData((prevState) => ({
                ...prevState,
                endereco: {
                    ...prevState.endereco,
                    [valor]: value
                }
            }));

        } else {
            setFormData((prevState) => ({
                ...prevState,
                endereco: {
                    ...prevState.endereco,
                    [valor]: value
                }
            }));
        }
    };


    const handleCadastroSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);

        const response = await userServices.cadastrarNovoUsuario(formData);


        setAlertData({
            title: "Cadastro realizado com sucesso!",
            text: `Foi enviado link de ativacao para ${response.data.email}`,
            icon: "success"

        });
        setTimeout(() => {
            window.location.reload();
        }
            , 3000);

        setLoading(false);

    };

    return (
        <div className="dsc-login-form-container">
            {loading ? (
                <Carregando title={textoCarregando} />
            ) : (
                <form className="dsc-card dsc-form" onSubmit={handleCadastroSubmit}>
                    <PersonAdd sx={{ fontSize: "24px", color: "#007bff" }} />
                    <h2>Cadastro</h2>
                    <div className="dsc-form-controls-container">
                        {/* Dados Pessoais */}
                        <div>
                            <label htmlFor="nome">
                                <PersonOutline sx={{ fontSize: "20px", marginRight: "8px" }} />
                                Nome
                            </label>
                            <input
                                name="nome"
                                className={`dsc-form-control ${isSubmitted ? "dsc-input-error" : ""}`}
                                type="text"
                                value={formData.nome}
                                onChange={handleChange}
                                placeholder="Digite seu Nome"
                                required
                            />
                            {isSubmitted && (
                                <div className="dsc-form-error">Campo obrigatório</div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email">
                                <MailOutline sx={{ fontSize: "20px", marginRight: "8px" }} />
                                E-mail
                            </label>
                            <input
                                name="email"
                                className={`dsc-form-control ${isSubmitted ? "dsc-input-error" : ""}`}
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Digite seu E-mail"
                                required
                            />
                            {isSubmitted && (
                                <div className="dsc-form-error">Campo obrigatório</div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="telefone">
                                <Phone sx={{ fontSize: "20px", marginRight: "8px" }} />
                                Telefone
                            </label>
                            <input
                                name="telefone"
                                className={`dsc-form-control ${isSubmitted ? "dsc-input-error" : ""}`}
                                type="text"
                                value={formatTelefoneParaExibicao(formData.telefone)} 
                                onChange={handleChange}
                                placeholder="Digite seu Telefone"
                                required
                                maxLength={15} 
                            />

                            {isSubmitted && <div className="dsc-form-error">Campo obrigatório</div>}
                        </div>

                        <div>
                            <label htmlFor="dataNascimento">
                                <CalendarToday sx={{ fontSize: "20px", marginRight: "8px" }} />
                                Data de Nascimento
                            </label>
                            <input
                                name="dataNascimento"
                                className={`dsc-form-control ${isSubmitted ? "dsc-input-error" : ""}`}
                                type="date"
                                value={formData.dataNascimento}
                                onChange={handleChange}
                                required
                            />
                            {isSubmitted && (
                                <div className="dsc-form-error">Campo obrigatório</div>
                            )}
                        </div>

                        <div >
                            <label htmlFor="senha">
                                <LockOutlined sx={{ fontSize: "20px", marginRight: "8px" }} />
                                Senha
                            </label>
                            <div className="input-container">
                                <input
                                    name="senha"
                                    className={`dsc-form-control ${isSubmitted ? "dsc-input-error" : ""}`}
                                    type={isPasswordVisible.senha ? "text" : "password"}
                                    value={formData.senha}
                                    onChange={handleChange}
                                    placeholder="Digite sua Senha"
                                    required
                                />
                                <span className="password-icon" onClick={() => PasswordVisibility('senha', setIsPasswordVisible)}>
                                    {isPasswordVisible.senhaAntiga ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </span>
                                {isSubmitted && (
                                    <div className="dsc-form-error">Campo obrigatório</div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="cpf">
                                <Description sx={{ fontSize: "20px", marginRight: "8px" }} />
                                CPF
                            </label>
                            <input
                                name="cpf"
                                className={`dsc-form-control ${isSubmitted ? "dsc-input-error" : ""}`}
                                type="text"
                                value={formData.cpf}
                                onChange={handleChange}
                                placeholder="Digite seu CPF"
                                required
                            />
                            {isSubmitted && (
                                <div className="dsc-form-error">Campo obrigatório</div>
                            )}
                        </div>


                        <div>
                            <label htmlFor="cep">
                                <Home sx={{ fontSize: "20px", marginRight: "8px" }} />
                                CEP
                            </label>
                            <input
                                name="cep"
                                className={`dsc-form-control ${isSubmitted ? "dsc-input-error" : ""}`}
                                type="text"
                                value={formData.endereco.cep}
                                onChange={handleChange}
                                placeholder="Digite seu CEP"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="numero">
                                <Home sx={{ fontSize: "20px", marginRight: "8px" }} />
                                Número
                            </label>
                            <input
                                name="numero"
                                className={`dsc-form-control ${isSubmitted ? "dsc-input-error" : ""}`}
                                type="number"
                                value={formData.endereco.numero}
                                onChange={(e) => handleEnderecoChange(e, "numero")}
                                placeholder="Digite o Número"
                                required
                                min={0}
                                max={999999999}

                            />
                        </div>
                        <div>
                            <label htmlFor="logradouro">
                                <Home sx={{ fontSize: "20px", marginRight: "8px" }} />
                                Logradouro
                            </label>
                            <input
                                name="logradouro"
                                className={`dsc-form-control ${isSubmitted ? "dsc-input-error" : ""}`}
                                type="text"
                                value={formData.endereco.logradouro}
                                onChange={(e) => handleEnderecoChange(e, "logradouro")}
                                placeholder="Digite seu Logradouro"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="bairro">
                                <Home sx={{ fontSize: "20px", marginRight: "8px" }} />
                                Bairro
                            </label>
                            <input
                                name="bairro"
                                className={`dsc-form-control ${isSubmitted ? "dsc-input-error" : ""}`}
                                type="text"
                                value={formData.endereco.bairro}
                                onChange={(e) => handleEnderecoChange(e, "bairro")}
                                placeholder="Digite seu Bairro"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="cidade">
                                <LocationCity sx={{ fontSize: "20px", marginRight: "8px" }} />
                                Cidade
                            </label>
                            <input
                                name="cidade"
                                className={`dsc-form-control ${isSubmitted ? "dsc-input-error" : ""}`}
                                type="text"
                                value={formData.endereco.cidade}
                                onChange={(e) => handleEnderecoChange(e, "cidade")}
                                placeholder="Digite sua Cidade"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="uf">
                                <Public sx={{ fontSize: "20px", marginRight: "8px" }} />
                                UF
                            </label>
                            <input
                                name="uf"
                                className={`dsc-form-control ${isSubmitted ? "dsc-input-error" : ""}`}
                                type="text"
                                value={formData.endereco.uf}
                                onChange={(e) => handleEnderecoChange(e, "uf")}
                                placeholder="Digite sua UF"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="complemento">
                                <Home sx={{ fontSize: "20px", marginRight: "8px" }} />
                                Complemento
                            </label>
                            <input
                                name="complemento"
                                className={`dsc-form-control ${isSubmitted ? "dsc-input-error" : ""}`}
                                type="text"
                                value={formData.endereco.complemento}
                                onChange={(e) => handleEnderecoChange(e, "complemento")}
                                placeholder="Digite seu Complemento"
                            />
                        </div>
                    </div>
                    <button type="submit" className="dsc-btn dsc-btn-blue" disabled={loading}>
                        Enviar
                    </button>
                </form>
            )}

            {alertData && (
                <Alert
                    title={alertData.title}
                    text={alertData.text}
                    icon={alertData.icon}
                />
            )}
        </div>
    );
};

export { NovoCadastro };
