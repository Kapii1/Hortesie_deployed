import React, { useState, useCallback, useRef, useEffect, useMemo } from "react";
import "./DetailElegant.css";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import FullScreenCarousel from "./FullscreenCarousel";
import useAPI from "./list-admin/apiService";
import useSWR from "swr";

// Simple image component without complex animations
const ElegantImage = ({ src, alt, onLoad }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = useCallback(() => {
    setLoaded(true);
    if (onLoad) onLoad();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setError(true);
    if (onLoad) onLoad();
  }, [onLoad]);

  return (
    <div className="elegant-image-container">
      {!loaded && !error && (
        <div className="elegant-image-placeholder">
          <div className="elegant-loading-spinner"></div>
        </div>
      )}
      
      {error ? (
        <div className="elegant-image-error">
          <span>Image non disponible</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`elegant-image ${loaded ? 'loaded' : ''}`}
          loading="lazy"
        />
      )}
    </div>
  );
};

// Main DetailElegant component
export function DetailElegant({ item, onBack, onNavigateBack }) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const carouselRef = useRef();
  const descriptionRef = useRef();

  // API integration for images
  const { getProjectImages } = useAPI();
  const {
    data: images,
    error: imagesError,
    isLoading: imagesLoading,
  } = useSWR(
    item?.id ? `/api/projects/${item.id}/images/` : null,
    () => getProjectImages(item.id),
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000,
    }
  );

  // Handlers
  const handleFullScreenClick = useCallback(() => {
    setIsFullScreen(true);
  }, []);

  const handleCloseFullScreen = useCallback(() => {
    setIsFullScreen(false);
  }, []);

  const handleBack = useCallback(() => {
    if (onBack) onBack();
  }, [onBack]);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: item?.name,
        text: item?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  }, [item]);

  // Check for overflow in description section
  useEffect(() => {
    const checkOverflow = () => {
      if (descriptionRef.current) {
        const element = descriptionRef.current;
        const hasScrollableContent = element.scrollHeight > element.clientHeight;
        setHasOverflow(hasScrollableContent);
      }
    };

    // Check overflow on mount and when content changes
    checkOverflow();
    
    // Check overflow on window resize (for mobile orientation changes)
    window.addEventListener('resize', checkOverflow);
    
    return () => {
      window.removeEventListener('resize', checkOverflow);
    };
  }, [item?.description, images]);

  // Format date
  const formattedYear = useMemo(() => {
    return item?.date ? new Date(item.date).getFullYear() : '';
  }, [item?.date]);

  if (!item) {
    return (
      <div className="elegant-detail-container">
        <div className="elegant-loading">
          <div className="elegant-loading-spinner"></div>
          <p>Chargement du projet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="elegant-detail-container">
      {/* Header */}
      <header className="elegant-header">
        <button 
          onClick={handleBack} 
          className="elegant-back-button"
          aria-label="Retour"
        >
          ←
        </button>
        
        <div className="elegant-header-content">
          <h1 className="elegant-title">{item.name}</h1>
          <div className="elegant-meta">
            {item.city && <span className="elegant-location">📍 {item.city}</span>}
            {formattedYear && <span className="elegant-year">{formattedYear}</span>}
          </div>
        </div>

      </header>

      {/* Content */}
      <main className="elegant-content">
        {/* Description */}
        <section 
          ref={descriptionRef}
          className={`elegant-description-section ${hasOverflow ? 'has-overflow' : ''}`}
        >
          <div className="elegant-description">
            {item.description ? (
              <div dangerouslySetInnerHTML={{ __html: item.description }} />
            ) : (
              <p>Aucune description disponible.</p>
            )}
          </div>
        </section>

        {/* Images */}
        <section className="elegant-images-section">
          {imagesLoading ? (
            <div className="elegant-images-loading">
              <div className="elegant-loading-spinner"></div>
              <p>Chargement des images...</p>
            </div>
          ) : imagesError ? (
            <div className="elegant-images-error">
              <p>Erreur lors du chargement des images</p>
            </div>
          ) : images && images.length > 0 ? (
            <div className="elegant-carousel-container">
              <Carousel
                ref={carouselRef}
                onClickItem={handleFullScreenClick}
                showThumbs={false}
                showStatus={false}
                showIndicators={true}
                infiniteLoop={true}
                emulateTouch={true}
                swipeable={true}
                dynamicHeight={false}
                className="elegant-carousel"
              >
                {images.map((image, index) => (
                  <ElegantImage
                    key={index}
                    src={"/api" + image.file}
                    alt={`${item.name} - Image ${index + 1}`}
                  />
                ))}
              </Carousel>
            </div>
          ) : (
            <div className="elegant-no-images">
              <p>Aucune image disponible pour ce projet</p>
            </div>
          )}
        </section>
      </main>

      {/* Full Screen Carousel */}
      {isFullScreen && images && (
        <FullScreenCarousel 
          images={images} 
          onClose={handleCloseFullScreen} 
        />
      )}
    </div>
  );
}