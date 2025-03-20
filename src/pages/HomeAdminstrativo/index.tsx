import { Outlet } from 'react-router-dom';
import HeaderAdmin from '../../components/Layout/HeaderAdmin';
import { useEffect, useState } from 'react';
import *as authServices from "../../services/AuthService"
import AdminHome from './AdminLayout';
import {  Usuario } from '../../models/dto/CredenciaisDTO';

const HomeAdminstrativo = () => {
  const [usuario, setUsuario] = useState<Usuario>()

  useEffect(() => {
  
    const response = authServices.getUser()
    if (response !== undefined) {
      setUsuario(JSON.parse(response))
    }
  }, [])
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
