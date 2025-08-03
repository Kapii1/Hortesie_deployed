import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import ReorderIcon from "@mui/icons-material/Reorder";
import { 
  Button, 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  IconButton, 
  TextField, 
  InputAdornment,
  Chip,
  Box,
  Grid,
  Avatar,
  Skeleton
} from "@mui/material";
import { API_URL } from "../../../url";
import Del_button from "./Del_button";
import "./List-Project-admin-redesigned.css";

function useForceUpdate() {
  const [value, setValue] = useState(0);
  return () => setValue((value) => value + 1);
}


export function ListProjectAdminRedesigned() {
  const navigate = useNavigate();
  const [reRender, setReRender] = useState(false);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const forceUpdate = useForceUpdate();

  const handleReRender = () => {
    setReRender(!reRender);
  };

  async function fetchData() {
    setLoading(true);
    try {
      const response = await fetch(API_URL + "/projects/", { method: "GET" });
      const responseJson = await response.json();
      setData(responseJson);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    fetchData();
  }, [reRender]);

  const delProjet = async (id) => {
    try {
      const res = await fetch(API_URL + `/projects/${id}/`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      fetchData();
      forceUpdate();
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const filteredData = data?.filter(item =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.ville?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ProjectCard = ({ item, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="project-card-wrapper"
    >
      <Card className="project-card" elevation={2}>
        <div className="card-header">
          <Chip 
            label={`Position #${item.position}`} 
            size="small" 
            className="position-chip"
          />
        </div>
        
        <div className="card-content-wrapper">
          <CardMedia
            component="img"
            className="project-thumbnail"
            image={item.vignette}
            alt={item.name}
          />
          
          <CardContent className="project-info">
            <Typography variant="h6" className="project-title">
              {item.name}
            </Typography>
            <Typography variant="body2" className="project-city">
              📍 {item.ville}
            </Typography>
            <Typography variant="caption" className="project-type">
              {item.type === 'projet' ? '🏗️ Projet' : '📋 Étude'}
            </Typography>
          </CardContent>
          
          <div className="card-actions">
            <IconButton
              component={Link}
              to={`/admin/projets/${item.id}/edit`}
              className="edit-button"
              size="small"
            >
              <EditIcon />
            </IconButton>
            <Del_button 
              item={item.id} 
              delFunction={delProjet} 
              reRender={handleReRender}
              className="delete-button-modern"
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );

  const LoadingSkeleton = () => (
    <Grid container spacing={3}>
      {[...Array(6)].map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card className="project-card">
            <Skeleton variant="rectangular" height={120} />
            <CardContent>
              <Skeleton variant="text" height={32} />
              <Skeleton variant="text" height={20} width="60%" />
              <Skeleton variant="text" height={16} width="40%" />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <div className="admin-container-redesigned">
      <div className="admin-header">
        <div className="header-content">
          <Typography variant="h4" className="page-title">
            Gestion des Projets
          </Typography>
          <Typography variant="body1" className="page-subtitle">
            {data?.length || 0} projet{(data?.length || 0) !== 1 ? 's' : ''}
          </Typography>
        </div>
        
        <div className="header-actions">
          <TextField
            placeholder="Rechercher un projet..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            className="search-field"
          />
          
          <Button
            component={Link}
            to="/admin/projets/positions"
            variant="outlined"
            startIcon={<ReorderIcon />}
            className="add-button"
            size="large"
          >
            Gérer Positions
          </Button>
          
          <Button
            component={Link}
            to="/admin/projets/new"
            variant="contained"
            startIcon={<AddIcon />}
            className="add-button"
            size="large"
          >
            Nouveau Projet
          </Button>
        </div>
      </div>

      <div className="projects-container">
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <div className="projects-grid">
            {filteredData && filteredData.map((item, index) => (
              <ProjectCard 
                key={item.id}
                item={item} 
                index={index}
              />
            ))}
          </div>
        )}
        
        {!loading && filteredData?.length === 0 && (
          <div className="empty-state">
            <Typography variant="h6" className="empty-title">
              {searchTerm ? 'Aucun projet trouvé' : 'Aucun projet'}
            </Typography>
            <Typography variant="body2" className="empty-subtitle">
              {searchTerm 
                ? 'Essayez de modifier votre recherche'
                : 'Commencez par créer votre premier projet'
              }
            </Typography>
            {!searchTerm && (
              <Button
                component={Link}
                to="/admin/projets/new"
                variant="outlined"
                startIcon={<AddIcon />}
                className="empty-action"
              >
                Créer un projet
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}