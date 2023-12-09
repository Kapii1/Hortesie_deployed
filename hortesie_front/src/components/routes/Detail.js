import React, { useRef, useState } from "react";
import "./Detail.css";
import { Link } from "react-router-dom";
import { SimpleSlider } from "./SimpleSlider";
import { motion } from "framer-motion";
import { Carousel } from 'react-responsive-carousel';
import CustomCarouselItem from "./CustomCarouselItem";
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { after } from "underscore";
import FullScreenCarousel from "./FullscreenCarousel";
export function Detail(props) {

  const carouselRef = useRef()
  const onAllLoad = after(props.item.length - 1, () => {
    carouselRef.current.className += " projets-container-loaded"
  });

  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
    setIsFullScreen(true);
  };
  return (
    <div className="detail-container">

      <motion.div className="text-container">
        <div className="detail-title">{props.item[0].nom.toUpperCase()}</div>
        <div className="detail-ville">
          <div className="ville-p">{props.item[0].ville} </div>
          <div className="annee-p">{props.item[0].annee}</div>
        </div>
        <div className="description" dangerouslySetInnerHTML={{ __html: props.item[0].description }} />

      </motion.div>
      <div ref={carouselRef} className="carousel-container">
        <Carousel onClickItem={handleFullScreenClick}
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

      {/* Display the full-screen carousel when isFullScreen is true */}
      {isFullScreen && (
        <FullScreenCarousel images={props.item.slice(1)} onClose={() => setIsFullScreen(false)} />
      )}
      <Link className="leave" to="/projets">
        <img src={require("./close.png")} alt="" className="leave"></img>
      </Link>
    </div>
  );
}
