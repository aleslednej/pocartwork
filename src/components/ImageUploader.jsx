import { useState, useCallback } from 'react';

const FACE_LABELS = ['Right (+X)', 'Left (-X)', 'Top (+Y)', 'Bottom (-Y)', 'Front (+Z)', 'Back (-Z)'];
const FACE_KEYS = ['right', 'left', 'top', 'bottom', 'front', 'back'];

export function ImageUploader({ onTexturesReady, brand }) {
  const [images, setImages] = useState({
    right: null,
    left: null,
    top: null,
    bottom: null,
    front: null,
    back: null,
  });

  const handleImageUpload = useCallback((faceKey, file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setImages(prev => ({
        ...prev,
        [faceKey]: e.target.result
      }));
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((faceKey, e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(faceKey, file);
    }
  }, [handleImageUpload]);

  const handleSubmit = useCallback(() => {
    const textures = FACE_KEYS.map(key => images[key]);
    if (textures.every(t => t !== null)) {
      onTexturesReady(textures);
    }
  }, [images, onTexturesReady]);

  const allImagesLoaded = FACE_KEYS.every(key => images[key] !== null);
  const loadedCount = FACE_KEYS.filter(key => images[key] !== null).length;

  return (
    <div className="image-uploader">
      <div className="uploader-header">
        <h2>Upload Box Textures</h2>
        <p>Upload images for each face of the box ({loadedCount}/6 loaded)</p>
      </div>

      <div className="faces-grid">
        {FACE_KEYS.map((key, index) => (
          <div
            key={key}
            className={`face-slot ${images[key] ? 'has-image' : ''}`}
            onDrop={(e) => handleDrop(key, e)}
            onDragOver={(e) => e.preventDefault()}
          >
            <label className="face-label">{FACE_LABELS[index]}</label>

            {images[key] ? (
              <div className="face-preview">
                <img src={images[key]} alt={FACE_LABELS[index]} />
                <button
                  className="remove-btn"
                  onClick={() => setImages(prev => ({ ...prev, [key]: null }))}
                >
                  ×
                </button>
              </div>
            ) : (
              <label className="drop-zone">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(key, e.target.files?.[0])}
                />
                <span className="drop-text">
                  <span className="drop-icon">📁</span>
                  Drop image or click
                </span>
              </label>
            )}
          </div>
        ))}
      </div>

      <div className="uploader-actions">
        <button
          className="view-btn"
          disabled={!allImagesLoaded}
          onClick={handleSubmit}
          style={{
            background: allImagesLoaded ? brand?.colors?.primary : '#666',
          }}
        >
          View 3D Box
        </button>

        {!allImagesLoaded && (
          <p className="hint">Upload all 6 face images to continue</p>
        )}
      </div>

      <style>{`
        .image-uploader {
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
        }

        .uploader-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .uploader-header h2 {
          margin: 0 0 8px 0;
          font-size: 1.5rem;
        }

        .uploader-header p {
          margin: 0;
          opacity: 0.7;
        }

        .faces-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .face-slot {
          background: rgba(255, 255, 255, 0.05);
          border: 2px dashed rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          padding: 12px;
          transition: all 0.2s ease;
        }

        .face-slot:hover {
          border-color: rgba(255, 255, 255, 0.4);
          background: rgba(255, 255, 255, 0.08);
        }

        .face-slot.has-image {
          border-style: solid;
          border-color: var(--brand-primary, #bea2cd);
        }

        .face-label {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 8px;
          color: rgba(255, 255, 255, 0.8);
        }

        .drop-zone {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 120px;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .drop-zone:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .drop-zone input {
          display: none;
        }

        .drop-text {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.85rem;
        }

        .drop-icon {
          font-size: 2rem;
        }

        .face-preview {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
        }

        .face-preview img {
          width: 100%;
          height: 120px;
          object-fit: cover;
          display: block;
        }

        .remove-btn {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: none;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          font-size: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .remove-btn:hover {
          background: #e74c3c;
          transform: scale(1.1);
        }

        .uploader-actions {
          text-align: center;
        }

        .view-btn {
          padding: 14px 40px;
          font-size: 1.1rem;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .view-btn:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .view-btn:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .hint {
          margin-top: 12px;
          font-size: 0.85rem;
          opacity: 0.6;
        }

        @media (max-width: 768px) {
          .faces-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .faces-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
