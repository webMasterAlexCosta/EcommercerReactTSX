import { BrowserRouter, Routes, Route, Outlet, Link } from 'react-router-dom';
import './App.css';
import { useState } from 'react';
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
import { PrivateRoute } from './components/Private/Router';
import { Perfil } from './pages/HomeClient/Perfil';
import { Header } from './components/UI/Header';
import CardPaymentComponent from './components/Layout/CardPaymentComponent';
const App = () => {
  const [contextCartCount, setContextCartCount] = useState<number>(0);
  const [contextIsLogin, setContextIsLogin] = useState<boolean>(false);
  const [iconAdminContext, setIconAdminContext] = useState<PerfilContext>(null);


  return (
    <IconAdminContext.Provider value={{ iconAdminContext, setIconAdminContext }}>
      <ContextIsLogin.Provider value={{ contextIsLogin, setContextIsLogin }}>
        <ContextCartCount.Provider value={{ contextCartCount, setContextCartCount }}>
          <BrowserRouter>
            <div className="app-container">
              <Routes>
                <Route path="/" element={<><Header /><Outlet /></>}>
                  <Route path="/Perfil" element={<Perfil />} />
                  <Route path="Carrinho" element={<Carrinho />} />
                  <Route path="/" element={<CardPaymentComponent />} />


                  <Route path="Catalogo" element={<Catalogo />}>
                    <Route path="Detalhes/:id" element={<Detalhes />} />
                  </Route>
                  <Route path="/Login" element={<Login />} />
                  <Route path="*" element={<Link to='/'><h1 style={{ color: "red" }}>404 - Página não encontrada</h1></Link>} />
                </Route>

                {/* Rotas administrativas */}
                <Route path="/Administrativo" element={<PrivateRoute><Administrativo /></PrivateRoute>}>
                  <Route path="Listagem" element={<PrivateRoute><Listagem /></PrivateRoute>} />
                  <Route path="Formulario/:id" element={<PrivateRoute><Formulario /></PrivateRoute>} />
                  <Route path="CriarNovoProduto/:id" element={<PrivateRoute><CriarNovoProduto /></PrivateRoute>} />
                </Route>
              </Routes>
            </div>
          </BrowserRouter>
        </ContextCartCount.Provider>
      </ContextIsLogin.Provider>
    </IconAdminContext.Provider>
  );
}

export default App;
