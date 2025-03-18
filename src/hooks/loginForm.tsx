import React, { useState } from "react";
import LockResetIcon from '@mui/icons-material/LockReset';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { LoginSharp } from "@mui/icons-material";
import RedefinirSenha from "../components/UI/RedefinirSenha";
import { NovoCadastro } from "../components/Layout/NovoCadastro";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { IPasswordVisibilityState, PasswordVisibility } from "../utils/funcoes";

interface LoginFormProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  formData: { email: string; senha?: string };
  isSubmitted: boolean;
  loading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, onChange, formData, isSubmitted, loading }) => {
  const [resetSenha, setResetSenha] = useState<boolean>(false);
  const [cadastro, setCadastro] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<IPasswordVisibilityState>({ senha: false })

  return (
    <div className="dsc-login-form-container">
      {!resetSenha && !cadastro
        ?
        (
          <form className="dsc-card dsc-form" onSubmit={onSubmit}>
            <LoginSharp sx={{ fontSize: "24px", color: "#007bff" }} />

            <h2>Login</h2>
            <div className="dsc-form-controls-container">
              <div>
                <input
                  name="email"
                  value={formData.email}
                  onChange={onChange}
                  className={`dsc-form-control ${isSubmitted && !formData.email ? "dsc-input-error" : ""}`}
                  type="text"
                  placeholder="Email"
                />
                {isSubmitted && !formData.email && (
                  <div className="dsc-form-error">Campo obrigatório</div>
                )}
              </div>
              <div className="input-container">
                <input
                  name="senha"
                  value={formData.senha}
                  onChange={onChange}
                  className={`dsc-form-control ${isSubmitted && !formData.senha ? "dsc-input-error" : ""}`}
                  type={isPasswordVisible.senha ? "text" : "password"}
                  placeholder="Senha"
                />
                <span className="password-icon" onClick={() => PasswordVisibility('senha', setIsPasswordVisible)}>
                  {isPasswordVisible.senha ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </span>
                {isSubmitted && !formData.senha && (
                  <div className="dsc-form-error">Campo obrigatório</div>
                )}
              </div>
            </div>

            <div className="dsc-login-form-buttons dsc-mt20">
              <button type="submit" className="dsc-btn dsc-btn-blue" disabled={loading}>
                Entrar
              </button>
            </div>
            <div className="suporte-user">
              <span onClick={() => setResetSenha(true)}>
                <LockResetIcon style={{ fontSize: '18px', marginRight: '8px', color: '#3498db' }} />
                Redefinir Senha
              </span>
              <span onClick={() => setCadastro(true)}>
                <PersonAddIcon style={{ fontSize: '18px', marginRight: '8px', color: '#3498db' }} />
                Criar Novo Cadastro
              </span>
            </div>
          </form>
        )
        :
        resetSenha ? (
          <RedefinirSenha
            isSubmitted={isSubmitted}

          />
        ) : cadastro ? (
          <NovoCadastro isSubmitted={isSubmitted} />
        ) : null}
    </div>
  );
};

export default LoginForm;
