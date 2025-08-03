import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import "./DetailRedesigned.css";
import { motion, AnimatePresence } from "framer-motion";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import FullScreenCarousel from "./FullscreenCarousel";
import useAPI from "./list-admin/apiService";
import useSWR from "swr";
import {
  Typography,
  IconButton,
  Box,
  Chip,
  Skeleton,
  Alert,
  Fab,
  Tooltip,
  Zoom,
  CircularProgress
} from "@mui/material";
import {
  ArrowBack,
  Close,
  Fullscreen,
  Share,
  Favorite,
  FavoriteBorder,
  LocationOn,
  CalendarToday,
  Info
} from "@mui/icons-material";

// Custom carousel item with modern loading states
const ModernCarouselItem = ({ src, alt, onLoad, index }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    if (onLoad) onLoad();
  }, [onLoad]);

  const handleImageError = useCallback(() => {
    setImageError(true);
    if (onLoad) onLoad();
  }, [onLoad]);

  return (
    <div className="modern-carousel-item">
      {!imageLoaded && !imageError && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height={400}
          className="carousel-skeleton"
        />
      )}
      
      {imageError ? (
        <Box className="image-error">
          <Info color="disabled" sx={{ fontSize: 48 }} />
          <Typography variant="body2" color="text.secondary">
            Image non disponible
          </Typography>
        </Box>
      ) : (
        <motion.img
          src={src}
          alt={alt}
          onLoad={handleImageLoad}
          onError={handleImageError}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: imageLoaded ? 1 : 0, scale: imageLoaded ? 1 : 0.95 }}
          transition={{ duration: 0.3 }}
          className="carousel-image"
          loading="lazy"
        />
      )}
    </div>
  );
};

// Main DetailRedesigned component
export function DetailRedesigned({ item, onBack, onNavigateBack }) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const carouselRef = useRef();

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
      dedupingInterval: 300000, // 5 minutes
    }
  );

  // Handlers
  const handleFullScreenClick = useCallback(() => {
    setIsFullScreen(true);
  }, []);

  const handleCloseFullScreen = useCallback(() => {
    setIsFullScreen(false);
  }, []);

  const handleFavoriteToggle = useCallback(() => {
    setIsFavorite(prev => !prev);
    // Here you could add API call to save favorite status
  }, []);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.name,
          text: `Découvrez ce projet: ${item.name}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      setShowShareMenu(true);
      setTimeout(() => setShowShareMenu(false), 2000);
    }
  }, [item.name]);

  // Memoized project info
  const projectInfo = useMemo(() => {
    if (!item) return null;

    return {
      title: item.name?.toUpperCase() || 'PROJET SANS NOM',
      city: item.city || item.ville || 'Ville non spécifiée',
      year: item.formattedDate || (item.date ? new Date(item.date).getFullYear() : 'Année non spécifiée'),
      description: item.description || 'Aucune description disponible',
      type: item.type || 'projet',
    };
  }, [item]);

  // Loading state for images
  if (imagesLoading) {
    return (
      <div className="detail-redesigned-container">
        <div className="detail-loading">
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Chargement des images...
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-redesigned-container">
      {/* Header with navigation and actions */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="detail-header"
      >
        <Box className="header-left">
          <Tooltip title="Retour">
            <IconButton
              onClick={onNavigateBack}
              className="nav-button"
              size="large"
            >
              <ArrowBack />
            </IconButton>
          </Tooltip>
        </Box>

        <Box className="header-right">
          <Tooltip title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}>
            <IconButton
              onClick={handleFavoriteToggle}
              className="action-button"
              color={isFavorite ? "error" : "default"}
            >
              {isFavorite ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Partager">
            <IconButton
              onClick={handleShare}
              className="action-button"
            >
              <Share />
            </IconButton>
          </Tooltip>

          <Tooltip title="Fermer">
            <IconButton
              onClick={onBack}
              className="close-button"
              size="large"
            >
              <Close />
            </IconButton>
          </Tooltip>
        </Box>
      </motion.div>

      {/* Main content */}
      <div className="detail-content">
        {/* Project information */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="project-info-section"
        >
          <div className="project-header">
            <Typography variant="h3" className="project-title">
              {projectInfo.title}
            </Typography>
            
            <Box className="project-meta">
              <Chip
                icon={<LocationOn />}
                label={projectInfo.city}
                variant="outlined"
                className="meta-chip"
              />
              <Chip
                icon={<CalendarToday />}
                label={projectInfo.year}
                variant="outlined"
                className="meta-chip"
              />
              <Chip
                label={projectInfo.type === 'projet' ? 'Projet' : 'Étude'}
                color="primary"
                className="type-chip"
              />
            </Box>
          </div>

          <div className="project-description">
            <Typography variant="body1" className="description-text">
              <div dangerouslySetInnerHTML={{ __html: projectInfo.description }} />
            </Typography>
          </div>
        </motion.div>

        {/* Image carousel */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="carousel-section"
          ref={carouselRef}
        >
          {imagesError ? (
            <Alert severity="error" className="images-error">
              Erreur lors du chargement des images
            </Alert>
          ) : images && images.length > 0 ? (
            <div className="modern-carousel-container">
              <Carousel
                onClickItem={handleFullScreenClick}
                showThumbs={true}
                emulateTouch
                infiniteLoop
                showStatus={false}
                showIndicators={true}
                thumbWidth={80}
                className="modern-carousel"
              >
                {images.map((image, index) => (
                  <ModernCarouselItem
                    key={image.id || index}
                    src={"/api" + image.file}
                    alt={`${projectInfo.title} - Image ${index + 1}`}
                    index={index}
                  />
                ))}
              </Carousel>

              {/* Fullscreen button */}
              <Tooltip title="Plein écran">
                <Fab
                  color="primary"
                  className="fullscreen-fab"
                  onClick={handleFullScreenClick}
                  size="medium"
                >
                  <Fullscreen />
                </Fab>
              </Tooltip>
            </div>
          ) : (
            <Box className="no-images">
              <Info color="disabled" sx={{ fontSize: 64 }} />
              <Typography variant="h6" color="text.secondary">
                Aucune image disponible
              </Typography>
            </Box>
          )}
        </motion.div>
      </div>

      {/* Full-screen carousel */}
      <AnimatePresence>
        {isFullScreen && images && (
          <FullScreenCarousel
            images={images}
            onClose={handleCloseFullScreen}
          />
        )}
      </AnimatePresence>

      {/* Share feedback */}
      <Zoom in={showShareMenu}>
        <Alert
          severity="success"
          className="share-feedback"
          onClose={() => setShowShareMenu(false)}
        >
          Lien copié dans le presse-papiers !
        </Alert>
      </Zoom>
    </div>
  );
}