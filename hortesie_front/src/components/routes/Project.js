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
import { API_URL } from "../../url";

export function Projets(props) {
  const location = useLocation();
  const [items, setItems ] = useState();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(API_URL + "/projets", { method: "GET" });
        const json = await res.json();
        console.log(json);
        setItems(json)
        return json
      } catch (error) {
        console.log("error", error);
      }
    };
    const a =  fetchData();
    console.log('a'+ a);
  }, [setItems]);
  return (
    <div className="Grid-container">
      <Grid
        className="projets-container"
        container
        spacing={6}
        justifyContent="center"
        alignItems="center"
      >
        {items &&
          items.map((item, i) => (
            <Grid className="projet" item xl={2.5} xs={7} >
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
      <Routes location={location} key={location.key}>
        <Route path="/" />
        <Route path="/:id" element={<Details />} />
      </Routes>
    </div>
  );
}
