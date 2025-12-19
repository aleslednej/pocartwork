import { useCallback, useState } from 'react';

const FACE_LABELS = ['Right (+X)', 'Left (-X)', 'Top (+Y)', 'Bottom (-Y)', 'Front (+Z)', 'Back (-Z)'];
const FACE_KEYS = ['right', 'left', 'top', 'bottom', 'front', 'back'];
const FACE_COLORS = ['#e74c3c', '#e74c3c', '#2ecc71', '#2ecc71', '#3498db', '#3498db'];

// Brand logos - local paths (served from public folder)
const BASE_PATH = import.meta.env.BASE_URL || '/';
const BRAND_LOGOS = {
  truelife: `${BASE_PATH}logos/truelife/symbol-white.png`,
  lamax: 'https://cdn-elem6-productdata.azureedge.net/general-assets/brand-logos/lamax-logo.png',
  lauben: 'https://cdn-elem6-productdata.azureedge.net/general-assets/brand-logos/lauben-logo.png',
};

export function TexturePanel({ textures, onTextureChange, brand, logos = [], onAddLogo, onRemoveLogo }) {
  const [activeTab, setActiveTab] = useState('logos'); // 'textures' or 'logos'

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

  // Add logo to a face
  const handleAddLogoToFace = useCallback((faceIndex) => {
    const logoUrl = BRAND_LOGOS[brand?.id] || BRAND_LOGOS.truelife;
    onAddLogo(faceIndex, logoUrl, 0.5);
  }, [brand, onAddLogo]);

  // Count logos per face
  const logosPerFace = FACE_KEYS.map((_, faceIndex) =>
    logos.filter(logo => logo.faceIndex === faceIndex).length
  );

  return (
    <div className="texture-panel">
      {/* Tab switcher */}
      <div className="panel-tabs">
        <button
          className={`tab-btn ${activeTab === 'logos' ? 'active' : ''}`}
          onClick={() => setActiveTab('logos')}
        >
          🏷️ Loga
        </button>
        <button
          className={`tab-btn ${activeTab === 'textures' ? 'active' : ''}`}
          onClick={() => setActiveTab('textures')}
        >
          🎨 Textury
        </button>
      </div>

      {/* Logos tab */}
      {activeTab === 'logos' && (
        <div className="logos-section">
          <div className="panel-hint">Klikni pro přidání loga na stranu</div>

          <div className="face-buttons">
            {FACE_KEYS.map((key, index) => (
              <button
                key={key}
                className="face-logo-btn"
                onClick={() => handleAddLogoToFace(index)}
                style={{ borderColor: FACE_COLORS[index] }}
              >
                <span className="face-label">{FACE_LABELS[index].split(' ')[0]}</span>
                {logosPerFace[index] > 0 && (
                  <span className="logo-count">{logosPerFace[index]}</span>
                )}
              </button>
            ))}
          </div>

          {/* List of added logos */}
          {logos.length > 0 && (
            <div className="logos-list">
              <div className="logos-header">Přidaná loga:</div>
              {logos.map((logo, index) => (
                <div key={index} className="logo-item">
                  <span>{FACE_LABELS[logo.faceIndex].split(' ')[0]}</span>
                  <button
                    className="remove-logo-btn"
                    onClick={() => onRemoveLogo(index)}
                    title="Odebrat logo"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Textures tab */}
      {activeTab === 'textures' && (
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

              {textures[index] && (
                <button
                  className="clear-btn"
                  onClick={() => onTextureChange(index, null)}
                  title="Odebrat texturu"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <style>{`
        .texture-panel {
          position: fixed;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 12px;
          width: 160px;
          z-index: 100;
        }

        .panel-tabs {
          display: flex;
          gap: 4px;
          margin-bottom: 12px;
        }

        .tab-btn {
          flex: 1;
          padding: 6px 8px;
          border: none;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tab-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .tab-btn.active {
          background: var(--brand-primary, #bea2cd);
          color: white;
        }

        .panel-hint {
          font-size: 0.7rem;
          opacity: 0.6;
          margin-bottom: 10px;
          text-align: center;
        }

        .face-buttons {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 6px;
        }

        .face-logo-btn {
          padding: 8px 6px;
          border: 2px solid;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.05);
          color: white;
          font-size: 0.7rem;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .face-logo-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: scale(1.05);
        }

        .face-label {
          font-weight: 500;
        }

        .logo-count {
          position: absolute;
          top: -6px;
          right: -6px;
          background: var(--brand-primary, #bea2cd);
          color: white;
          font-size: 0.65rem;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logos-list {
          margin-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 8px;
        }

        .logos-header {
          font-size: 0.7rem;
          opacity: 0.6;
          margin-bottom: 6px;
        }

        .logo-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 4px 8px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
          margin-bottom: 4px;
          font-size: 0.75rem;
        }

        .remove-logo-btn {
          width: 18px;
          height: 18px;
          border: none;
          border-radius: 50%;
          background: rgba(231, 76, 60, 0.8);
          color: white;
          font-size: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .remove-logo-btn:hover {
          background: #e74c3c;
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

          .face-buttons {
            grid-template-columns: repeat(3, 1fr);
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
