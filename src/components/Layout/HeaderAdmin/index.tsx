import './Styles.css';
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import * as userService from "../../../services/UserServices";
import { AccountCircle, ExitToApp, Home, Inventory, SupervisorAccount } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { isAuthenticated } from '../../../services/AuthService';
import { Usuario } from '../../../models/dto/CredenciaisDTO';

interface HeaderAdminProps {
  user: Usuario | null;
  setViewerHeaderClient: () => void;
  setContextIsLogin: () => void;
}

const HeaderAdmin = ({ setViewerHeaderClient, setContextIsLogin }: HeaderAdminProps) => {
  const [usuario, setUsuario] = useState<{ nome: string } | null>(null);  // Armazena o nome do usuário ou null
  const [loading, setLoading] = useState(true);  // Estado de loading para aguardar a resposta da API

  const getIsActive = ({ isActive }: { isActive: boolean }) =>
    isActive ? { color: "red" } : { color: "black" };

  useEffect(() => {
    if (isAuthenticated()) {
      const obterUsuario = async () => {
        setLoading(true);  // Começando o carregamento
        try {
          const response = await userService.getUserService();  // Fazendo a chamada para a API

          // Verificando se a resposta contém o nome
          if (response && response.nome) {
            setUsuario({ nome: response.nome });  // Atualiza o estado com o nome do usuário
          } else {
            setUsuario(null);  // Se não houver nome, define como null
          }
        } catch (error) {
          console.error("Erro ao buscar usuário:", error);
          setUsuario(null);  // Caso ocorra erro, também define como null
        } finally {
          setLoading(false);  // Finalizando o carregamento
        }
      };

      obterUsuario();  // Chama a função para obter o usuário
    } else {
      setLoading(false);  // Caso o usuário não esteja autenticado, já finaliza o loading
    }
  }, []);  // Executa apenas uma vez quando o componente for montado

  const handlerClick = () => {
    userService.logoutService();
    setViewerHeaderClient();
    setContextIsLogin();
  };

  return (
    <>
      <header className="alex-header-admin">
        <nav className="alex-container-admin">

          <NavLink style={getIsActive} to="/Administrativo">
            <div className="alex-contaner-admin-inicio">
              <h1 className='usuario' >
                {loading ? "Carregando..." : usuario ? usuario.nome : "Usuário Desconhecido"}  {/* Exibe o nome do usuário ou mensagem de erro */}
              </h1>

              <NavLink style={getIsActive} to="/" className="alex-contaner-admin-inicio" >
                <Home style={{ fontSize: 40, color: 'black' }} />

                <h3>Início</h3>
              </NavLink>
            </div>


          </NavLink>

          <div className="alex-navbar-left-admin">
            <div className="alex-menu-items-container">

              <NavLink to="PerfilAdmin" style={getIsActive} className="user-profile-link">
                <AccountCircle style={{ fontSize: 40, color: 'black' }} />
                <h3>Perfil</h3>
              </NavLink>



              <div className="alex-menu-item-produto">
                <p className="alex-menu-item-active">
                  <NavLink style={getIsActive} to="/Administrativo/Listagem" className="produtos">
                    <Inventory style={{ fontSize: 40, color: 'black', marginRight: 8 }} />
                    <h3>Produtos</h3>
                  </NavLink>
                </p>
              </div>

            </div>

            <div className="alex-logged-user">
              <div className="user-info-icon">
                <SupervisorAccount style={{ fontSize: 40, color: 'black' }} />
              </div>
              <Link to="/catalogo" onClick={handlerClick} className="logout-link">
                <ExitToApp style={{ fontSize: 40, color: 'black' }} />
                
              </Link> 
            </div>
           
          </div>
        </nav>
      </header >
    </>
  );
};

export default HeaderAdmin;
