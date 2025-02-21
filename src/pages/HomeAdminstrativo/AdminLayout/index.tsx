import { Outlet } from 'react-router-dom';
import './styles.css';


const AdminHome = () => {
  return (
    <>
      
      <main>
        <section id="admin-home-section" className="dsc-container">
          <h2 className="dsc-section-title dsc-mb20">Bem-vindo à àrea administrativa</h2>
        </section>
      </main>
      <Outlet />
    </>
  )
}
export default AdminHome;