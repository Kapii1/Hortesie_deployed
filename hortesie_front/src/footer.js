import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="modern-footer">
      
      <div className="footer-container">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="brand-logo">
              <img className="logo-footer" src={require("./H.jpg")} alt="Hortésie Logo" />

            </div>
          </div>

          <div className="footer-links-grid">
            <div className="footer-column">
              <h4 className="footer-title">Navigation</h4>
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

            <div className="footer-column">
              <h4 className="footer-title">Contact</h4>
              <ul className="contact-list">
                <li>11 rue des Saules, 95450 Vigny</li>
                <li>hortesie[at]hortesie.biz</li>
                <li>01 30 39 24 88</li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-title">Suivez-nous</h4>
              <div className="social-links">
                <a href="https://www.linkedin.com/company/hort%C3%A9sie/" className="social-link" target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">© 2025 Hortésie. Tous droits réservés.</p>

          </div>
        </div>
      </div>
    </footer>
  );
}
