import React, { Component } from "react";
import "./Project.css";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea, CardHeader } from "@mui/material";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./OneProject.css";

export function Projet(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setisLoaded] = useState(false);
  const [allLoaded, setAllLoaded] = [props.allLoaded, props.setAllLoaded]
  return (
    <div
      onClick={() => setIsOpen(!isOpen)}
      className="card"
      style={{ borderRadius: "7px" }}
    >
      <div className="sub-card"
        style={isLoaded ? { opacity: '1' } : { opacity: '0' }}>
        <div className="title-container">
          <div className="title-card">{props.nom_fr}</div>
        </div>

        <img
          layout="position"
          className="vignette"
          onLoad={() => {
            props.setisLoaded(true)
            setisLoaded(true)
          }}
          src={props.path_image}
        ></img>
      </div>
    </div>
  );
}
