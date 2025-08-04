import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="elegant-footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section logo-section">
            <img className="logo-footer" src={require("./H.jpg")} alt="Hortésie Logo" />
          </div>

          <div className="footer-section links-section">
            <h6 className="footer-title">Liens utiles</h6>
            <div className="footer-links">
              <a href="/a-propos" className="footer-link">
                À propos
              </a>
              <a href="/projets" className="footer-link">
                Projets
              </a>
              <a href="/contact" className="footer-link">
                Contact
              </a>
            </div>
          </div>

          <div className="footer-section contact-section">
            <h6 className="footer-title">Contact</h6>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <span>11 rue des Saules, 95450 Vigny</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <span>hortesie[at]hortesie.biz</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <span>01 30 39 24 88</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">🔗</span>
                <a href="https://www.linkedin.com/company/hort%C3%A9sie/" className="footer-link">
                  LinkedIn - Hortésie
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-divider"></div>
        
        <div className="footer-bottom">
          <p className="copyright">© 2024 Hortésie. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
