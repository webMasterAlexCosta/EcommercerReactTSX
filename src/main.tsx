import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Carrinho from './pages/HomeClient/Carrinho';
import Catalogo from './pages/HomeClient/Catalogo';
import Login from './pages/Login/Login';
import AdminHome from './pages/Adminstrativo/AdminHome';
// import ClienteLayout from './pages/HomeClient/ClienteLayout';
import Adminstrativo from './pages/Adminstrativo';
import App from './App';
import Listagem from './pages/Adminstrativo/Listagem';
import Formulario from './pages/Adminstrativo/Formulario'; // Corrigido aqui
import Detalhes from './pages/HomeClient/Detalhes';
import CriarNovoProduto from './pages/CriarNovoFormulario';
import HeaderClient from './components/HeaderClient/HeaderClient';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<><HeaderClient /><App /></>}>
          <Route path="/Carrinho" element={<Carrinho />} />
          <Route path="/Catalogo" element={<Catalogo />} />
          <Route path="/Catalogo/:id" element={<Detalhes />} />
          <Route path="/Login" element={<Login />} />
          {/* <Route path="/Cliente" element={<ClienteLayout />} /> */}
          <Route path="*" element={<a href='/'><h1 style={{ color: "red" }}>404 - Página não encontrada</h1></a>} />

        </Route>

        <Route path="/Administrativo" element={<Adminstrativo />}>
          <Route path="AdminHome" element={<AdminHome />} />
          <Route path="Listagem" element={<Listagem />} />

          <Route path="Formulario/:id" element={<Formulario />} />
          <Route path="CriarNovoProduto/:id" element={<CriarNovoProduto />} />
        </Route>

      </Routes>
    </BrowserRouter>
  </StrictMode>
);
