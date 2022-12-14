import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import ListProject from "./ListProject.css";
import OneRow from "./OneRow.css";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
export const OneRowAdmin = (props) => {
  if (props.ind % 2 == 0) {
    return (
      <div className="one-row pair">
        <div className="elem image-elem">
          <img
            className="vignette"
            src={props.vignette}
          ></img>
        </div>
        <div className="elem">{props.nom} </div>
        <div className="elem">{props.ville} </div>
      </div>
    );
  } else {
    return (
      <div className="one-row">
        <div className="elem image-elem">
          <img
            className="vignette"
            src={props.vignette}
          ></img>
        </div>
        <div className="elem">{props.nom} </div>
        <div className="elem">{props.ville} </div>
      </div>
    );
  }
};
