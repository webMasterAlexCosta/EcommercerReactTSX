import { Outlet } from 'react-router-dom';
import './styles.css';
import { useEffect, useState } from 'react';
import { UserDTO } from '../../../models/dto/UserDTO';
import *as userServices from "../../../services/UserServices"

const AdminHome = () => {
  const [usuario,setUsuario]=useState<UserDTO>()


  useEffect(()=>{
    const fechUser=async()=>{
      try{
      const obter = await userServices.findMe()
        setUsuario(obter.data)
    }catch(error){
      console.log(error)
    }
    }
    fechUser()

  },[])
  return (
    <>
      
      <main>
        <section id="admin-home-section" className="dsc-container">
          <h2 className="dsc-section-title dsc-mb20">Bem-vindo à àrea administrativa {usuario?.nome}</h2>
        </section>
      </main>
      <Outlet />
    </>
  )
}
export default AdminHome;