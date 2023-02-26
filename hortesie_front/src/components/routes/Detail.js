import React from "react";
import "./Detail.css";
import { Link } from "react-router-dom";
import { SimpleSlider } from "./SimpleSlider";
import { motion } from "framer-motion";
import { Carousel } from 'primereact/carousel';
import {
  MDBCarousel,
  MDBCarouselItem,
} from 'mdb-react-ui-kit';
export function Detail(props) {
  console.log(props.item.slice(1));
  const photoTemplate = (photo) => {
    console.log("jjjjj", photo)
    return (
      <img className="image-carousel" src={photo.nom}></img>
    )
  }
  return (
    <div className="detail-container">
      <MDBCarousel showControls showIndicators interval={500000} className='image-carousel'>
        {props.item.slice(1).map((items, index) => {
          return (
            <MDBCarouselItem
              className='d-block img-carousel'
              itemId={index + 1}
              src={items.nom}
              alt='...'
            />
          )
        })}
      </MDBCarousel>


      <motion.div className="text-container">
        <div className="detail-title">{props.item[0].nom}</div>
        <div className="detail-ville">
          <div className="ville-p">{props.item[0].ville} </div>
          <div className="annee-p">{props.item[0].annee}</div>
        </div>
        <div className="description">{props.item[0].description}</div>
        <Link className="leave" to="/projets">
          <img src={require("./close.png")} alt="" className="leave"></img>
        </Link>
      </motion.div>
    </div>
  );
}
