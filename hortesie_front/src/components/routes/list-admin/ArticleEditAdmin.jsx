import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../../url";
import "./ArticlesAdmin.css";

export default function ArticleEditAdmin() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [date, setDate] = useState("");
  const [currentVignette, setCurrentVignette] = useState(null);
  const [currentPdf, setCurrentPdf] = useState(null);

  const [newVignetteFile, setNewVignetteFile] = useState(null);
  const [newPdfFile, setNewPdfFile] = useState(null);

  const newVignettePreview = useMemo(() => {
    return newVignetteFile ? URL.createObjectURL(newVignetteFile) : null;
  }, [newVignetteFile]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_URL}/articles/${id}/`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setTitle(data.title || "");
        setSummary(data.summary || "");
        setDate(data.date || "");
        setCurrentVignette(data.vignette || null);
        setCurrentPdf(data.pdf || null);
      } catch (e) {
        setError(e.message || "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function handleSave(e) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      // 1. Update basic fields (JSON PATCH)
      const patchBody = {};
      if (title != null) patchBody.title = title;
      if (summary != null) patchBody.summary = summary;
      if (date) patchBody.date = date; // optional editing

      if (Object.keys(patchBody).length > 0) {
        const res = await fetch(`${API_URL}/articles/${id}/`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(patchBody),
        });
        if (!res.ok) {
          const t = await res.text();
          throw new Error(`Erreur mise à jour (${res.status}): ${t}`);
        }
      }

      // 2. Replace PDF if a new file is selected (multipart PATCH)
      if (newPdfFile) {
        const fd = new FormData();
        fd.append("pdf", newPdfFile);
        const pdfRes = await fetch(`${API_URL}/articles/${id}/`, {
          method: "PATCH",
          body: fd,
        });
        if (!pdfRes.ok) {
          const t = await pdfRes.text();
          throw new Error(`Erreur mise à jour PDF (${pdfRes.status}): ${t}`);
        }
      }

      // 3. If a new vignette is selected, upload and set as vignette
      if (newVignetteFile) {
        const uploadFd = new FormData();
        uploadFd.append("file", newVignetteFile);
        const uploadRes = await fetch(`${API_URL}/articles/${id}/add_image/`, {
          method: "POST",
          body: uploadFd,
        });
        if (!uploadRes.ok) {
          const t = await uploadRes.text();
          throw new Error(`Erreur upload vignette (${uploadRes.status}): ${t}`);
        }

        // Get images and match by filename
        const imgsRes = await fetch(`${API_URL}/articles/${id}/images/`);
        if (!imgsRes.ok) {
          const t = await imgsRes.text();
          throw new Error(`Erreur récupération images (${imgsRes.status}): ${t}`);
        }
        const imgs = await imgsRes.json();
        let targetPhoto = null;
        if (Array.isArray(imgs) && imgs.length > 0) {
          targetPhoto = imgs.find((img) => img.filename === newVignetteFile.name) || imgs[imgs.length - 1];
        }
        if (targetPhoto?.id) {
          const setRes = await fetch(`${API_URL}/articles/${id}/`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({ vignette: targetPhoto.id }),
          });
          if (!setRes.ok) {
            const t = await setRes.text();
            throw new Error(`Erreur application vignette (${setRes.status}): ${t}`);
          }
          setCurrentVignette(`/api${targetPhoto.file}`);
          setNewVignetteFile(null);
        }
      }

      setMessage("Modifications enregistrées.");
    } catch (err) {
      console.error(err);
      setError(err.message || "Erreur inconnue");
    }
  }

  return (
    <div className="admin-articles-page">
      <div className="admin-articles-header">
        <h2 className="admin-articles-title">Modifier l'article</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" className="btn-outline" onClick={() => navigate("/admin/article")}>
            Retour à la liste
          </button>
          <button type="button" className="btn-outline" onClick={() => navigate("/admin")}>Accueil admin</button>
        </div>
      </div>

      <div className="admin-articles-card">
        {loading ? (
          <div>Chargement...</div>
        ) : error ? (
          <div className="feedback-error">{error}</div>
        ) : (
          <form onSubmit={handleSave} className="admin-articles-form">
            <label className="admin-articles-label">
              Titre*
              <input
                className="admin-articles-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </label>

            <label className="admin-articles-label">
              Description
              <textarea
                className="admin-articles-textarea"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={4}
              />
            </label>

            <label className="admin-articles-label">
              Date
              <input
                className="admin-articles-input"
                type="date"
                value={date || ""}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>

            <div className="vignette-preview">
              <div className="vignette-preview-label">Vignette actuelle</div>
              {currentVignette ? (
                <img src={currentVignette} alt="vignette" className="vignette-preview-img" />
              ) : (
                <div className="vignette-preview-placeholder">Aucune</div>
              )}
            </div>

            <label className="admin-articles-label">
              Nouvelle vignette (image)
              <input
                className="admin-articles-file"
                type="file"
                accept="image/*"
                onChange={(e) => setNewVignetteFile(e.target.files?.[0] || null)}
              />
            </label>

            {newVignettePreview ? (
              <div className="vignette-preview">
                <div className="vignette-preview-label">Aperçu de la nouvelle vignette</div>
                <img src={newVignettePreview} alt="preview" className="vignette-preview-img" />
              </div>
            ) : null}

            <div className="vignette-preview">
              <div className="vignette-preview-label">Fichier PDF actuel</div>
              {currentPdf ? (
                <a className="article-link" href={currentPdf} target="_blank" rel="noreferrer">Voir le PDF</a>
              ) : (
                <div className="vignette-preview-placeholder">Aucun</div>
              )}
            </div>

            <label className="admin-articles-label">
              Remplacer le PDF
              <input
                className="admin-articles-file"
                type="file"
                accept="application/pdf"
                onChange={(e) => setNewPdfFile(e.target.files?.[0] || null)}
              />
            </label>

            <div className="admin-articles-actions">
              <button type="submit" className="btn-outline">Enregistrer</button>
              {message ? <div className="feedback-success">{message}</div> : null}
              {error ? <div className="feedback-error">{error}</div> : null}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
