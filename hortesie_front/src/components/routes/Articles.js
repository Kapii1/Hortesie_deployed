import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { API_URL, CANONICAL_BASE } from "../../url";
import { Helmet } from "react-helmet-async";
import { Spinner } from "react-spinner-animated";
import CustomGrid from "./CustomGrid";
import Image from "./Image";
import "./ArticlesList.css";

const useArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/articles/`, { method: "GET" });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setArticles(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching articles:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return { articles, loading, error };
};

export default function Articles() {
  const { articles, loading, error } = useArticles();
  const gridRef = useRef();
  const [isLoaded, setIsLoaded] = useState(false);

  // Sort by date (desc) and memoize
  const sortedArticles = useMemo(() => {
    const parseDate = (d) => {
      try { return d ? new Date(d) : new Date(0); } catch { return new Date(0); }
    };
    return [...articles].sort((a, b) => parseDate(b.date) - parseDate(a.date));
  }, [articles]);

  const formatDate = (d) => {
    if (!d) return null;
    try {
      return new Intl.DateTimeFormat('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(d));
    } catch {
      return d;
    }
  };

  useEffect(() => {
    if (!loading) {
      setIsLoaded(true);
      if (gridRef.current) {
        gridRef.current.classList.add("articles-container-loaded");
      }
    }
  }, [loading]);

  if (error) {
    return (
      <div className="error-container">
        <p>Erreur lors du chargement des articles: {error}</p>
        <button onClick={() => window.location.reload()}>Réessayer</button>
      </div>
    );
  }

  return (
    <>
      {loading && (
        <div className="spinner-loading">
          <Spinner text="Chargement..." center={false} height="100px" />
        </div>
      )}
      <div className="articles-page" id="grid-articles">
        <Helmet>
          <title>Hortésie : Articles</title>
          <link rel="canonical" href={`${CANONICAL_BASE}/articles`} />
        </Helmet>

        <CustomGrid ref={gridRef} className="articles-container">
          <section className="articles-list">
            {sortedArticles.map((item) => (
              <article className="article-card" key={item.id}>
                {item.vignette ? (
                  <Image src={item.vignette} className="article-thumb" alt={item.title || 'Vignette article'} />
                ) : (
                  <div className="article-thumb placeholder" />
                )}
                <div className="article-content">
                  <div className="article-meta">
                    {item.date ? <span className="article-date">{formatDate(item.date)}</span> : null}
                    {item.pdf ? <span className="badge badge-pdf" aria-label="Document PDF disponible">PDF</span> : null}
                  </div>
                  <h3 className="article-title">{item.title}</h3>
                  {item.summary ? (
                    <p className="article-summary">{item.summary}</p>
                  ) : null}
                  {item.pdf ? (
                    <div className="article-actions">
                      <a className="article-link" href={item.pdf} target="_blank" rel="noreferrer" aria-label={`Ouvrir le PDF : ${item.title || 'Article'}`}>
                        Ouvrir le PDF
                      </a>
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
          </section>
        </CustomGrid>
      </div>
    </>
  );
}
