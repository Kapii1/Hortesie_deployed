import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import "./FullscreenCarousel.css"
const FullScreenCarousel = ({ images, onClose }) => {
    return (
        <div className="fullscreen-carousel" >
            <Carousel showThumbs={false}
                showIndicators={false}
                emulateTouch
                dynamicHeight
                infiniteLoop
                className='full-carousel'>
                {/* Render carousel content here */}
                {images.map((image, index) => (
                    <div key={index}>
                        <img className="image-display" src={image.nom} alt={`Slide ${index + 1}`} />
                    </div>
                ))}
            </Carousel>

            {/* Add a button or any element to close full-screen mode */}
            <button onClick={onClose} className='button-leave-fullscreen'>Close Full Screen</button>
        </div>
    );
};

export default FullScreenCarousel;
