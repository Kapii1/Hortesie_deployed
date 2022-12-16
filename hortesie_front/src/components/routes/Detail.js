import React from "react";
import "./Detail.css";
import { Link } from "react-router-dom";
import { SimpleSlider } from "./SimpleSlider";
import { motion } from "framer-motion";

export function Detail(props) {
  console.log(props.item.slice(1));
  return (
    <div className="detail-container">
      <motion.div className="img-container">
        <SimpleSlider images={props.item.slice(1)} />
      </motion.div>

      <motion.div className="text-container">
        <div className="detail-title">{props.item[0].nom}</div>
        <div className="detail-ville">
          <p className="ville-p">{props.item[0].ville} </p>
          <p className="annee-p">{props.item[0].annee}</p>
        </div>
        <div className="description">{props.item[0].description}</div>
        <Link className="leave" to="/projets">
          <img src={require("./close.png")} alt="" className="leave"></img>
        </Link>
      </motion.div>
    </div>
  );
}
