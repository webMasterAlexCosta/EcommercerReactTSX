import React from "react";

interface LoginFormProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  formData: { email: string; senha: string };
  isSubmitted: boolean;
  loading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, onChange, formData, isSubmitted, loading }) => {
  return (
    <div className="dsc-login-form-container">
      <form className="dsc-card dsc-form" onSubmit={onSubmit}>
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
          <div>
            <input
              name="senha"
              value={formData.senha}
              onChange={onChange}
              className={`dsc-form-control ${isSubmitted && !formData.senha ? "dsc-input-error" : ""}`}
              type="password"
              placeholder="Senha"
            />
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
      </form>
    </div>
  );
};

export default LoginForm;
