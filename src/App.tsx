import { BrowserRouter, Routes, Route, Outlet, Link, useLocation } from 'react-router-dom';
import './App.css';
import { useEffect, useState } from 'react';
import ContextCartCount from './data/CartCountContext';
import Carrinho from './pages/HomeClient/Carrinho';
import Catalogo from './pages/HomeClient/Catalogo';
import Login from './pages/Login/Login';
import Administrativo from './pages/HomeAdminstrativo';
import Listagem from './pages/HomeAdminstrativo/Listagem';
import Detalhes from './pages/HomeClient/Catalogo/Detalhes';
import CriarNovoProduto from './pages/HomeAdminstrativo/CriarNovoFormulario/index';
import Formulario from './pages/HomeAdminstrativo/Formulario';
import ContextIsLogin from './data/LoginContext';
import IconAdminContext, { PerfilContext } from './data/IconAdminContext';
import { PrivateRouteAdmin } from './components/Private/Router/ADMIN/index';
import { PrivateRouteClient } from './components/Private/Router/CLIENTE/index';
import { Perfil } from './pages/HomeClient/Perfil';
import { Header } from './components/UI/Header';
import PaginaAviso from './components/Layout/PaginaAviso';
import CertificadoPage from './components/Layout/CertificadoPage';
import CertificadoDetailPage from './components/Layout/CertificadoPage/CertificadoDetailPage';
import CardPaymentComponent from './components/UI/CardPaymentComponent';
import { MudarSenha } from './components/Layout/MudarSenha/index';
import { NovoEndereco } from './components/Layout/NovoEndereco';
import * as userService from './services/UserServices';
import * as authService from './services/AuthService';
import { Usuario } from './models/dto/CredenciaisDTO';
import { Carregando } from './components/UI/Carregando';

const MainLayout = ({ user }: { user: Usuario | null }) => {
  const location = useLocation();
  
  return (
    <>
      <Header user={user} />
      {location.pathname === '/' && <PaginaAviso />}
      <Outlet />
    </>
  );
};

const App = () => {
  const [contextCartCount, setContextCartCount] = useState<number>(0);
  const [contextIsLogin, setContextIsLogin] = useState<boolean>(false);
  const [iconAdminContext, setIconAdminContext] = useState<PerfilContext>(null);
  const [user, setUser] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      
      try {
        if (authService.isAuthenticated()) {
          // Se autenticado, busca os dados do usuário
          const userProfile = await userService.getUserService();
          setUser(userProfile);
          setContextIsLogin(true);
        } else {
          // Se não autenticado, limpa o estado
          setUser(null);
          setContextIsLogin(false);
        }
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
        setUser(null);
        setContextIsLogin(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []); // Adicione dependências se necessário (ex: quando o token muda)

  if (isLoading) {
    return <Carregando title='aguarde' />;
  }
  return (
    <IconAdminContext.Provider value={{ iconAdminContext, setIconAdminContext }}>
      <ContextIsLogin.Provider value={{ contextIsLogin, setContextIsLogin }}>
        <ContextCartCount.Provider value={{ contextCartCount, setContextCartCount }}>
          <BrowserRouter>
            <div className="app-container">
              <Routes>
                <Route path="/" element={<MainLayout user={user} />}>
                  <Route path="/Perfil" element={<PrivateRouteClient><Perfil /></PrivateRouteClient>} >
                    <Route path="MudarSenha" element={<PrivateRouteClient><MudarSenha /></PrivateRouteClient>} />
                    <Route path="NovoEndereco" element={<PrivateRouteClient><NovoEndereco /></PrivateRouteClient>} />
                  </Route>
                  <Route path="/Carrinho" element={<Carrinho />} >
                    <Route path="Pagamento" element={<CardPaymentComponent />} />
                  </Route>
                  <Route path="/Catalogo" element={<Catalogo />}>
                    <Route path="Detalhes/:id" element={<Detalhes />} />
                  </Route>
                  <Route path="/certificados" element={<CertificadoPage />} />
                  <Route path="/certificado/:id" element={<CertificadoDetailPage />} />
                  <Route path="/Login" element={<Login />} />
                  <Route path="*" element={<Link to="/"><h1 style={{ color: "red" }}>404 - Página não encontrada</h1></Link>} />
                </Route>

                <Route path="/Administrativo" element={<PrivateRouteAdmin><Administrativo /></PrivateRouteAdmin>}>
                  <Route path="Listagem" element={<PrivateRouteAdmin><Listagem /></PrivateRouteAdmin>} />
                  <Route path="Formulario/:id" element={<PrivateRouteAdmin><Formulario /></PrivateRouteAdmin>} />
                  <Route path="CriarNovoProduto/:id" element={<PrivateRouteAdmin><CriarNovoProduto /></PrivateRouteAdmin>} />
                </Route>
              </Routes>
            </div>
          </BrowserRouter>
        </ContextCartCount.Provider>
      </ContextIsLogin.Provider>
    </IconAdminContext.Provider>
  );
};

export default App;
