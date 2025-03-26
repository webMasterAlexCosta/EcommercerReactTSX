// ContextProviders.tsx
import React, { ReactNode } from 'react';
import UserContext from '../data/UsuarioContext';
import ContextIsLogin from '../data/LoginContext';
import IconAdminContext, { PerfilContext } from '../data/IconAdminContext';
import ContextCartCount from '../data/CartCountContext';
import { HorarioBuscaPedidoContext } from '../data/HorarioBuscaPedidoContext';
import { Usuario } from '../models/dto/CredenciaisDTO';

interface Props {
  children: ReactNode;
}

const ContextProviders = ({ children }: Props) => {
  const [usuario, setUsuario] = React.useState<Usuario | null>(null);
  const [contextIsLogin, setContextIsLogin] = React.useState<boolean>(false);
  const [iconAdminContext, setIconAdminContext] = React.useState<PerfilContext | null>(null);
  const [contextCartCount, setContextCartCount] = React.useState<number>(0);
  const [horarioBusca, setHorarioBusca] = React.useState<Date>(new Date());
  const [ultimaBusca, setUltimaBusca] = React.useState<Date>(new Date());

  return (
    <HorarioBuscaPedidoContext.Provider value={{ horarioBusca, setHorarioBusca, ultimaBusca, setUltimaBusca }}>
      <UserContext.Provider value={{ usuario, setUsuario }}>
        <IconAdminContext.Provider value={{ iconAdminContext, setIconAdminContext }}>
          <ContextIsLogin.Provider value={{ contextIsLogin, setContextIsLogin }}>
            <ContextCartCount.Provider value={{ contextCartCount, setContextCartCount }}>
              {children}
            </ContextCartCount.Provider>
          </ContextIsLogin.Provider>
        </IconAdminContext.Provider>
      </UserContext.Provider>
    </HorarioBuscaPedidoContext.Provider>
  );
};

export default ContextProviders;
