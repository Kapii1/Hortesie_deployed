import React, { useEffect, useRef, useState } from "react";
import "./Project.css";
import Card from "@mui/material/Card";
import { AnimatePresence, motion } from "framer-motion";
import Grid from "@mui/material/Grid";
import { Routes, Route } from "react-router-dom";
import { Projet } from "./OneProject";
import { GridComponent } from "react-spring-animated-grid";
import { SpringGrid } from "react-stonecutter";
import Details from "./Details";
import { Link, useLocation } from "react-router-dom";

import { TransitionGroup, CSSTransition } from "react-transition-group";
var items;
fetch("http://localhost:3001/projets", { method: "GET" })
  .then((response) => response.json())
  .then((json) => {
    console.log(json)
    items = json;
  });

const Projets = (props) => {
  const location = useLocation();
  return (
    <div className="Grid-container">
      <Grid
        className="projets-container"
        container
        spacing={10}
        justifyContent="center"
        alignItems="center"
      >
        {items.map((item, i) => (
          <Grid className="projet" item xs={3}>
            <Link to={item.id}>
              <motion.div key={i}>
                <Projet
                  id={item.id}
                  nom_fr={item.nom}
                  path_image={item.vignette}
                  description={item.description}
                />
              </motion.div>
            </Link>
          </Grid>
        ))}
      </Grid>
      <AnimatePresence>
        <Routes location={location} key={location.key}>
          <Route path="/" />
          <Route path="/:id" element={<Details />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
};
export default Projets;
