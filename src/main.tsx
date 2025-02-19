import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Carrinho from './pages/Carrinho/Carrinho';
import Catalogo from './pages/Catalogo/Catalogo';
import Login from './pages/Login/Login';
import AdminHome from './pages/Adminstrativo/AdminHome/AdminHome';
import ClienteLayout from './pages/ClienteLayout/ClienteLayout';
import AdminLayout from './pages/Adminstrativo/AdminLayout';
import App from './App';
import Listagem from './pages/Adminstrativo/Listagem/Listagem';
import Formulario from './pages/Adminstrativo/Formulario/[Formulario]'; // Corrigido aqui
import Detalhes from './pages/Detalhes/[Detalhes]';
import CriarNovoProduto from './pages/Adminstrativo/Formulario/[CriarNovoProduto]';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<App />} />
        <Route path="/Carrinho" element={<Carrinho />} />
        <Route path="/Catalogo" element={<Catalogo />} />
        <Route path="/Detalhes/:id" element={<Detalhes />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Cliente" element={<ClienteLayout />} />

        <Route path="/Administrativo" element={<AdminLayout />}>
          <Route path="AdminHome" element={<AdminHome />} />
          <Route path="Listagem" element={<Listagem />} />
          <Route path="Formulario/:id" element={<Formulario />} /> 
          <Route path="CriarNovoProduto/:id" element={<CriarNovoProduto />} /> 
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
