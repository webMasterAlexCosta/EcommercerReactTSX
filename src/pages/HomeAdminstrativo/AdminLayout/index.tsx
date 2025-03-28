import { Usuario } from "../../../models/dto/CredenciaisDTO";

interface AdminLayoutProps {
  user?: Usuario | null;
}

const AdminLayout = ({ user }: AdminLayoutProps) => {
 
  if (!user) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      <main>
        <section id="admin-home-section" className="alex-container">
          <h2 className="alex-section-title alex-mb20">
            Bem-vindo à área administrativa, {user?.nome}
          </h2>
        </section>
      </main>
    </>
  );
};

export default AdminLayout;