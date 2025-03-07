import { Routes, Route, Outlet, unstable_HistoryRouter as HistoryRouter } from 'react-router-dom'; // HistoryRouter
import './App.css';
import { useState } from 'react';
import ContextCartCount from './data/CartCountContext';
import Carrinho from './pages/HomeClient/Carrinho';
import Catalogo from './pages/HomeClient/Catalogo';
import Login from './pages/Login/Login';
import Adminstrativo from './pages/HomeAdminstrativo';
import Listagem from './pages/HomeAdminstrativo/Listagem';
import Detalhes from './pages/HomeClient/Catalogo/Detalhes';
import CriarNovoProduto from './pages/HomeAdminstrativo/CriarNovoFormulario/index';
import HeaderClient from './components/Layout/HeaderClient';
import Formulario from './pages/HomeAdminstrativo/Formulario';
import ContextIsLogin from './data/LoginContext';

import { history } from './utils/history';  // Importando o history configurado

const App = () => {
  const [contextCartCount, setContextCartCount] = useState<number>(0);
  const [contextIsLogin, setContextIsLogin] = useState<boolean>(false);

  return (
    <ContextIsLogin.Provider value={{ contextIsLogin, setContextIsLogin }}>
      <ContextCartCount.Provider value={{ contextCartCount, setContextCartCount }}>
        <HistoryRouter history={history}> {/* Agora com HistoryRouter */}
          <div className="app-container">
            <Routes>
              {/* Rota principal com o HeaderClient */}
              <Route path="/" element={<><HeaderClient /><Outlet /></>}>
                <Route path="Carrinho" element={<Carrinho />} />
                <Route path="Catalogo" element={<Catalogo />}>
                  <Route path="Detalhes/:id" element={<Detalhes />} />
                </Route>
                <Route path="/Login" element={<Login />} />
                <Route path="*" element={<a href='/'><h1 style={{ color: "red" }}>404 - Página não encontrada</h1></a>} />
              </Route>

              {/* Rotas administrativas */}
              <Route path="/Administrativo" element={<Adminstrativo />}>
                <Route path="Listagem" element={<Listagem />} />
                <Route path="Formulario/:id" element={<Formulario />} />
                <Route path="CriarNovoProduto/:id" element={<CriarNovoProduto />} />
              </Route>
            </Routes>
          </div>
        </HistoryRouter>
      </ContextCartCount.Provider>
    </ContextIsLogin.Provider>
  );
}

export default App;
