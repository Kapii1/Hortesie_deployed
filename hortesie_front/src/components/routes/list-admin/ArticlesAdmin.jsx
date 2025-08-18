import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../url";
import "./ArticlesAdmin.css";

// Minimal admin page to create Articles with title, description (summary), thumbnail and pdf
export default function ArticlesAdmin() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [thumbFile, setThumbFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const thumbPreview = useMemo(() => (thumbFile ? URL.createObjectURL(thumbFile) : null), [thumbFile]);
  useEffect(() => {
    return () => {
      if (thumbPreview) URL.revokeObjectURL(thumbPreview);
    };
  }, [thumbPreview]);

  const resetForm = () => {
    setTitle("");
    setSummary("");
    setPdfFile(null);
    setThumbFile(null);
    setSubmitting(false);
  };

  async function handleCreateArticle(e) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!title.trim()) {
      setError("Le titre est requis.");
      return;
    }

    setSubmitting(true);

    try {
      // 1) Create article (send date as today). Include pdf if selected.
      const fd = new FormData();
      fd.append("title", title.trim());
      if (summary.trim()) fd.append("summary", summary.trim());
      // date required by model: send today ISO date (YYYY-MM-DD)
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      fd.append("date", `${yyyy}-${mm}-${dd}`);
      if (pdfFile) fd.append("pdf", pdfFile);

      const createRes = await fetch(`${API_URL}/articles/`, {
        method: "POST",
        body: fd,
      });
      if (!createRes.ok) {
        const txt = await createRes.text();
        throw new Error(`Erreur création (${createRes.status}): ${txt}`);
      }
      const created = await createRes.json();
      const articleId = created.id;

      // 2) If thumbnail provided: upload image and set as vignette
      if (thumbFile && articleId) {
        const upFd = new FormData();
        upFd.append("file", thumbFile);
        const upRes = await fetch(`${API_URL}/articles/${articleId}/add_image/`, {
          method: "POST",
          body: upFd,
        });
        if (!upRes.ok) {
          const t = await upRes.text();
          throw new Error(`Erreur upload vignette (${upRes.status}): ${t}`);
        }
        // fetch images to get the uploaded photo id (new article -> first image)
        const imgsRes = await fetch(`${API_URL}/articles/${articleId}/images/`);
        if (!imgsRes.ok) {
          const t = await imgsRes.text();
          throw new Error(`Erreur récupération images (${imgsRes.status}): ${t}`);
        }
        const imgs = await imgsRes.json();
        if (Array.isArray(imgs) && imgs.length > 0) {
          const photoId = imgs[0]?.id;
          if (photoId) {
            const patchRes = await fetch(`${API_URL}/articles/${articleId}/`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json", Accept: "application/json" },
              body: JSON.stringify({ vignette: photoId }),
            });
            if (!patchRes.ok) {
              const t = await patchRes.text();
              throw new Error(`Erreur application vignette (${patchRes.status}): ${t}`);
            }
          }
        }
      }

      setMessage("Article créé avec succès.");
      resetForm();
    } catch (err) {
      console.error(err);
      setError(err.message || "Erreur inconnue");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="admin-articles-page">
      <div className="admin-articles-header">
        <h2 className="admin-articles-title">Nouvel article</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" onClick={() => navigate("/admin/article")} className="btn-outline">Retour à la liste</button>
          <button type="button" onClick={() => navigate("/admin")} className="btn-outline">Accueil admin</button>
        </div>
      </div>

      <div className="admin-articles-card">
        <form onSubmit={handleCreateArticle} className="admin-articles-form">
          <label className="admin-articles-label">
            Titre*
            <input
              className="admin-articles-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de l'article"
              required
            />
          </label>

          <label className="admin-articles-label">
            Description
            <textarea
              className="admin-articles-textarea"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Description courte"
              rows={4}
            />
          </label>

          <label className="admin-articles-label">
            Vignette (image)
            <input
              className="admin-articles-file"
              type="file"
              accept="image/*"
              onChange={(e) => setThumbFile(e.target.files?.[0] || null)}
            />
          </label>

          {thumbPreview ? (
            <div className="vignette-preview">
              <div className="vignette-preview-label">Aperçu de la vignette</div>
              <img src={thumbPreview} alt="aperçu vignette" className="vignette-preview-img" />
            </div>
          ) : null}

          <label className="admin-articles-label">
            Fichier PDF
            <input
              className="admin-articles-file"
              type="file"
              accept="application/pdf"
              onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
            />
          </label>

          <div className="admin-articles-actions">
            <button type="submit" disabled={submitting} className="btn-outline">
              {submitting ? "En cours..." : "Créer l'article"}
            </button>
            {message ? <div className="feedback-success">{message}</div> : null}
            {error ? <div className="feedback-error">{error}</div> : null}
          </div>
        </form>
      </div>
    </div>
  );
}
