import './styles.css';
interface AdminHomeProps{
  user:string | undefined
}

const AdminHome = ({user}:AdminHomeProps) => {
  
  return (
    <>
      
      <main>
        <section id="admin-home-section" className="alex-container">
          <h2 className="alex-section-title alex-mb20">Bem-vindo à àrea administrativa {user}</h2>
        </section>
      </main>
    </>
  )
}
export default AdminHome;