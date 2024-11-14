import React, { Component } from "react";
import { useState } from "react";
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
          <div className="title-card">{props.name}</div>
        </div>
        <Image src={props.path_image} className="vignette" load={props.onLoad}></Image>
      </div>
    </div>
  );
}
