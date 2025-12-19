import { useCallback, useState } from 'react';

const FACE_LABELS = ['Right (+X)', 'Left (-X)', 'Top (+Y)', 'Bottom (-Y)', 'Front (+Z)', 'Back (-Z)'];
const FACE_KEYS = ['right', 'left', 'top', 'bottom', 'front', 'back'];
const FACE_COLORS = ['#e74c3c', '#e74c3c', '#2ecc71', '#2ecc71', '#3498db', '#3498db'];

// Brand logos - local paths (served from public folder)
// Using base path for GitHub Pages compatibility
const BASE_PATH = import.meta.env.BASE_URL || '/';
const BRAND_LOGOS = {
  truelife: `${BASE_PATH}logos/truelife/symbol-white.png`,
  lamax: 'https://cdn-elem6-productdata.azureedge.net/general-assets/brand-logos/lamax-logo.png',
  lauben: 'https://cdn-elem6-productdata.azureedge.net/general-assets/brand-logos/lauben-logo.png',
};

export function TexturePanel({ textures, onTextureChange, brand }) {
  const [loadingLogo, setLoadingLogo] = useState(null);

  // Load brand logo as texture using Image element (avoids CORS fetch issues)
  const handleInsertLogo = useCallback((index) => {
    const logoUrl = BRAND_LOGOS[brand?.id] || BRAND_LOGOS.truelife;
    setLoadingLogo(index);

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      // Create canvas to convert image to data URL
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      try {
        const dataUrl = canvas.toDataURL('image/png');
        onTextureChange(index, dataUrl);
      } catch (e) {
        // If canvas tainted by CORS, use the URL directly
        console.warn('CORS restriction, using URL directly');
        onTextureChange(index, logoUrl);
      }
      setLoadingLogo(null);
    };

    img.onerror = () => {
      console.error('Failed to load logo');
      // Fallback: use URL directly (will work if Three.js can load it)
      onTextureChange(index, logoUrl);
      setLoadingLogo(null);
    };

    img.src = logoUrl;
  }, [brand, onTextureChange]);

  const handleImageUpload = useCallback((index, file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      onTextureChange(index, e.target.result);
    };
    reader.readAsDataURL(file);
  }, [onTextureChange]);

  const handleDrop = useCallback((index, e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(index, file);
    }
  }, [handleImageUpload]);

  return (
    <div className="texture-panel">
      <div className="panel-header">
        <h3>Textures</h3>
        <span className="panel-hint">Drop images to change</span>
      </div>

      <div className="texture-list">
        {FACE_KEYS.map((key, index) => (
          <div
            key={key}
            className={`texture-slot ${textures[index] ? 'has-texture' : ''}`}
            onDrop={(e) => handleDrop(index, e)}
            onDragOver={(e) => e.preventDefault()}
          >
            <div
              className="face-indicator"
              style={{ background: FACE_COLORS[index] }}
            />

            <label className="texture-upload">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(index, e.target.files?.[0])}
              />
              {textures[index] ? (
                <img src={textures[index]} alt={FACE_LABELS[index]} className="texture-thumb" />
              ) : (
                <div className="placeholder">
                  <span>+</span>
                </div>
              )}
            </label>

            <span className="face-name">{FACE_LABELS[index]}</span>

            {!textures[index] && (
              <button
                className="logo-btn"
                onClick={() => handleInsertLogo(index)}
                disabled={loadingLogo === index}
                title={`Insert ${brand?.name || 'TrueLife'} logo`}
              >
                {loadingLogo === index ? '...' : '🏷️'}
              </button>
            )}

            {textures[index] && (
              <button
                className="clear-btn"
                onClick={() => onTextureChange(index, null)}
                title="Remove texture"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      <style>{`
        .texture-panel {
          position: fixed;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 16px;
          width: 140px;
          z-index: 100;
        }

        .panel-header {
          margin-bottom: 12px;
        }

        .panel-header h3 {
          margin: 0;
          font-size: 0.95rem;
          font-weight: 600;
        }

        .panel-hint {
          font-size: 0.7rem;
          opacity: 0.5;
        }

        .texture-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .texture-slot {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.2s;
          position: relative;
        }

        .texture-slot:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .texture-slot.has-texture {
          border-color: var(--brand-primary, #bea2cd);
        }

        .face-indicator {
          width: 4px;
          height: 32px;
          border-radius: 2px;
          flex-shrink: 0;
        }

        .texture-upload {
          cursor: pointer;
          flex-shrink: 0;
        }

        .texture-upload input {
          display: none;
        }

        .texture-thumb {
          width: 36px;
          height: 36px;
          object-fit: cover;
          border-radius: 4px;
          display: block;
        }

        .placeholder {
          width: 36px;
          height: 36px;
          border: 2px dashed rgba(255, 255, 255, 0.3);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.4);
          font-size: 1.2rem;
          transition: all 0.2s;
        }

        .texture-upload:hover .placeholder {
          border-color: var(--brand-primary, #bea2cd);
          color: var(--brand-primary, #bea2cd);
        }

        .face-name {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.7);
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .clear-btn {
          position: absolute;
          top: 2px;
          right: 2px;
          width: 16px;
          height: 16px;
          border: none;
          border-radius: 50%;
          background: rgba(231, 76, 60, 0.8);
          color: white;
          font-size: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: all 0.2s;
        }

        .texture-slot:hover .clear-btn {
          opacity: 1;
        }

        .clear-btn:hover {
          background: #e74c3c;
          transform: scale(1.1);
        }

        .logo-btn {
          width: 20px;
          height: 20px;
          border: none;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          font-size: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .logo-btn:hover {
          background: var(--brand-primary, #bfa2cd);
          transform: scale(1.1);
        }

        .logo-btn:disabled {
          opacity: 0.5;
          cursor: wait;
        }

        @media (max-width: 768px) {
          .texture-panel {
            position: fixed;
            bottom: 20px;
            right: 20px;
            left: 20px;
            top: auto;
            transform: none;
            width: auto;
          }

          .texture-list {
            flex-direction: row;
            flex-wrap: wrap;
            gap: 6px;
          }

          .texture-slot {
            flex: 1 1 calc(33% - 6px);
            min-width: 100px;
          }

          .face-name {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
