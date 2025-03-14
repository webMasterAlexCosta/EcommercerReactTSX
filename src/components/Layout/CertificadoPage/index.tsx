import React from "react";
import { Link } from "react-router-dom";
import './style.css'; // Estilo localizado

import  {certificates}  from "../../../models/domain/Certificados";
// Interface para representar um certificado




const CertificadoListPage: React.FC = () => {
  return (
    <>
    <h1 className="certificate-title"><p>Aqui estão alguns dos meus certificados obtidos ao longo da carreira.</p></h1>
    <div className="certificate-container">
      

      <section className="certificate-list">
        {certificates.map((certificate) => (
          <div key={certificate.id} className="certificate-card">
            <h3>{certificate.title}</h3>
            <p>{certificate.description.slice(0, 150)}...</p>
            <div className="certificate-card-buttons">
            <Link to={`/certificado/${certificate.id}`} className="certificate-view">
              Ver Detalhes
            </Link>
            </div>
          </div>
        ))}
      </section>
    </div>
    </>
  );
};

export default CertificadoListPage;