import { useContext, useState } from "react";
import { loginRequest } from "../../services/CredenciasiService";
import "./styles.css";
import { CredenciaisDTO } from "../../models/dto/CredenciaisDTO";
import { useNavigate } from "react-router-dom";
import ContextIsLogin from "../../data/LoginContext";
import * as authService from "../../services/AuthService";
import Alert from "../../components/UI/Alert";
import * as crendincialService from "../../services/CredenciasiService";
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
  const {iconAdminContext, setIconAdminContext } = useContext(IconAdminContext);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertData, setAlertData] = useState<{ title: string; text: string; icon: "success" | "error" | "warning" | "info"; } | null>(null);

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
        crendincialService.save(response.data);
        setContextIsLogin(true);

        const payload = authService.getUser();
        const userProfile = payload?.perfis.includes("ADMIN") ? "ADMIN" : (payload?.perfis.includes("CLIENTE") ? "CLIENTE" : null);
        setIconAdminContext(userProfile);

        if(userProfile ==="ADMIN"){
          navigate("/administrativo")
        }else{
          navigate("/catalogo")
        }
        setLoading(false);
        setAlertData({
          title: "Login Aceito",
          text: `Usuário ${payload?.nome} logado com sucesso`,
          icon: "success"
        });
      
    } else {
      setLoading(false);
    }
  };

  const handleAlertClose = () => {
   
    if (alertData?.icon === "success") {
      if(iconAdminContext === "ADMIN") {
        navigate("/Administrativo");
      } else if(iconAdminContext === "CLIENTE") {  
      navigate("/catalogo");
    } else {
      setAlertData(null);
    }}
  };

  return (
    <section id="login-section" className="dsc-container">
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
