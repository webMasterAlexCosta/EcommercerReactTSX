import { Outlet } from 'react-router-dom';
import HeaderAdmin from '../../components/Layout/HeaderAdmin';
import { useContext } from 'react';
import AdminHome from './AdminLayout';
import UsuarioContext from '../../data/UsuarioContext';

const HomeAdminstrativo = () => {
const {usuario} = useContext(UsuarioContext);
  
  return (
    <div>
      <HeaderAdmin 
        user={usuario?.nome} 
        setViewerHeaderClient={() => {}}
        setContextIsLogin={() => {}}
      />
      <AdminHome user={usuario?.nome} />
      <Outlet />
    </div>
  );
};

export default HomeAdminstrativo;
