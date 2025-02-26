//import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Carrinho from './pages/HomeClient/Carrinho';
import Catalogo from './pages/HomeClient/Catalogo';
import Login from './pages/Login/Login';
//import AdminHome from './pages/HomeAdminstrativo/AdminLayout';
//import Adminstrativo from './pages/HomeAdminstrativo';
import App from './App';
//import Listagem from './pages/HomeAdminstrativo/Listagem';
//import Formulario from './pages/HomeAdminstrativo/Formulario';
import Detalhes from './pages/HomeClient/Catalogo/Detalhes';
//import CriarNovoProduto from './pages/HomeAdminstrativo/CriarNovoFormulario/index';
import HeaderClient from './components/Layout/HeaderClient';

createRoot(document.getElementById('root')!).render(
 // <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<><HeaderClient /><App /></>}>
          <Route path="Carrinho" element={<Carrinho />} />
          
          {/* A página de catálogo, onde a lista de produtos será exibida */}
          <Route path="Catalogo" element={<Catalogo />}>
            {/* Página de detalhes do produto dentro de Catalogo */}
            <Route path="Detalhes/:id" element={<Detalhes />} />
          </Route>

          <Route path="/Login" element={<Login />} />
          <Route path="*" element={<a href='/'><h1 style={{ color: "red" }}>404 - Página não encontrada</h1></a>} />
        

        {/* <Route path="/Administrativo" element={<Adminstrativo />}>
          <Route path="AdminHome" element={<AdminHome />} />
          <Route path="Listagem" element={<Listagem />} />
          <Route path="Formulario/:id" element={<Formulario />} />
          <Route path="CriarNovoProduto/:id" element={<CriarNovoProduto />} />
        </Route> */}
        </Route>
      </Routes>
    </BrowserRouter>
 // </StrictMode>
);


