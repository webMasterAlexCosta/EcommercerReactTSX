import React from "react";
import { useParams, Link } from "react-router-dom";
import { certificates } from "../../../../models/domain/Certificados";
import "./style.css";
const CertificadoDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const certificateId = Number(id); // Convertendo o id para número
  const certificateIndex = certificates.findIndex((cert) => cert.id === certificateId);

  if (certificateIndex === -1) {
    return <h1>Certificado não encontrado</h1>;
  }

  const certificate = certificates[certificateIndex];

  // Calculando o próximo e o anterior
  const previousCertificate = certificates[certificateIndex - 1];
  const nextCertificate = certificates[certificateIndex + 1];

  return (
    <div className="certificate-detail-container">
      <header className="certificate-header-detail">
        <h1>{certificate.title}</h1>
      </header>

      <section className="certificate-content-detail">
        <p>{certificate.description}</p>
        <a href={certificate.pdfUrl} target="_blank" rel="noopener noreferrer" className="certificate-view">
          Visualizar Certificado
        </a>
        <div>
          <Link to="/certificados" className="certificate-view">
            Voltar Pagina
          </Link>
        </div>
        {/* Botões de navegação */}
        <div className="certificate-navigation">
          {previousCertificate && (
            <Link to={`/certificado/${previousCertificate.id}`} className="certificate-nav-button">
              Anterior
            </Link>
          )}
          {nextCertificate && (
            <Link to={`/certificado/${nextCertificate.id}`} className="certificate-nav-button">
              Próximo
            </Link>
          )}
        </div>

        
      </section>
    </div>
  );
};

export default CertificadoDetailPage;
