import React, { Component } from "react";
import "./Project.css";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea, CardHeader } from "@mui/material";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./OneProject.css";
import Image from "./Image";

export function Projet(props) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      onClick={() => setIsOpen(!isOpen)}
      className="card-grid"
    >
      <div className="sub-card"
      >
        <div className="title-container">
          <div className="title-card">{props.nom_fr}</div>
        </div>
        <Image src={props.path_image} className="vignette" load={props.onLoad}></Image>
      </div>
    </div>
  );
}
