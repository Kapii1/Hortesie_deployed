import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Alert,
  CircularProgress,
  IconButton,
  Chip
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import SaveIcon from "@mui/icons-material/Save";
import { API_URL } from "../../../url";
import "./ProjectPositionManager.css";

export function ProjectPositionManager() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL + "/projects/", { method: "GET" });
      const responseJson = await response.json();
      // Sort by position to ensure correct order
      const sortedProjects = responseJson.sort((a, b) => a.position - b.position);
      setProjects(sortedProjects);
      setError(null);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Erreur lors du chargement des projets");
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(projects);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update positions
    const updatedItems = items.map((item, index) => ({
      ...item,
      position: index
    }));

    setProjects(updatedItems);
    setHasChanges(true);
    setSuccess(false);
  };

  const savePositions = async () => {
    setSaving(true);
    setError(null);
    
    try {
      // Update positions for all projects
      const updatePromises = projects.map((project, index) => 
        fetch(API_URL + "/projects/update_position/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            project_id: project.id,
            new_position: index
          })
        })
      );

      await Promise.all(updatePromises);
      
      setSuccess(true);
      setHasChanges(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving positions:", error);
      setError("Erreur lors de la sauvegarde des positions");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="position-manager-container">
        <div className="loading-container">
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Chargement des projets...
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="position-manager-container">
      <div className="position-manager-header">
        <div className="header-content">
          <IconButton
            component={Link}
            to="/admin/projets"
            className="back-button"
          >
            <ArrowBackIcon />
          </IconButton>
          <div>
            <Typography variant="h4" className="page-title">
              Gestion des Positions
            </Typography>
            <Typography variant="body1" className="page-subtitle">
              Glissez-déposez les projets pour modifier leur ordre d'affichage
            </Typography>
          </div>
        </div>
        
        <Button
          variant="contained"
          startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
          onClick={savePositions}
          disabled={!hasChanges || saving}
          className="save-button"
        >
          {saving ? "Sauvegarde..." : "Sauvegarder"}
        </Button>
      </div>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Positions sauvegardées avec succès !
        </Alert>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="projects">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`projects-list ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
            >
              {projects.map((project, index) => (
                <Draggable key={project.id} draggableId={project.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`project-item ${snapshot.isDragging ? 'dragging' : ''}`}
                    >
                      <Card className="project-card">
                        <CardContent className="project-content">
                          <div className="drag-handle" {...provided.dragHandleProps}>
                            <DragIndicatorIcon />
                          </div>
                          
                          <div className="project-info">
                            <div className="project-header">
                              <Typography variant="h6" className="project-position-name">
                                {project.name}
                              </Typography>
                              <Chip 
                                label={`Position ${index + 1}`} 
                                size="small" 
                                color="primary"
                                className="position-chip"
                              />
                            </div>
                            
                            <Typography variant="body2" className="project-details">
                              📍 {project.city} • {project.type === 'projet' ? '🏗️ Projet' : '📋 Étude'}
                            </Typography>
                            
                            {project.description && (
                              <Typography variant="body2" className="project-description">
                                {project.description.length > 100 
                                  ? `${project.description.substring(0, 100)}...`
                                  : project.description
                                }
                              </Typography>
                            )}
                          </div>
                          

                        </CardContent>
                      </Card>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {projects.length === 0 && (
        <div className="empty-state">
          <Typography variant="h6">Aucun projet trouvé</Typography>
          <Typography variant="body2">
            Créez des projets pour pouvoir gérer leurs positions.
          </Typography>
          <Button
            component={Link}
            to="/admin/projets/new"
            variant="outlined"
            sx={{ mt: 2 }}
          >
            Créer un projet
          </Button>
        </div>
      )}
    </div>
  );
}