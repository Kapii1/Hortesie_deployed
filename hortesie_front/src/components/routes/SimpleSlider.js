import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./SimpleSlider.css";
import { refType } from "@mui/utils";
export function SimpleSlider(props) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
  };
  return (
    <Slider {...settings}>
      {props.images.map((item, i) => {
        if (item.nom !== "") {
          return (
            <div key={i}>
              <img
                className="image-nested"
                src={item.nom}
                key={item.nom}
                layout="responsive"
                alt=""
              />
            </div>
          );
        }
      })}
    </Slider>
  );
}
