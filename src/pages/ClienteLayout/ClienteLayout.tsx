// src/layouts/ClienteLayout.tsx
import { Outlet } from 'react-router-dom';

const ClienteLayout = () => {
  return (
    <div>
      <h2>Área do Cliente</h2>
      <Outlet />
    </div>
  );
};

export default ClienteLayout;
