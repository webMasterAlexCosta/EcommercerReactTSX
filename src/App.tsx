import { BrowserRouter, Routes, Route, Outlet, Link, useLocation } from 'react-router-dom';
import './App.css';
import Carrinho from './pages/HomeClient/Carrinho';
import Catalogo from './pages/HomeClient/Catalogo';
import Login from './pages/Login/Login';
import Administrativo from './pages/HomeAdminstrativo';
import Listagem from './pages/HomeAdminstrativo/Listagem';
import Detalhes from './pages/HomeClient/Catalogo/Detalhes';
import CriarNovoProduto from './pages/HomeAdminstrativo/CriarNovoFormulario/index';
import Formulario from './pages/HomeAdminstrativo/Formulario';
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
import ContextProviders from './data/Contextos';

const MainLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <>
      <Header />
      {isHomePage && <PaginaAviso />}
      <Outlet />
    </>
  );
};

const App = () => {
  
  return (
    <ContextProviders>
              <BrowserRouter>
                <div className="app-container">
                  <Routes>
                    <Route path="/" element={<MainLayout />}>
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
              </ContextProviders>
  );
};
export default App;
