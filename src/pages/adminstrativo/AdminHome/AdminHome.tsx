import HeaderAdmin from '../../../components/HeaderAdmin.tsx';
import './styles.css';


const AdminHome = () => {
  return (
    <>
      <HeaderAdmin />
      <main>
        <section id="admin-home-section" className="dsc-container">
          <h2 className="dsc-section-title dsc-mb20">Bem-vindo à àrea administrativa</h2>
        </section>
      </main>
    </>
  )
}
export default AdminHome;