import React, { useCallback, useEffect, useMemo, useState } from "react";
import Modal from "antd/es/modal";
import "antd/es/modal/style";
import Slider from "antd/es/slider";
import "antd/es/slider/style";
import Cropper from "react-easy-crop";

// Helper to create an HTMLImageElement from a URL
function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // needed for cross-origin images
    image.src = url;
  });
}

// croppedAreaPixels is from react-easy-crop's onCropComplete
async function getCroppedImg(imageSrc, croppedAreaPixels, format = "image/jpeg", quality = 0.92) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Set canvas to the output size of the crop
  canvas.width = croppedAreaPixels.width;
  canvas.height = croppedAreaPixels.height;

  // Draw the image portion to the canvas
  ctx.drawImage(
    image,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    croppedAreaPixels.width,
    croppedAreaPixels.height
  );

  // Return blob
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve(blob);
      },
      format,
      quality
    );
  });
}

export default function CropModal({
  open,
  imageSrc,
  onCancel,
  onComplete,
  fileType = "image/jpeg",
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const aspect = useMemo(() => 16 / 9, []);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleOk = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) {
      onCancel?.();
      return;
    }
    try {
      const blob = await getCroppedImg(imageSrc, croppedAreaPixels, fileType);
      onComplete?.(blob);
    } catch (e) {
      console.error("Cropping failed", e);
      onCancel?.();
    }
  }, [imageSrc, croppedAreaPixels, fileType, onCancel, onComplete]);

  return (
    <Modal
      title="Recadrer l'image (16:9)"
      open={open}
      visible={open}
      onOk={handleOk}
      okText="Valider"
      cancelText="Annuler"
      onCancel={onCancel}
      width={800}
      destroyOnClose
      maskClosable={false}
    >
      <div style={{ position: "relative", width: "100%", height: 400, background: "#333" }}>
        {imageSrc && (
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            restrictPosition
            objectFit="horizontal-cover"
            minZoom={1}
            maxZoom={5}
          />
        )}
      </div>
      <div style={{ marginTop: 16 }}>
        Zoom
        <Slider
          min={1}
          max={5}
          step={0.1}
          value={zoom}
          onChange={(v) => setZoom(v)}
        />
      </div>
      <div style={{ marginTop: 8, color: "#666", fontSize: 12 }}>
        Astuce: faites glisser l'image pour la repositionner dans le cadre 16:9.
      </div>
    </Modal>
  );
}
