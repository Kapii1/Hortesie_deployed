import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import "./Project.css";
import { motion } from "framer-motion";
import { Routes, Route } from "react-router-dom";
import { Projet } from "./OneProject";
import Details from "./Details";
import { Link, useLocation } from "react-router-dom";
import { API_URL } from "../../url";
import { Helmet } from "react-helmet-async";
import { Spinner } from "react-spinner-animated";
import CustomGrid from "./CustomGrid";
import { CustomGridItem } from "./CustomGridItem";

// Custom hook for project data management
const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/projects/`, { method: "GET" });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setProjects(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, loading, error, refetch: fetchProjects };
};

// Custom hook for project filtering
const useProjectFilter = (projects, filter, searchTerm = "") => {
  return useMemo(() => {
    let filtered = [...projects];

    // Apply type filter
    if (filter === "projets") {
      filtered = filtered.filter(item => item.type === "projet");
    } else if (filter === "etudes") {
      filtered = filtered.filter(item => item.type === "etude");
    }

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        (item.name && item.name.toLowerCase().includes(search)) ||
        (item.city && item.city.toLowerCase().includes(search))
      );
    }

    return filtered;
  }, [projects, filter, searchTerm]);
};

export function Projets({ filter }) {
  const location = useLocation();
  const { projects, loading, error } = useProjects();
  const [isLoaded, setIsLoaded] = useState(false);
  const gridRef = useRef();
  
  const filteredProjects = useProjectFilter(projects, filter);

  // Handle loading completion
  useEffect(() => {
    if (!loading && filteredProjects.length > 0) {
      setIsLoaded(true);
      if (gridRef.current) {
        gridRef.current.classList.add("projets-container-loaded");
      }
    }
  }, [loading, filteredProjects.length]);

  const handleProjectLoad = useCallback(() => {
    // Individual project load handler - can be expanded for specific needs
  }, []);

  if (error) {
    return (
      <div className="error-container">
        <p>Erreur lors du chargement des projets: {error}</p>
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

      <div className="Grid-container" id="grid-projet">
        <Helmet>
          <title>Hortésie : Projets</title>
          <link rel="canonical" href="https://hortesie.fr/projets" />
        </Helmet>

        <CustomGrid
          ref={gridRef}
          className="projets-container"
        >
          {filteredProjects.map((item) => (
            <CustomGridItem key={item.id} className="projet">
              <Link to={item.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Projet
                    id={item.id}
                    name={item.name}
                    path_image={item.vignette}
                    description={item.description}
                    onLoad={handleProjectLoad}
                  />
                </motion.div>
              </Link>
            </CustomGridItem>
          ))}
        </CustomGrid>

        <Routes location={location} key={location.key}>
          <Route path="/" />
          <Route path="/:id" element={<Details />} />
        </Routes>
      </div>
    </>
  );
}
