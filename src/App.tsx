import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import './App.css';
import { useState } from 'react';
import ContextCartCount from './data/CartCountContext';
import Carrinho from './pages/HomeClient/Carrinho';
import Catalogo from './pages/HomeClient/Catalogo';
import Login from './pages/Login/Login';
import AdminHome from './pages/HomeAdminstrativo/AdminLayout';
import Adminstrativo from './pages/HomeAdminstrativo';
import Listagem from './pages/HomeAdminstrativo/Listagem';
import Detalhes from './pages/HomeClient/Catalogo/Detalhes';
import CriarNovoProduto from './pages/HomeAdminstrativo/CriarNovoFormulario/index';
import HeaderClient from './components/Layout/HeaderClient';
import Formulario from './pages/HomeAdminstrativo/Formulario';

const App = () => {
  const [contextCartCount, setContextCartCount] = useState<number>(0);

  return (
    <ContextCartCount.Provider value={{ contextCartCount, setContextCartCount }}>
      <BrowserRouter>
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
              <Route path="AdminHome" element={<AdminHome />} />
              <Route path="Listagem" element={<Listagem />} />
              <Route path="Formulario/:id" element={<Formulario />} />
              <Route path="CriarNovoProduto/:id" element={<CriarNovoProduto />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </ContextCartCount.Provider>
  );
}

export default App;
