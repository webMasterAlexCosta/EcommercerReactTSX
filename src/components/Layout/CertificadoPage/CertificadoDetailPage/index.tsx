import React from "react";
import { useParams } from "react-router-dom";
import { certificates } from "../../../../models/domain/Certificados";
// Interface para representar um certificado




const CertificadoDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const certificate = certificates.find((cert) => cert.id === Number(id));

  if (!certificate) {
    return <h1>Certificado não encontrado</h1>;
  }

  return (
    <div className="certificate-detail-container">
      <header className="certificate-header">
        <h1>{certificate.title}</h1>
      </header>

      <section className="certificate-content">
        <p>{certificate.description}</p>
        <a href={certificate.pdfUrl} target="_blank" rel="noopener noreferrer" className="certificate-view">
          Visualizar Certificado
        </a>
        <div>
        <a href="/Certificados" className="certificate-view">
          Voltar
        </a>
        </div>
      </section>
    </div>
  );
};

export default CertificadoDetailPage;