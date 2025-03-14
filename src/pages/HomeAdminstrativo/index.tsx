import { Outlet } from 'react-router-dom';
import HeaderAdmin from '../../components/Layout/HeaderAdmin';
import { useEffect, useState } from 'react';
import *as authServices from "../../services/AuthService"
import AdminHome from './AdminLayout';
import { AccessTokenPayloadDTO } from '../../models/dto/CredenciaisDTO';

const HomeAdminstrativo = () => {
  const [usuario, setUsuario] = useState<AccessTokenPayloadDTO>()

  useEffect(() => {
  
    const response = authServices.getAccessTokenPayload()
    if (response !== undefined) {
      setUsuario(response)
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
