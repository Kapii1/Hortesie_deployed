import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../url";
import "./ArticlesAdmin.css";

export default function ArticleListAdmin() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_URL}/articles/`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setArticles(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return (
    <div className="admin-articles-page">
      <div className="admin-articles-header">
        <h2 className="admin-articles-title">Articles</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" className="btn-outline" onClick={() => navigate("/admin")}>
            Accueil admin
          </button>
          <button
            type="button"
            className="btn-outline"
            onClick={() => navigate("/admin/article/new")}
          >
            Nouvel article
          </button>
        </div>
      </div>

      <div className="admin-articles-card">
        {loading ? (
          <div>Chargement...</div>
        ) : error ? (
          <div className="feedback-error">{error}</div>
        ) : articles.length === 0 ? (
          <div>Aucun article.</div>
        ) : (
          <div className="article-list-table">
            {articles.map((a) => (
              <div key={a.id} className="article-list-row">
                {a.vignette ? (
                  <img src={a.vignette} alt="vignette" className="article-list-thumb" />
                ) : (
                  <div className="article-list-thumb placeholder" />)
                }
                <div className="article-list-info">
                  <div className="article-list-title">{a.title}</div>
                  {a.summary ? (
                    <div className="article-list-summary">{a.summary}</div>
                  ) : null}
                </div>
                <div className="article-list-actions">
                  <button
                    type="button"
                    className="btn-outline"
                    onClick={() => navigate(`/admin/article/${a.id}`)}
                  >
                    Modifier
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
