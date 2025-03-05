import { useContext, useState } from "react";
import { loginRequest } from "../../services/CredenciasiService";
import "./styles.css";
import { CredenciaisDTO } from "../../models/dto/CredenciaisDTO";
import { TOKEN_KEY } from "../../utils/system";
import { useNavigate } from "react-router-dom";
import ContextIsLogin from "../../data/LoginContext";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CredenciaisDTO>({
    email: "",
    senha: ""
  });
  const {setContextIsLogin} = useContext(ContextIsLogin)

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmitLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true); // Marca que o formulário foi enviado

    // Verifica se os campos estão vazios
    if (formData.email && formData.senha) {
      try {
        const enviar = await loginRequest(formData);
        console.log(enviar.data.token);
        localStorage.setItem(TOKEN_KEY, enviar.data.token);
        setContextIsLogin(true)
        navigate("/catalogo")
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : "erro desconhecido");
      }
    }
  };

  return (
    <section id="login-section" className="dsc-container">
      <div className="dsc-login-form-container">
        <form className="dsc-card dsc-form" onSubmit={handleSubmitLogin}>
          <h2>Login</h2>
          <div className="dsc-form-controls-container">
            <div>
              <input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
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
                onChange={handleInputChange}
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
            <button type="submit" className="dsc-btn dsc-btn-blue">
              Entrar
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
