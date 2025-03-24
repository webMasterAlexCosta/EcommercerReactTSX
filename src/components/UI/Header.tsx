import { useState } from 'react';
import HeaderAdmin from '../Layout/HeaderAdmin';
import HeaderClient from '../Layout/HeaderClient';
import { useContext } from 'react';
import ContextIsLogin from './../../data/LoginContext';
import * as userService from '../../services/UserServices';


const Header = ()=>{    
    const isAdmin = userService.getUserService()?.perfis.includes("ADMIN")?"ADMIN" : "CLIENTE"
    const [viewerHeaderClient , setViewerHeaderClient] = useState<boolean>(false)
    const { setContextIsLogin } = useContext(ContextIsLogin);

  

    return (
       <>
         {isAdmin === "ADMIN" && viewerHeaderClient === true 
         ? 
         <HeaderAdmin user={userService.getUserService()?.user?.nome} 
         setViewerHeaderClient={setViewerHeaderClient} 
         setContextIsLogin={setContextIsLogin}
         /> 
         : <HeaderClient />}
       </>
    )
}
export  {Header};