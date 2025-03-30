import { useContext, useState } from "react";
import { loginRequest } from "../../services/CredenciasiService";
import "./styles.css";
import { CredenciaisDTO, Usuario } from "../../models/dto/CredenciaisDTO";
import { useNavigate } from "react-router-dom";
import ContextIsLogin from "../../data/LoginContext";
import Alert from "../../components/UI/Alert";
import * as userService from "../../services/UserServices";
import LoginForm from "../../hooks/loginForm";
import IconAdminContext from "../../data/IconAdminContext";
import { Carregando } from "../../components/UI/Carregando";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CredenciaisDTO>({
    email: "",
    senha: ""
  });

  const { setContextIsLogin } = useContext(ContextIsLogin);
  const { setIconAdminContext } = useContext(IconAdminContext);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertData, setAlertData] = useState<{ title: string; text: string; icon: "success" | "error" | "warning" | "info"; } | null>(null);
  const [user, setUser] = useState<Usuario | null>(null); 

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmitLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
    setLoading(true);

    if (formData.email && formData.senha) {
      
        const response = await loginRequest(formData);
    
        await userService.saveTokenService(response.data);
       
       const buscarUsuario = await userService.getUserService();
        setUser(buscarUsuario);
        setContextIsLogin(true);

        const userProfile = buscarUsuario?.perfil?.includes("ADMIN") ? "ADMIN" : "CLIENTE";
        setIconAdminContext(userProfile);
     
        setAlertData({
          title: "Login Aceito",
          text: `Usuário ${buscarUsuario?.nome} logado com sucesso`,
          icon: "success"
        });
      
        setLoading(false);
      
    }
  };

  const handleAlertClose = () => {
    if (alertData?.icon === "success") {
      setTimeout(() => {
        if (user?.perfil.includes("ADMIN")) {
          navigate("/Administrativo");
        } else if (user?.perfil.includes("CLIENTE")) {
          navigate("/catalogo");
        } else {
          setAlertData(null);
        }
      }, 1000);
    }
  };

  return (
    <section id="login-section" className="alex-container">
      {loading ? (
        <Carregando title="Realizando Login" />
      ) : (
        <LoginForm
          onSubmit={handleSubmitLogin}
          onChange={handleInputChange}
          formData={formData}
          isSubmitted={isSubmitted}
          loading={loading}
        />
      )}

      {alertData && (
        <Alert
          title={alertData.title}
          text={alertData.text}
          icon={alertData.icon}
          onClose={handleAlertClose}
        />
      )}
    </section>
  );
};

export default Login;
