// src/layouts/AdminLayout.tsx
import { Outlet } from 'react-router-dom';
import HeaderAdmin from '../../components/Layout/HeaderAdmin';
import { useEffect, useState } from 'react';
import { UserDTO } from '../../models/dto/UserDTO';
import *as userServices from "../../services/UserServices"
import AdminHome from './AdminLayout';

const HomeAdminstrativo = () => {
  const [usuario,setUsuario]=useState<UserDTO>()

 useEffect(() => {
  const fechUser = async () => {
      try {
          const response = await userServices.findMe()
          setUsuario(response.data)
      } catch (error) {
         
          console.log(error)
      }
  }
  fechUser()
}, [])
  return (
    <div>
      <HeaderAdmin user={usuario?.nome}/>
      <AdminHome user={usuario?.nome}/>
      <Outlet  />
    </div>
  );
};

export default HomeAdminstrativo;
