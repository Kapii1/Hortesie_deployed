import React, { useEffect, useRef, useState } from "react";
import "./Project.css";
import $ from 'jquery';
import Card from "@mui/material/Card";
import { AnimatePresence, motion } from "framer-motion";
import Grid from "@mui/material/Grid";
import { Routes, Route } from "react-router-dom";
import { Projet } from "./OneProject";
import { GridComponent } from "react-spring-animated-grid";
import { SpringGrid } from "react-stonecutter";
import Details from "./Details";
import { Link, useLocation } from "react-router-dom";
import { after } from "underscore";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { API_URL } from "../../url";





export function Projets() {
  const location = useLocation();
  const [items, setItems] = useState([]);
  const gridRef = useRef()
  const onLoad = after(items.length, () => {
    gridRef.current.className += " projets-container-loaded"
  });

  const fetchData = async () => {
    try {
      const res = await fetch(API_URL + "/projets", { method: "GET" });
      const json = await res.json();
      setItems(json);
      return json;
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="Grid-container"
      id="grid-projet">
      <Grid
        ref={gridRef}
        className="projets-container"
        id="projets-grid-container"
        container
        spacing={{ xs: 2, sm: 4, md: 6 }}
        columns={{ xs: 4, sm: 9, md: 11 }}
        justifyContent="center"
        alignItems="center"
      >
        {items &&
          items.map((item, i) => (
            <Grid className="projet" item xs={2} sm={4} md={2.5}>
              <Link to={item.id}>
                <motion.div key={i}>
                  <Projet
                    i={i}
                    id={item.id}
                    nom_fr={item.nom}
                    path_image={item.vignette}
                    description={item.description}
                    onLoad={onLoad}
                  />
                </motion.div>
              </Link>
            </Grid>
          ))}
      </Grid>
      <Routes location={location} key={location.key}>
        <Route path="/" />
        <Route path="/:id" element={<Details />} />
      </Routes>
    </div>
  );
}
