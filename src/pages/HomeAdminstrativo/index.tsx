// src/layouts/AdminLayout.tsx
import { Outlet } from 'react-router-dom';
import HeaderAdmin from '../../components/HeaderAdmin/HeaderAdmin';

const AdminLayout = () => {
  return (
    <div>
      <HeaderAdmin />
      <Outlet />
    </div>
  );
};

export default AdminLayout;
