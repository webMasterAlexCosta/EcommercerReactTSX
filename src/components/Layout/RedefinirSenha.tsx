import React, { useState } from "react";
import { LockOutlined } from "@mui/icons-material";
import * as CredenciaisService from '../../services/CredenciasiService';
import Alert from "../UI/Alert";
import { useHandleOnChange } from "../../utils/funcoes";

interface RedefinirSenhaProps {
  isSubmitted: boolean;
  loading: boolean;
}

const RedefinirSenha: React.FC<RedefinirSenhaProps> = ({ isSubmitted, loading }) => {
  const [alertData, setAlertData] = useState<{ title: string; text: string; icon: "success" | "error" | "warning" | "info" } | null>(null);

  // Usando o hook useHandleOnChange e inicializando com o estado vazio
  const { estado, handleOnChange } = useHandleOnChange({ email: "", cpf: "" });

  const onSubmitReset = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { email, cpf } = estado;

    // Verifique se o cpf não é vazio ou undefined
    if (!cpf) {
      console.error("CPF não fornecido");
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
        text: "Email inválido. Por favor, use um email válido.",
        icon: "error"
      });
      return;
    }

    try {
      const result = (await CredenciaisService.recuperarSenha(novoEmail, cpf));
      setAlertData({
        title: "Recuperação Bem Sucedida",
        text: `A senha foi enviada para o email: ${result.data}`,
        icon: "success"
      });
    } catch (error) {
      console.error(error);
      
      setAlertData({
        title: "Recuperação Mal Sucedida",
        text: `Falha ao tentar recuperar a senhaa. Usuário nao encontrado.`,
        icon: "error"
      });
    }
  };

  return (
    <div className="dsc-login-form-container">
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
              type="text"
              placeholder="Digite seu Email"
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
            />
            {isSubmitted && !estado.cpf && (
              <div className="dsc-form-error">Campo obrigatório</div>
            )}
          </div>
        </div>

        <div className="dsc-login-form-buttons dsc-mt20">
          <button type="submit" className="dsc-btn dsc-btn-blue" disabled={loading}>
            Enviar
          </button>
        </div>
      </form>

      {/* Renderizando o alerta com base no estado alertData */}
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
