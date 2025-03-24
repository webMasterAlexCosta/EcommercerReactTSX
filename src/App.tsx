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
  const [user, setUser] = useState<Usuario | null>(null); // Tipo de estado ajustado para ser nulo inicialmente
  const [isLoading, setIsLoading] = useState<boolean>(true); // Estado de carregamento

  // useEffect para verificar autenticação e carregar dados do usuário
  useEffect(() => {
    const storedUser = userService.getUserService();

    if (storedUser === null && authService.isAuthenticated()) {
      userService.setUserService(); // Executa a atualização do serviço
      setUser(userService.getUserService()); // Atualiza o estado após o serviço ser executado
    } else {
      setUser(storedUser); // Caso o usuário já esteja disponível, apenas define
    }

    setIsLoading(false); // Finaliza o carregamento
  }, []); // A dependência vazia significa que isso acontece uma vez ao carregar o App

  // Bloqueia a renderização até o carregamento ser concluído
  if (isLoading) {
    return <div>
      <Carregando title='aguarde'/>
    </div>; // Você pode personalizar isso com um spinner ou algo mais adequado
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
