import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./FullscreenCarousel.css";
import { Dialog } from "@mui/material";
const FullScreenCarousel = ({ images, onClose }) => {
  const [open, setOpen] = React.useState(true);
  const handleClick = () => {
    setOpen(false);
    onClose();
  };
  return (
      <Dialog
        open={open}
        onClose={handleClick}
      >
        <Carousel
          showThumbs={false}
          showIndicators={false}
          emulateTouch
          infiniteLoop
        >
          {/* Render carousel content here */}
          {images.map((image, index) => (
            < >
              <img
                className="image-display"
                src={"/api" + image.file}
                alt={`Slide ${index + 1}`}
                key={index}
              />
            </>
          ))}
        </Carousel>
      </Dialog>
  );
};

export default FullScreenCarousel;
