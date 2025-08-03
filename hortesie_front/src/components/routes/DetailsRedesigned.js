import React, { useEffect, useState, useCallback, useMemo } from "react";
import "./DetailsRedesigned.css";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { DetailRedesigned } from "./DetailRedesigned";
import { API_URL } from "../../url";
import { 
  CircularProgress, 
  Alert, 
  Skeleton, 
  Box, 
  Typography, 
  IconButton,
  Fade
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";

// Custom hook for project data management
const useProjectDetails = (projectId) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

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
        if (response.status === 404) {
          throw new Error("Projet non trouvé");
        } else if (response.status >= 500) {
          throw new Error("Erreur serveur. Veuillez réessayer plus tard.");
        } else {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
      }

      const data = await response.json();
      setProject(data);
    } catch (err) {
      console.error("Error fetching project:", err);
      setError(err.message || "Une erreur est survenue lors du chargement du projet");
    } finally {
      setLoading(false);
    }
  }, [projectId, retryCount]);

  const retry = useCallback(() => {
    setRetryCount(prev => prev + 1);
  }, []);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  return { project, loading, error, retry, refetch: fetchProject };
};

// Loading skeleton component
const ProjectDetailsSkeleton = () => (
  <Box className="details-skeleton">
    <Box className="skeleton-header">
      <Skeleton variant="circular" width={40} height={40} />
      <Box sx={{ flex: 1, ml: 2 }}>
        <Skeleton variant="text" height={40} width="60%" />
        <Skeleton variant="text" height={20} width="40%" />
      </Box>
    </Box>
    
    <Box className="skeleton-content">
      <Box className="skeleton-text">
        <Skeleton variant="text" height={60} width="80%" />
        <Skeleton variant="text" height={30} width="50%" />
        <Skeleton variant="rectangular" height={200} sx={{ mt: 2 }} />
      </Box>
      
      <Box className="skeleton-carousel">
        <Skeleton variant="rectangular" height={400} />
        <Box sx={{ display: 'flex', gap: 1, mt: 1, justifyContent: 'center' }}>
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} variant="rectangular" width={60} height={40} />
          ))}
        </Box>
      </Box>
    </Box>
  </Box>
);

// Error component with retry functionality
const ProjectDetailsError = ({ error, onRetry, onBack }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="details-error"
  >
    <Alert 
      severity="error" 
      className="error-alert"
      action={
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            color="inherit"
            size="small"
            onClick={onRetry}
            title="Réessayer"
          >
            <RefreshIcon />
          </IconButton>
          <IconButton
            color="inherit"
            size="small"
            onClick={onBack}
            title="Retour"
          >
            <ArrowBackIcon />
          </IconButton>
        </Box>
      }
    >
      <Typography variant="h6" gutterBottom>
        Erreur de chargement
      </Typography>
      <Typography variant="body2">
        {error}
      </Typography>
    </Alert>
  </motion.div>
);

// Main Details component
function DetailsRedesigned() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { project, loading, error, retry } = useProjectDetails(id);

  // Navigation handlers
  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleBackToProjects = useCallback(() => {
    navigate('/projets');
  }, [navigate]);

  // Memoized project data for performance
  const projectData = useMemo(() => {
    if (!project) return null;
    
    return {
      ...project,
      // Normalize property names for consistency
      city: project.city || project.ville,
      formattedDate: project.date ? new Date(project.date).getFullYear() : null,
    };
  }, [project]);

  // Loading state
  if (loading) {
    return (
      <div className="details-container-redesigned">
        <Fade in={loading} timeout={300}>
          <div>
            <ProjectDetailsSkeleton />
          </div>
        </Fade>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="details-container-redesigned">
        <ProjectDetailsError 
          error={error}
          onRetry={retry}
          onBack={handleBack}
        />
      </div>
    );
  }

  // Success state
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="project-details"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="details-container-redesigned"
      >
        {projectData && (
          <DetailRedesigned 
            item={projectData}
            onBack={handleBackToProjects}
            onNavigateBack={handleBack}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default DetailsRedesigned;