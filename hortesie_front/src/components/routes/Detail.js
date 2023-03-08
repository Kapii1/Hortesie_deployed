import React, { useRef } from "react";
import "./Detail.css";
import { Link } from "react-router-dom";
import { SimpleSlider } from "./SimpleSlider";
import { motion } from "framer-motion";
import { Carousel } from 'react-responsive-carousel';
import styles from 'react-responsive-carousel/lib/styles/carousel.min.css';
import {
  MDBCarousel,
  MDBCarouselItem,
} from 'mdb-react-ui-kit';
import CustomCarouselItem from "./CustomCarouselItem";
import { after } from "underscore";
export function Detail(props) {

  const carouselRef = useRef()
  const onAllLoad = after(props.item.length - 1, () => {
    carouselRef.current.className += " projets-container-loaded"
  });
  const photoTemplate = (photo) => {
    return (
      <img className="image-carousel" src={photo.nom}></img>
    )
  }
  return (
    <div className="detail-container">
      <div ref={carouselRef} className="carousel-container">
        <Carousel onClickItem={() => { console.log("test") }}
          showThumbs={false}
          emulateTouch
          infiniteLoop
          showStatus={false}
          showIndicators={false}
          dynamicHeight >
          {props.item.slice(1).map((items, index) =>
            <CustomCarouselItem src={items.nom} onAllLoad={onAllLoad} index={index} />
          )}
        </Carousel>
      </div>

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
