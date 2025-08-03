import React, { useEffect, useState, useCallback, useMemo } from "react";
import "./DetailElegant.css";
import { useParams, useNavigate } from "react-router-dom";
import { DetailElegant } from "./DetailElegant";
import { API_URL } from "../../url";

// Simplified hook for project data management - no blinking
const useProjectDetails = (projectId) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProject = useCallback(async () => {
    if (!projectId) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_URL}/projects/${projectId}/`, {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(response.status === 404 ? "Projet non trouvé" : "Erreur de chargement");
      }

      const data = await response.json();
      setProject(data);
    } catch (err) {
      console.error("Error fetching project:", err);
      setError(err.message || "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  return { project, loading, error, refetch: fetchProject };
};

// Simple loading component - no blinking
const SimpleLoading = () => (
  <div className="elegant-detail-container">
    <div className="elegant-loading">
      <div className="elegant-loading-spinner"></div>
      <p>Chargement du projet...</p>
    </div>
  </div>
);

// Simple error component - no animations
const SimpleError = ({ error, onRetry, onBack }) => (
  <div className="elegant-detail-container">
    <div className="elegant-loading">
      <p style={{ color: '#666666', marginBottom: '1rem' }}>
        {error}
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button 
          onClick={onRetry}
          style={{
            padding: '0.5rem 1rem',
            border: '1px solid #000000',
            background: 'none',
            color: '#000000',
            cursor: 'pointer',
            borderRadius: '4px'
          }}
        >
          Réessayer
        </button>
        <button 
          onClick={onBack}
          style={{
            padding: '0.5rem 1rem',
            border: '1px solid #000000',
            background: '#000000',
            color: '#ffffff',
            cursor: 'pointer',
            borderRadius: '4px'
          }}
        >
          Retour
        </button>
      </div>
    </div>
  </div>
);

// Main Details component - simplified, no blinking
function Details() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { project, loading, error, refetch } = useProjectDetails(id);

  // Navigation handlers
  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleBackToProjects = useCallback(() => {
    navigate('/projets');
  }, [navigate]);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  // Normalize project data
  const projectData = useMemo(() => {
    if (!project) return null;
    
    return {
      ...project,
      city: project.city || project.ville,
    };
  }, [project]);

  // Loading state - simple, no animations
  if (loading) {
    return <SimpleLoading />;
  }

  // Error state - simple, no animations
  if (error) {
    return (
      <SimpleError 
        error={error}
        onRetry={handleRetry}
        onBack={handleBack}
      />
    );
  }

  // Success state - no animations, direct render
  if (projectData) {
    return (
      <DetailElegant 
        item={projectData}
        onBack={handleBackToProjects}
        onNavigateBack={handleBack}
      />
    );
  }

  // Fallback
  return <SimpleLoading />;
}

export default Details;
