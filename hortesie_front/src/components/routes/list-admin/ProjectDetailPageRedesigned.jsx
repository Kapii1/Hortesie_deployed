import React, { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  IconButton, 
  LinearProgress,
  Chip,
  Avatar,
  Skeleton,
  Alert,
  Snackbar,
  Box,
  Grid,
  Paper,
  Divider
} from "@mui/material";
import { useForm } from "antd/es/form/Form";
import dayjs from "dayjs";
import Input from "antd/es/input";
import Form from "antd/es/form";
import DatePicker from "antd/es/date-picker";
import useSWR, { mutate } from "swr";
import { API_URL } from "../../../url";
import TextEditor from "./TextEditor";
import SegmentedControl from "./SegmentedControl";
import "./ProjectDetailPageRedesigned.css";
import CropModal from "./CropModal";

// Enhanced fetcher function with error handling
const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
};

// Custom hook for notifications
const useNotification = () => {
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info',
    progress: null
  });

  const showNotification = useCallback((message, severity = 'info', progress = null) => {
    setNotification({
      open: true,
      message,
      severity,
      progress
    });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, open: false }));
  }, []);

  return { notification, showNotification, hideNotification };
};

// File upload component with progress
const FileUploadZone = ({ onUpload, uploading, uploadProgress }) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    const first = files[0];
    if (!first) return;
    setSelectedFiles([first]);
    onUpload([first]);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const first = files[0];
    if (!first) return;
    setSelectedFiles([first]);
    onUpload([first]);
  };

  return (
    <Paper
      className={`file-upload-zone ${dragOver ? 'drag-over' : ''} ${uploading ? 'uploading' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      elevation={dragOver ? 4 : 1}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        id="file-upload-input"
      />
      <label htmlFor="file-upload-input" className="file-upload-label">
        <CloudUploadIcon className="upload-icon" />
        <Typography variant="h6" className="upload-title">
          {uploading ? 'Upload en cours...' : 'Glissez votre image ici'}
        </Typography>
        <Typography variant="body2" className="upload-subtitle">
          ou cliquez pour sélectionner un fichier
        </Typography>
        {uploading && uploadProgress && (
          <Box className="upload-progress">
            <LinearProgress 
              variant="determinate" 
              value={uploadProgress} 
              className="progress-bar"
            />
            <Typography variant="caption">
              {uploadProgress}% terminé
            </Typography>
          </Box>
        )}
      </label>
    </Paper>
  );
};

// Image gallery component
const ImageGallery = ({ images, projectData, onSetVignette, onDeleteImage, loading }) => {
  if (loading) {
    return (
      <Grid container spacing={2}>
        {[...Array(4)].map((_, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Skeleton variant="rectangular" height={200} />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (!images || images.length === 0) {
    return (
      <Paper className="empty-gallery">
        <ImageIcon className="empty-icon" />
        <Typography variant="h6">Aucune image</Typography>
        <Typography variant="body2" color="textSecondary">
          Ajoutez des images pour ce projet
        </Typography>
      </Paper>
    );
  }

  return (
    <Grid container spacing={2}>
      {images.map((image, index) => (
        <Grid item xs={12} sm={6} md={4} key={image.id}>
          <Card className="image-card">
            <div className="image-container">
              <img 
                src={"/api" + image.file} 
                alt={image.nom}
                className="project-image"
              />
              <div className="image-overlay">
                <IconButton
                  onClick={() => onSetVignette(image.id)}
                  className={`vignette-btn ${"/api" + image.file === projectData?.vignette ? 'active' : ''}`}
                  size="small"
                >
                  <CheckCircleIcon />
                </IconButton>
                <IconButton
                  onClick={() => onDeleteImage(image.id)}
                  className="delete-btn"
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            </div>
            <CardContent className="image-info">
              <Typography variant="caption" noWrap>
                {image.nom}
              </Typography>
              {"/api" + image.file === projectData?.vignette && (
                <Chip 
                  label="Vignette" 
                  size="small" 
                  color="primary" 
                  className="vignette-chip"
                />
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export function ProjectDetailPageRedesigned() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = useForm();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { notification, showNotification, hideNotification } = useNotification();

  // Crop flow state (single-file)
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [currentImageSrc, setCurrentImageSrc] = useState(null);
  const [currentFileType, setCurrentFileType] = useState('image/jpeg');
  const [currentOrigName, setCurrentOrigName] = useState('');

  const resetCropFlow = useCallback(() => {
    try { if (currentImageSrc) URL.revokeObjectURL(currentImageSrc); } catch (_) {}
    setCropModalOpen(false);
    setCurrentImageSrc(null);
    setCurrentFileType('image/jpeg');
    setCurrentOrigName('');
  }, [currentImageSrc]);

  const setCurrentFromFile = useCallback((file) => {
    try { if (currentImageSrc) URL.revokeObjectURL(currentImageSrc); } catch (_) {}
    const objUrl = URL.createObjectURL(file);
    setCurrentImageSrc(objUrl);
    setCurrentFileType(file.type || 'image/jpeg');
    setCurrentOrigName(file.name || 'image');
  }, [currentImageSrc]);

  // Called by FileUploadZone; accepts only the first file and opens modal
  const imageHandler = useCallback((acceptedFiles) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;
    const first = acceptedFiles[0];
    if (!first) return;
    setCurrentFromFile(first);
    setCropModalOpen(true);
  }, [setCurrentFromFile]);

  const handleCropCancel = useCallback(() => {
    resetCropFlow();
  }, [resetCropFlow]);

  const handleCropComplete = useCallback(async (blob) => {
    // Create a File from the blob, keep original extension if possible
    const origName = currentOrigName || 'image';
    const extFromName = origName.includes('.') ? origName.split('.').pop() : null;
    let ext = extFromName;
    if (!ext) {
      if (currentFileType && currentFileType.includes('/')) {
        ext = currentFileType.split('/')[1];
      } else {
        ext = 'jpg';
      }
    }
    const base = origName.replace(/\.[^/.]+$/, '');
    const newName = `${base}-16x9.${ext}`;
    const file = new File([blob], newName, { type: currentFileType || 'image/jpeg' });

    setCropModalOpen(false);
    try { if (currentImageSrc) URL.revokeObjectURL(currentImageSrc); } catch (_) {}
    // upload the single cropped file
    await handleFileUpload([file]);
    resetCropFlow();
  }, [currentOrigName, currentFileType, currentImageSrc, handleFileUpload, resetCropFlow]);

  // SWR for project data
  const { 
    data: projectData, 
    error: projectError, 
    mutate: mutateProject,
    isLoading: projectLoading 
  } = useSWR(`${API_URL}/projects/${id}/`, fetcher);

  // SWR for images
  const { 
    data: images, 
    error: imagesError, 
    mutate: mutateImages,
    isLoading: imagesLoading 
  } = useSWR(`${API_URL}/projects/${id}/images/`, fetcher);

  // Form submission with SWR revalidation
  const handleSave = async () => {
    try {
      setSaving(true);
      showNotification('Sauvegarde en cours...', 'info');

      const formData = form.getFieldsValue();
      const updateData = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        city: formData.city,
        date: formData.annee?.format("YYYY-MM-DD"),
        position: parseInt(formData.position, 10),
      };

      const response = await fetch(`${API_URL}/projects/${id}/`, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        // Optimistic update
        mutateProject();
        showNotification('Projet sauvegardé avec succès!', 'success');
      } else {
        throw new Error('Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Save error:', error);
      showNotification('Erreur lors de la sauvegarde', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Enhanced file upload with progress
  async function handleFileUpload(files) {
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      setUploadProgress(0);
      showNotification(`Upload de ${files.length} fichier(s) en cours...`, 'info', 0);

      const formData = new FormData();
      formData.append("idProjet", id);
      
      files.forEach(file => {
        formData.append("file", file);
      });

      // Simulate progress (in real app, you'd track actual upload progress)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = Math.min(prev + 10, 90);
          showNotification(`Upload en cours... ${newProgress}%`, 'info', newProgress);
          return newProgress;
        });
      }, 200);

      const response = await fetch(`${API_URL}/projects/${id}/add_image/`, {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.ok) {
        // Revalidate images data
        mutateImages();
        showNotification(`${files.length} image(s) uploadée(s) avec succès!`, 'success');
      } else {
        throw new Error('Erreur lors de l\'upload');
      }
    } catch (error) {
      console.error('Upload error:', error);
      showNotification('Erreur lors de l\'upload des images', 'error');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }

  // Set vignette with optimistic update
  const handleSetVignette = async (imageId) => {
    try {
      showNotification('Mise à jour de la vignette...', 'info');
      
      // Optimistic update
      const optimisticData = { ...projectData };
      const targetImage = images.find(img => img.id === imageId);
      if (targetImage) {
        optimisticData.vignette = "/api" + targetImage.file;
      }
      mutateProject(optimisticData, false);

      // Actual API call (you'd need to implement this endpoint)
      const response = await fetch(`${API_URL}/projects/${id}/`, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vignette: imageId }),
      });

      if (response.ok) {
        mutateProject();
        showNotification('Vignette mise à jour!', 'success');
      } else {
        throw new Error('Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Vignette update error:', error);
      showNotification('Erreur lors de la mise à jour de la vignette', 'error');
      mutateProject(); // Revert optimistic update
    }
  };

  // Delete image with optimistic update
  const handleDeleteImage = async (imageId) => {
    try {
      showNotification('Suppression de l\'image...', 'info');
      
      // Optimistic update
      const optimisticImages = images.filter(img => img.id !== imageId);
      mutateImages(optimisticImages, false);

      // Actual API call (you'd need to implement this endpoint)
      const response = await fetch(`${API_URL}/images/${imageId}/`, {
        method: "DELETE",
      });

      if (response.ok) {
        mutateImages();
        showNotification('Image supprimée!', 'success');
      } else {
        throw new Error('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Delete error:', error);
      showNotification('Erreur lors de la suppression', 'error');
      mutateImages(); // Revert optimistic update
    }
  };

  const handleBackToList = () => {
    navigate('/admin/projets');
  };

  // Loading state
  if (projectLoading) {
    return (
      <div className="project-detail-container">
        <div className="project-header">
          <Skeleton variant="rectangular" width={200} height={40} />
          <Skeleton variant="rectangular" width={150} height={40} />
        </div>
        <Card className="project-form-card">
          <CardContent>
            <Skeleton variant="text" height={60} />
            <Skeleton variant="rectangular" height={200} />
            <Skeleton variant="rectangular" height={100} />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (projectError) {
    return (
      <div className="project-detail-container">
        <Alert severity="error" className="error-alert">
          <Typography variant="h6">Erreur de chargement</Typography>
          <Typography>Impossible de charger les données du projet.</Typography>
          <Button onClick={() => mutateProject()} variant="outlined" size="small">
            Réessayer
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="project-detail-container">
      <CropModal
        open={cropModalOpen}
        imageSrc={currentImageSrc}
        onCancel={handleCropCancel}
        onComplete={handleCropComplete}
        fileType={currentFileType}
      />
      {/* Header */}
      <div className="project-header">
        <Button
          onClick={handleBackToList}
          startIcon={<ArrowBackIcon />}
          className="back-button"
        >
          Retour à la liste
        </Button>
        <Typography variant="h4" className="project-title">
          {projectData?.name || 'Modification du projet'}
        </Typography>
        <Button
          onClick={handleSave}
          disabled={saving}
          startIcon={<SaveIcon />}
          variant="contained"
          className="save-button"
        >
          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </div>

      <Grid container spacing={3}>
        {/* Project Form */}
        <Grid item xs={12} lg={8}>
          <Card className="project-form-card">
            <CardContent>
              <Typography variant="h6" className="section-title">
                Informations du projet
              </Typography>
              <Divider className="section-divider" />
              
              {projectData && (
                <Form
                  form={form}
                  layout="vertical"
                  initialValues={{
                    name: projectData.name,
                    description: projectData.description,
                    type: projectData.type,
                    city: projectData.city,
                    annee: dayjs(projectData.date),
                    position: projectData.position,
                  }}
                  className="project-form"
                >
                  <Form.Item name="name" label="Titre du projet" rules={[{ required: true }]}>
                    <Input placeholder="Nom du projet" />
                  </Form.Item>

                  <Form.Item name="city" label="Ville du projet">
                    <Input placeholder="Ville" />
                  </Form.Item>

                  <Form.Item 
                    name="position" 
                    label="Position dans la liste"
                    rules={[
                      { required: true, message: 'La position est requise' },
                      { 
                        type: 'number', 
                        min: 1, 
                        message: 'La position doit être un nombre positif' 
                      }
                    ]}
                  >
                    <Input 
                      type="number" 
                      placeholder="Position (ex: 1, 2, 3...)" 
                      min={1}
                    />
                  </Form.Item>

                  <Form.Item name="annee" label="Année de réalisation">
                    <DatePicker picker="year" placeholder="Sélectionnez une année" />
                  </Form.Item>

                  <Form.Item name="type" label="Type de projet">
                    <SegmentedControl
                      options={["projet", "etude"]}
                      selectedOption={form.getFieldValue("type")}
                      onSelect={(option) => form.setFieldValue("type", option)}
                    />
                  </Form.Item>

                  <Form.Item name="description" label="Description du projet">
                    <TextEditor
                      placeholder="Décrivez le projet..."
                      value={form.getFieldValue("description")}
                      onChange={(value) => form.setFieldValue("description", value)}
                    />
                  </Form.Item>
                </Form>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Images Section */}
        <Grid item xs={12} lg={4}>
          <Card className="images-card">
            <CardContent>
              <Typography variant="h6" className="section-title">
                Images du projet
              </Typography>
              <Divider className="section-divider" />
              
              <FileUploadZone
                onUpload={imageHandler}
                uploading={uploading}
                uploadProgress={uploadProgress}
              />
              
              <Box className="images-gallery">
                <ImageGallery
                  images={images}
                  projectData={projectData}
                  onSetVignette={handleSetVignette}
                  onDeleteImage={handleDeleteImage}
                  loading={imagesLoading}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Enhanced Notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={hideNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={hideNotification} 
          severity={notification.severity}
          className="notification-alert"
        >
          {notification.message}
          {notification.progress !== null && (
            <LinearProgress 
              variant="determinate" 
              value={notification.progress} 
              className="notification-progress"
            />
          )}
        </Alert>
      </Snackbar>
    </div>
  );
}