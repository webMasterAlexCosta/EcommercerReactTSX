import { useState } from 'react';
import * as authService from '../../services/AuthService';
import HeaderAdmin from '../Layout/HeaderAdmin';
import HeaderClient from '../Layout/HeaderClient';
import { useContext } from 'react';
import ContextIsLogin from './../../data/LoginContext';

const Header = ()=>{    
    const isAdmin = authService.getUser()?.perfis.includes("ADMIN")?"ADMIN" : "CLIENTE"
    const [viewerHeaderClient , setViewerHeaderClient] = useState<boolean>(false)
    const { setContextIsLogin } = useContext(ContextIsLogin);

  

    return (
       <>
         {isAdmin === "ADMIN" && viewerHeaderClient === true 
         ? 
         <HeaderAdmin user={authService.getUser()?.user?.nome} 
         setViewerHeaderClient={setViewerHeaderClient} 
         setContextIsLogin={setContextIsLogin}
         /> 
         : <HeaderClient />}
       </>
    )
}
export  {Header};