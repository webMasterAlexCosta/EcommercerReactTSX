import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';  // Importação do React Router

import Carrinho from './pages/Carrinho/Carrinho.tsx';
import { Link } from 'react-router-dom';
import Catalogo from './pages/Catalogo/Catalogo.tsx';
import Detalhes from './pages/Detalhes/Detalhes.tsx';
import Login from './pages/Login/Login.tsx';

function App() {

  return (
    <>
   <BrowserRouter>
   <Link to="/Carrinho">Carrinho</Link>
   <Link to="/Catalogo"> Catalogo</Link>
   <Link to="/Detalhes"> Detalhes</Link>
   <Link to="/Login"> Login</Link>

   <Routes>
    <Route path="/Carrinho" element={<Carrinho/>} />
    <Route path="/Catalogo" element={<Catalogo/>} />
    <Route path="/Detalhes" element={<Detalhes/>} />
    <Route path="/Login" element={<Login/>} />
       
   
   </Routes>
   </BrowserRouter>    
      </>
  );
}

export default App
