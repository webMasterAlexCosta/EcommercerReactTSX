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
import Formulario from './pages/Adminstrativo/Formulario/Formulario'; // Corrigido aqui
import Detalhes from './pages/Detalhes/Detalhes';
import CriarNovoProduto from './pages/Adminstrativo/Formulario/CriarNovoProduto';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<App />} />
        <Route path="*" element={ <a href='/'><h1 style={{color:"red"}}>404 - Página não encontrada</h1></a>} />
        <Route path="/Carrinho" element={<Carrinho />} />
        <Route path="/Catalogo" element={<Catalogo />} />
        <Route path="/Catalogo/:id" element={<Detalhes />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Cliente" element={<ClienteLayout />} />

        <Route path="/Administrativo" element={<AdminLayout />}>
        
          <Route path="AdminHome" element={<AdminHome />} >
          <Route path="Listagem" element={<Listagem />} />
          </Route>

          <Route path="Formulario/:id" element={<Formulario />} /> 
          <Route path="CriarNovoProduto/:id" element={<CriarNovoProduto />} /> 
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
