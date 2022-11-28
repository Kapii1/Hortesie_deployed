import React, { Component } from "react";
import "./Project.css";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea, CardHeader } from "@mui/material";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./OneProject.css";

/**
 * @framerSupportedLayoutHeight fixed
 */
export function Projet(props) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <motion.div
      onClick={() => setIsOpen(!isOpen)}
      className="card"
      style={{ borderRadius: "7px" }}
    >
      <motion.div className="sub-card">
        <div className="title-container"><motion.div className="title-card">{props.nom_fr}</motion.div></div>
        <motion.img
          layout="position"
          className="vignette"
          src={process.env.PUBLIC_URL+ "/" +props.path_image}
        ></motion.img>
      </motion.div>
    </motion.div>
  );
}
