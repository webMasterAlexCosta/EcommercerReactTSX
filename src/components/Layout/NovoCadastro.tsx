import { useState } from "react";
import axios, { AxiosResponse } from "axios";
import Alert from "../UI/Alert";
import { Carregando } from "../UI/Carregando";
import { PersonAdd, LockOutlined, PersonOutline, MailOutline, Phone, CalendarToday, Description, Home, LocationCity, Public } from "@mui/icons-material";
import { CadastroUserDTO } from "../../models/dto/CadastroUserDTO";
import * as userServices from "../../services/UserServices"

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
        setLoading(true);

        try {
            // Atrasar a busca em 1 segundo
            const response: AxiosResponse<ViaCepResponse> = await new Promise((resolve) =>
                setTimeout(() => resolve(axios.get(`https://viacep.com.br/ws/${cep}/json/`)), 2000)
            );

            // Verifique se a resposta contém erro
            if (response.data.erro) {
                setAlertData({
                    title: "Erro",
                    text: "CEP não encontrado.",
                    icon: "error"
                });
            } else {
                // Atualizar o estado com os dados recebidos
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
        }
    }
};


const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "telefone" || name === "cpf") {
        const numericValue = value.replace(/\D/g, '').replace(/^0+/, '').replace('e', ''); 

        // Permitir apenas até 11 dígitos
        if (numericValue.length <= 11) {
            setFormData((prevState) => ({
                ...prevState,
                [name]: numericValue
            }));
        }
    } else if (name === "cep") {
        const numericCep = value.replace(/\D/g, '')

        if (numericCep.length <= 8) {
            setFormData((prevState) => ({
                ...prevState,
                endereco: {
                    ...prevState.endereco,
                    cep: numericCep
                }
            }));
        }

        if (numericCep.length === 8) {
            buscarEnderecoPorCep(numericCep);
        }
    } else {
      
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    }
};

    
    

    const handleEnderecoChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        const { value } = e.target;

        // Permitir digitar até 11 dígitos ou apagar os dígitos
        if (field === "numero" && (value.length <= 11 || value.length < formData.endereco.numero.length)) {
            setFormData((prevState) => ({
                ...prevState,
                endereco: {
                    ...prevState.endereco,
                    [field]: value
                }
            }));
            
        }else{
            setFormData((prevState) => ({
                ...prevState,
                endereco: {
                    ...prevState.endereco,
                    [field]: value
                }
            }));
        }
    };


    const handleCadastroSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);
        try {
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
        } catch (error) {
            console.log(error)
            setAlertData({
                title: "Erro",
                text: "Erro ao enviar o cadastro.",
                icon: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dsc-login-form-container">
            {loading ? (
                <Carregando title="Aguarde, estamos processando sua solicitação..." />
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
                                value={formData.telefone}
                                onChange={handleChange}
                                placeholder="Digite seu Telefone"
                                required
                                min={0}
                                max={11} 
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

                        <div>
                            <label htmlFor="senha">
                                <LockOutlined sx={{ fontSize: "20px", marginRight: "8px" }} />
                                Senha
                            </label>
                            <input
                                name="senha"
                                className={`dsc-form-control ${isSubmitted ? "dsc-input-error" : ""}`}
                                type="password"
                                value={formData.senha}
                                onChange={handleChange}
                                placeholder="Digite sua Senha"
                                required
                            />
                            {isSubmitted && (
                                <div className="dsc-form-error">Campo obrigatório</div>
                            )}
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
