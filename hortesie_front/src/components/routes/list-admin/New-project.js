import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button } from "@mui/material";
import { Store } from 'react-notifications-component';
import { API_URL } from "../../../url";
import { useNavigate } from 'react-router-dom';
import "./New-project.css";

export function New_Project(props) {
  const { onReRender } = props;
  const navigate = useNavigate();
  const s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };
  const id = s4() + s4() + s4();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    city: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBackToList = () => {
    navigate('/admin/projets');
  };

  const format_new_data_to_save = async () => {
    try {
      // Validate required fields
      if (!formData.name.trim()) {
        Store.addNotification({
          title: "Erreur",
          message: "Le nom du projet est requis",
          type: "danger",
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated", "animate__fadeIn"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 5000,
            onScreen: true
          }
        });
        return;
      }

      // Prepare data for API call
      const today = new Date();
      const projectData = {
        id: id,
        name: formData.name,
        description: formData.description || '',
        date: today.toISOString().split('T')[0], // Format as YYYY-MM-DD
        type: "projet",
        city: formData.city || '',
        category: "default", // Required field with default value
        position: 0, // Will be handled by backend
        vignette: null, // Will be set later when images are uploaded
        resume: null
      };

      // Make API call to create project
      const response = await fetch(API_URL + "/projects/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        const createdProject = await response.json();
        
        Store.addNotification({
          title: "Projet créé avec succès",
          message: "Le projet a été créé. Vous pouvez maintenant l'éditer pour ajouter des images.",
          type: "success",
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated", "animate__fadeIn"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 5000,
            onScreen: true
          }
        });

        // Navigate to the edit page for the newly created project
        navigate(`/admin/projets/${createdProject.id}/edit`);
        
        if (onReRender) {
          onReRender();
        }
        
        return createdProject;
      } else {
        const errorData = await response.json();
        console.error('Project creation failed:', errorData);
        
        Store.addNotification({
          title: "Erreur lors de la création",
          message: "Une erreur s'est produite lors de la création du projet. Veuillez réessayer.",
          type: "danger",
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated", "animate__fadeIn"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 5000,
            onScreen: true
          }
        });
      }
    } catch (error) {
      console.error('Error creating project:', error);
      
      Store.addNotification({
        title: "Erreur réseau",
        message: "Impossible de créer le projet. Vérifiez votre connexion.",
        type: "danger",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 5000,
          onScreen: true
        }
      });
    }
  };


  return (
    <div className="new-project-container">
      <div className="new-project-header">
        <Button
          onClick={handleBackToList}
          sx={{ fontSize: 16, marginRight: 2 }}
          startIcon={<ArrowBackIcon />}
          className="back-button"
        >
          Retour à la liste
        </Button>
        <div className="titre-ajout">
          <label>Création d'un nouveau projet</label>
        </div>
      </div>
      
      <div className="button-admin">
        <Button
          onClick={() => format_new_data_to_save()}
          sx={{ fontSize: 20 }}
          endIcon={<SaveIcon sx={{ fontSize: 40 }} />}
          className="save-button"
        >
          Créer le projet
        </Button>
      </div>
      
      <div className="field-container">
        <div className="form-group">
          <label className="label-detail">Titre du projet</label>
          <TextField 
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="form-projet"
            variant="outlined"
            fullWidth
            placeholder="Entrez le nom du projet"
          />
        </div>
        
        <div className="form-group">
          <label className="label-detail">Description du projet</label>
          <TextField
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="form-projet"
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            placeholder="Décrivez le projet"
          />
        </div>

        <div className="form-group">
          <label className="label-detail">Ville du projet</label>
          <TextField
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className="form-projet"
            variant="outlined"
            fullWidth
            placeholder="Ville où se déroule le projet"
          />
        </div>
      </div>
    </div>
  );
}
