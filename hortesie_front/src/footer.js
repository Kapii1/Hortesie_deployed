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
                <a href="/articles" className="footer-link">
                  Articles
                </a>
                <a href="/contact" className="footer-link">
                  Contact
                </a>
              </div>
            </div>

            <div className="footer-column">
              <h4 className="footer-title">Contact</h4>
              <ul className="footer-contact-list">
                <li>
                  <svg className="footer-contact-icon " viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <rect x="3" y="5" width="18" height="14" rx="2"></rect>
                    <path d="M3 7l9 6l9-6"></path>
                  </svg>
                  <span>hortesie[at]hortesie.biz</span>
                </li>
                <li>
                  <svg className="footer-contact-icon " viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M4 5h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2c1.8 3.6 4.6 6.4 8.2 8.2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2C9.16 23 1 14.84 1 5a2 2 0 0 1 2-2z"></path>
                  </svg>
                  <span>01 30 39 24 88</span>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-title">Suivez-nous</h4>
              <div className="social-links">
                <a href="https://www.linkedin.com/company/hort%C3%A9sie/" className="social-link" target="_blank" rel="noopener noreferrer">
                  <svg className="social-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M20.447 20.452h-3.554V14.87c0-1.332-.026-3.045-1.856-3.045-1.857 0-2.14 1.45-2.14 2.95v5.677H9.343V9h3.414v1.561h.049c.476-.9 1.637-1.856 3.367-1.856 3.601 0 4.268 2.37 4.268 5.455v6.292zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM6.954 20.452H3.72V9h3.234v11.452z"/>
                  </svg>
                  <span>LinkedIn</span>
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
