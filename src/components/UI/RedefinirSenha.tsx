import React, { useState } from "react";
import { LockOutlined } from "@mui/icons-material";
import * as userServices from '../../services/UserServices';
import Alert from "./Alert";
import { PasswordVisibility, IPasswordVisibilityState, useHandleOnChange, useHandleOnChangeAutenticado } from "../../utils/funcoes";
import { Carregando } from "./Carregando";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

interface RedefinirSenhaProps {
  isSubmitted?: boolean;
  isToken?: boolean;
}

const RedefinirSenha: React.FC<RedefinirSenhaProps> = ({ isSubmitted, isToken }) => {
  const [alertData, setAlertData] = useState<{ title: string; text: string; icon: "success" | "error" | "warning" | "info" } | null>(null);
  const { redefinicaoSenha, handleOnChange } = useHandleOnChange({ email: "", cpf: "" });
  const [voltar, setVoltar] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { alterarSenhaAutenticado, handleOnChangeAutenticado } = useHandleOnChangeAutenticado({ senhaAntiga: "", novaSenha: "" });

  const [isPasswordVisible, setIsPasswordVisible] = useState<IPasswordVisibilityState>({
    senhaAntiga: false,
    novaSenha: false,
  });

  const [isCpfVisible, setIsCpfVisible] = useState(false);

  const CpfVisibility = () => {
    setIsCpfVisible(prevState => !prevState);
  };

  const onSubmitReset = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isToken) {
      setLoading(true);
      const { senhaAntiga, novaSenha } = alterarSenhaAutenticado;
      const response = await userServices.alterarSenhaAutenticado(senhaAntiga, novaSenha);
      if (response && response.data) {
        setAlertData({
          title: "Recuperação Bem Sucedida",
          text: ` ${response.data}`,
          icon: "success"
        });
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
      setLoading(false);
    }
    else if (!isToken) {
      const { email, cpf } = redefinicaoSenha;

      if (!cpf || cpf.length < 11) {
        setAlertData({
          title: "Erro",
          text: "CPF não fornecido ou inválido.",
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

      const novoEmail = dominioPublico ? email.toString().toLowerCase() : "";

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
          text: ` ${result.data}`,
          icon: "success"
        });
        setVoltar(true);
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
    } else {
      return;
    }
  };

  return (
    <div className="alex-login-form-container">
      {loading ? (
        <Carregando title="Aguarde, Atualizando sua Senha..." />
      ) : (
        <form className="alex-card alex-form" onSubmit={onSubmitReset}>
          <LockOutlined sx={{ fontSize: "24px", color: "#007bff" }} />
          <h2>Redefinir Senha</h2>
          <div className="alex-form-controls-container">
            {isToken ? (
              <>
                <div className="input-container">
                  <input
                    name="senhaAntiga"
                    value={alterarSenhaAutenticado.senhaAntiga}
                    onChange={handleOnChangeAutenticado}
                    className={`alex-form-control ${isSubmitted && !alterarSenhaAutenticado.senhaAntiga ? "alex-input-error" : ""}`}
                    type={isPasswordVisible.senhaAntiga ? "text" : "password"}
                    placeholder="Digite Senha Antiga"
                    required
                  />
                  <span className="password-icon" onClick={() => PasswordVisibility('senhaAntiga', setIsPasswordVisible)}>
                    {isPasswordVisible.senhaAntiga ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </span>
                  {isSubmitted && !alterarSenhaAutenticado.senhaAntiga && (
                    <div className="alex-form-error">Campo obrigatório</div>
                  )}
                </div>

                <div className="input-container">
                  <input
                    name="novaSenha"
                    value={alterarSenhaAutenticado.novaSenha}
                    onChange={handleOnChangeAutenticado}
                    className={`alex-form-control ${isSubmitted && !alterarSenhaAutenticado.novaSenha ? "alex-input-error" : ""}`}
                    type={isPasswordVisible.novaSenha ? "text" : "password"}
                    placeholder="Digite Nova Senha"
                    required
                  />
                  <span className="password-icon" onClick={() => PasswordVisibility('novaSenha', setIsPasswordVisible)}>
                    {isPasswordVisible.novaSenha ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </span>
                  {isSubmitted && !alterarSenhaAutenticado.novaSenha && (
                    <div className="alex-form-error">Campo obrigatório</div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div>
                  <input
                    name="email"
                    value={redefinicaoSenha.email}
                    onChange={handleOnChange}
                    className={`alex-form-control ${isSubmitted && !redefinicaoSenha.email ? "alex-input-error" : ""}`}
                    type="email"
                    placeholder="Digite seu Email"
                    required
                  />
                  {isSubmitted && !redefinicaoSenha.email && (
                    <div className="alex-form-error">Campo obrigatório</div>
                  )}
                </div>
                <div className="input-container">
                  <input
                    name="cpf"
                    value={redefinicaoSenha.cpf}
                    onChange={handleOnChange}
                    className={`alex-form-control ${isSubmitted && !redefinicaoSenha.cpf ? "alex-input-error" : ""}`}
                    type={isCpfVisible ? "text" : "password"}
                    placeholder="Digite seu CPF"
                    required
                  />
                  <span className="password-icon" onClick={CpfVisibility}>
                    {isCpfVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </span>
                  {isSubmitted && !redefinicaoSenha.cpf && (
                    <div className="alex-form-error">Campo obrigatório</div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="alex-login-form-buttons alex-mt20">
            {!voltar ? (
              <button type="submit" className="alex-btn alex-btn-blue" disabled={loading}>
                Enviar
              </button>
            ) : (
              <button
                type="button"
                className="alex-btn alex-btn-blue"
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
