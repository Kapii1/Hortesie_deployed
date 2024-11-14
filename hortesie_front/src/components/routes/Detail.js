import React, { useRef, useState } from "react";
import "./Detail.css";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Carousel } from 'react-responsive-carousel';
import CustomCarouselItem from "./CustomCarouselItem";
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { after } from "underscore";
import FullScreenCarousel from "./FullscreenCarousel";
import useAPI from "./list-admin/apiService";
import useSWR from "swr";
export function Detail(props) {

  const carouselRef = useRef()
  const onAllLoad = after(props.item.length - 1, () => {
    carouselRef.current.className += " projets-container-loaded"
  });

  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
    setIsFullScreen(true);
  };
  const { getProjectImages } = useAPI();
  const {
    data: images,
    error: imagesError,
    mutate,
  } = useSWR(`/api/projects/${props.item.id}/images/`, () => getProjectImages(props.item.id));
  return (
    <div className="detail-container">

      <motion.div className="text-container">
        <div className="detail-title">{props.item.name?.toUpperCase()}</div>
        <div className="detail-ville">
          <div className="ville-p">{props.item?.ville} </div>
          <div className="annee-p">{new Date(props.item?.date).getFullYear()}</div>
        </div>
        <div className="description" dangerouslySetInnerHTML={{ __html: props.item?.description }} />

      </motion.div>
      <div ref={carouselRef} className="carousel-container projets-container-loaded">
        <Carousel onClickItem={handleFullScreenClick}
          showThumbs={false}
          emulateTouch
          infiniteLoop
          showStatus={false}
          showIndicators={false} >
          {images && images.map((items, index) =>
            <CustomCarouselItem src={"/api"+items.file} onAllLoad={onAllLoad} index={index} />
          )}
        </Carousel>
      </div>

      {/* Display the full-screen carousel when isFullScreen is true */}
      {isFullScreen && (
        <FullScreenCarousel images={images} onClose={() => setIsFullScreen(false)} />
      )}
      <Link className="leave" to="/projets">
        <img src={require("./close.png")} alt="" className="leave"></img>
      </Link>
    </div>
  );
}
