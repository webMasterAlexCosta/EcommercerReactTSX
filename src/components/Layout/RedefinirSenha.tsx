import React, { useState } from "react";
import { LockOutlined } from "@mui/icons-material";
import * as userServices from '../../services/UserServices';
import Alert from "../UI/Alert";
import { useHandleOnChange } from "../../utils/funcoes";
import { Carregando } from "../UI/Carregando";
import { useNavigate } from "react-router-dom";


interface RedefinirSenhaProps {
  isSubmitted: boolean;
}

const RedefinirSenha: React.FC<RedefinirSenhaProps> = ({ isSubmitted }) => {

  const [alertData, setAlertData] = useState<{ title: string; text: string; icon: "success" | "error" | "warning" | "info" } | null>(null);
  const { estado, handleOnChange } = useHandleOnChange({ email: "", cpf: "" });
  const [voltar, setVoltar] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate()
  const onSubmitReset = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { email, cpf } = estado;

  
    if (!cpf || cpf.length<11) {
      setAlertData({
        title: "Erro",
        text: "CPF não fornecido.",
        icon: "error"
      });
      return;
    }

    const dominioPublico =
      email.includes("@gmail.com") ||
      email.includes("@yahoo.com") ||
      email.includes("@hotmail.com") ||
      email.includes("@outlook.com") ||
      email.includes("@icloud.com") ||
      email.includes("@aol.com") ||
      email.includes("@zoho.com") ||
      email.includes("@protonmail.com") ||
      email.includes("@oi.com") ||
      email.includes("@yahoo.com.br");

    const novoEmail = dominioPublico ? email : "";

    if (novoEmail === "") {
      setAlertData({
        title: "Erro",
        text: "Email inválido. Por favor, somente email público é aceito.",
        icon: "error"
      });
      return;
    }

   
    setLoading(true);

    try {
      const result = await userServices.recuperarSenha(novoEmail, cpf);
      setAlertData({
        title: "Recuperação Bem Sucedida",
        text: `A senha foi enviada para o email: ${result.data}`,
        icon: "success"
      });
      setVoltar(true)


    } catch (error) {
      console.error(error);
      setAlertData({
        title: "Recuperação Mal Sucedida",
        text: `Falha ao tentar recuperar a senha. Usuário não encontrado.`,
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
        <form className="dsc-card dsc-form" onSubmit={onSubmitReset}>
          <LockOutlined sx={{ fontSize: "24px", color: "#007bff" }} />
          <h2>Redefinir Senha</h2>
          <div className="dsc-form-controls-container">
            <div>
              <input
                name="email"
                value={estado.email}
                onChange={handleOnChange}
                className={`dsc-form-control ${isSubmitted && !estado.email ? "dsc-input-error" : ""}`}
                type="email"
                placeholder="Digite seu Email"
                required
              />
              {isSubmitted && !estado.email && (
                <div className="dsc-form-error">Campo obrigatório</div>
              )}
            </div>
            <div>
              <input
                name="cpf"
                value={estado.cpf}
                onChange={handleOnChange}
                className={`dsc-form-control ${isSubmitted && !estado.cpf ? "dsc-input-error" : ""}`}
                type="text"
                placeholder="Digite seu CPF"
                required
              />
              {isSubmitted && !estado.cpf && (
                <div className="dsc-form-error">Campo obrigatório</div>
              )}
            </div>
          </div>

          <div className="dsc-login-form-buttons dsc-mt20">
            {!voltar ? <button type="submit" className="dsc-btn dsc-btn-blue" disabled={loading}>
              Enviar
            </button>
              : (
                <button
                  type="button"
                  className="dsc-btn dsc-btn-blue"
                  disabled={loading}
                  onClick={() => navigate(0)} 
                >
                  Voltar
                </button>
              )}
          </div>
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

export default RedefinirSenha;
