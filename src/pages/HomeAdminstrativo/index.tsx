import { Outlet } from 'react-router-dom';
import HeaderAdmin from '../../components/Layout/HeaderAdmin';
import { Usuario } from '../../models/dto/CredenciaisDTO';
import AdminLayout from '../../pages/HomeAdminstrativo/AdminLayout/index'; // Adjust the path if necessary

interface AdministrativoProps {
  user?: Usuario | null;
}

const Administrativo = ({ user }: AdministrativoProps) => {
  return (
    <div>
      {/* Renderiza o HeaderAdmin e passa o `user` como prop */}
      <HeaderAdmin
        user={user ?? null}
        setViewerHeaderClient={() => {}}
        setContextIsLogin={() => {}}
      />
      <AdminLayout user={user}/>
      {/* Passa o `user` para os componentes filhos via Outlet */}
      <Outlet context={{ user }} />
    </div>
  );
};

export default Administrativo;