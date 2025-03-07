import './styles.css';
interface AdminHomeProps{
  user:string | undefined
}

const AdminHome = ({user}:AdminHomeProps) => {
  
  return (
    <>
      
      <main>
        <section id="admin-home-section" className="dsc-container">
          <h2 className="dsc-section-title dsc-mb20">Bem-vindo à àrea administrativa {user}</h2>
        </section>
      </main>
    </>
  )
}
export default AdminHome;