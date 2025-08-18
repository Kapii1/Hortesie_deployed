import React from "react";
import { Link } from "react-router-dom";
import "./AdminAccueil.css";

export default function AdminAccueil() {
  return (
    <div className="admin-accueil">
      <section className="admin-hero">
        <h1>Administration</h1>
        <p className="admin-subtitle">
          Gérez les projets, les articles et vos outils CCTP en toute simplicité.
        </p>
      </section>

      <nav className="admin-grid" aria-label="Navigation administration">
        <Link className="admin-card" to="projets" aria-label="Gérer les projets">
          <div className="admin-card-icon" aria-hidden="true">📁</div>
          <div className="admin-card-content">
            <h2 className="admin-card-title">Projets</h2>
            <p className="admin-card-desc">Créer, éditer, réordonner et publier vos projets.</p>
          </div>
          <span className="admin-card-arrow" aria-hidden="true">→</span>
        </Link>

        <Link className="admin-card" to="article" aria-label="Gérer les articles">
          <div className="admin-card-icon" aria-hidden="true">📰</div>
          <div className="admin-card-content">
            <h2 className="admin-card-title">Articles</h2>
            <p className="admin-card-desc">Rédiger, organiser et mettre à jour les articles du blog.</p>
          </div>
          <span className="admin-card-arrow" aria-hidden="true">→</span>
        </Link>

        <Link className="admin-card" to="tools" aria-label="Outils CCTP">
          <div className="admin-card-icon" aria-hidden="true">🛠️</div>
          <div className="admin-card-content">
            <h2 className="admin-card-title">Outils CCTP</h2>
            <p className="admin-card-desc">Accéder aux outils pour générer vos CCTP.</p>
          </div>
          <span className="admin-card-arrow" aria-hidden="true">→</span>
        </Link>
      </nav>
    </div>
  );
}