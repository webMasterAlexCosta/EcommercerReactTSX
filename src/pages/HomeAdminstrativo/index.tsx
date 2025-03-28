import { Outlet } from 'react-router-dom';
import HeaderAdmin from '../../components/Layout/HeaderAdmin';
import { Usuario } from '../../models/dto/CredenciaisDTO';
import AdminLayout from '../../pages/HomeAdminstrativo/AdminLayout/index'; 

interface AdministrativoProps {
  user?: Usuario | null;
}

const Administrativo = ({ user }: AdministrativoProps) => {
  return (
    <div>
      <HeaderAdmin
        user={user ?? null}
        setViewerHeaderClient={() => {}}
        setContextIsLogin={() => {}}
      />
      <AdminLayout user={user}/>
      <Outlet context={{ user }} />
    </div>
  );
};

export default Administrativo;