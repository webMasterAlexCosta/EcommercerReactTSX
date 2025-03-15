import React from "react";
import { FaGithub, FaLinkedin, FaWhatsapp, FaFacebook, FaCertificate } from "react-icons/fa";
import './style.css'; // Estilo localizado
import { Link } from "react-router-dom";

const PaginaAviso: React.FC = () => {
  const socialLinks = [
    { href: "https://github.com/alevivaldi", icon: <FaGithub size={30} />, label: "GitHub" },
    { href: "https://www.linkedin.com/in/alexcosta2025/", icon: <FaLinkedin size={30} />, label: "LinkedIn" },
    { href: "https://wa.me/21991081578", icon: <FaWhatsapp size={30} />, label: "WhatsApp" },
    { href: "https://www.facebook.com/Alevivaldinbl", icon: <FaFacebook size={30} />, label: "Facebook" },
    { href: "/Certificados", icon: <FaCertificate size={30} />, label: "Certificados" },
  ];
  const FeatureCard: React.FC<{ title: string; description: string; icon: React.ReactElement }> = ({ title, description, icon }) => {
    return (
      <div className="feature-card">
        <div className="feature-icon">{icon}</div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    );
  };
  return (
    <div className="welcome-container">
      {/* Header */}
      <header className="welcome-header">
       
       <h1> <p className="sub-title">Este projeto é fictício. Nada é Real, sinta se a vontade pra explorar</p></h1>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h2>Explore o Futuro da Tecnologia</h2>
          <p>
            Aqui você encontrará soluções inovadoras, designs modernos e uma experiência única.
          </p>
          <Link to="/Catalogo" >
          <button className="cta-button">Começar Agora</button>
          </Link>
         
        </div>
       
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>O que oferecemos?</h2>
        <div className="features-grid">
          <FeatureCard
            title="Design Moderno"
            description="Interfaces limpas e responsivas para todos os dispositivos."
            icon={<FaCertificate size={40} />}
          />
          <FeatureCard
            title="Performance"
            description="Soluções rápidas e eficientes para qualquer necessidade."
            icon={<FaWhatsapp size={40} />}
          />
          <FeatureCard
            title="Suporte Total"
            description="Equipe dedicada para ajudar em cada etapa do projeto."
            icon={<FaLinkedin size={40} />}
          />
        </div>
      </section>

      {/* Social Links */}
      <section className="social-section">
  <h2>Conecte-se comigo:</h2>
  <div className="social-links">
    {socialLinks.map((link, index) => (
      <a
        key={index}
        href={link.href}
        target={link.href === "/Certificados" ? undefined : "_blank"}
        rel="noopener noreferrer"
        className="social-link"
        aria-label={link.label}
      >
        <div className="icon-container">
          {link.icon}
        </div>
        <p>{link.label}</p>
      </a>
    ))}
  </div>
</section>

    </div>
  );
};



export default PaginaAviso;