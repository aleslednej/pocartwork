import { useCallback, useState } from 'react';

const FACE_LABELS = ['Right (+X)', 'Left (-X)', 'Top (+Y)', 'Bottom (-Y)', 'Front (+Z)', 'Back (-Z)'];
const FACE_KEYS = ['right', 'left', 'top', 'bottom', 'front', 'back'];
const FACE_COLORS = ['#e74c3c', '#e74c3c', '#2ecc71', '#2ecc71', '#3498db', '#3498db'];

const BASE_PATH = import.meta.env.BASE_URL || '/';

// TrueLife logo variants
const TRUELIFE_LOGOS = [
  { id: 'logo-white', name: 'Logo bílé', url: `${BASE_PATH}logos/truelife/logo-white.png`, type: 'logo' },
  { id: 'logo-black', name: 'Logo černé', url: `${BASE_PATH}logos/truelife/logo-black.png`, type: 'logo' },
  { id: 'symbol-white', name: 'Symbol bílý', url: `${BASE_PATH}logos/truelife/symbol-white.png`, type: 'symbol' },
  { id: 'symbol-black', name: 'Symbol černý', url: `${BASE_PATH}logos/truelife/symbol-black.png`, type: 'symbol' },
];

// Brand-specific logos
const BRAND_LOGOS = {
  truelife: TRUELIFE_LOGOS,
  lamax: [
    { id: 'lamax-logo', name: 'LAMAX Logo', url: 'https://cdn-elem6-productdata.azureedge.net/general-assets/brand-logos/lamax-logo.png', type: 'logo' },
  ],
  lauben: [
    { id: 'lauben-logo', name: 'Lauben Logo', url: 'https://cdn-elem6-productdata.azureedge.net/general-assets/brand-logos/lauben-logo.png', type: 'logo' },
  ],
};

export function TexturePanel({ textures, onTextureChange, brand, logos = [], onAddLogo, onRemoveLogo, onUpdateLogo }) {
  const [activeTab, setActiveTab] = useState('logos');
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [expandedLogo, setExpandedLogo] = useState(null);

  const brandLogos = BRAND_LOGOS[brand?.id] || BRAND_LOGOS.truelife;

  const handleImageUpload = useCallback((index, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => onTextureChange(index, e.target.result);
    reader.readAsDataURL(file);
  }, [onTextureChange]);

  const handleDrop = useCallback((index, e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(index, file);
    }
  }, [handleImageUpload]);

  // Add logo to face
  const handleAddLogoToFace = useCallback((faceIndex) => {
    if (!selectedLogo) return;
    onAddLogo(faceIndex, selectedLogo.url, 0.3, { x: 0, y: 0 });
  }, [selectedLogo, onAddLogo]);

  // Update logo position
  const handlePositionChange = useCallback((logoIndex, axis, value) => {
    const logo = logos[logoIndex];
    if (!logo) return;
    const newPosition = { ...logo.position, [axis]: parseFloat(value) };
    onUpdateLogo(logoIndex, { position: newPosition });
  }, [logos, onUpdateLogo]);

  // Update logo scale
  const handleScaleChange = useCallback((logoIndex, value) => {
    onUpdateLogo(logoIndex, { scale: parseFloat(value) });
  }, [onUpdateLogo]);

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
          Loga
        </button>
        <button
          className={`tab-btn ${activeTab === 'textures' ? 'active' : ''}`}
          onClick={() => setActiveTab('textures')}
        >
          Textury
        </button>
      </div>

      {/* Logos tab */}
      {activeTab === 'logos' && (
        <div className="logos-section">
          {/* Logo selector */}
          <div className="logo-selector">
            <div className="selector-label">1. Vyber logo:</div>
            <div className="logo-options">
              {brandLogos.map(logo => (
                <button
                  key={logo.id}
                  className={`logo-option ${selectedLogo?.id === logo.id ? 'selected' : ''}`}
                  onClick={() => setSelectedLogo(logo)}
                  title={logo.name}
                >
                  <img src={logo.url} alt={logo.name} />
                  <span className="logo-type">{logo.type === 'symbol' ? 'S' : 'L'}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Face selector */}
          <div className="face-selector">
            <div className="selector-label">2. Přidej na stranu:</div>
            <div className="face-buttons">
              {FACE_KEYS.map((key, index) => (
                <button
                  key={key}
                  className={`face-logo-btn ${!selectedLogo ? 'disabled' : ''}`}
                  onClick={() => handleAddLogoToFace(index)}
                  style={{ borderColor: FACE_COLORS[index] }}
                  disabled={!selectedLogo}
                >
                  <span className="face-label">{FACE_LABELS[index].split(' ')[0]}</span>
                  {logosPerFace[index] > 0 && (
                    <span className="logo-count">{logosPerFace[index]}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Added logos with position controls */}
          {logos.length > 0 && (
            <div className="logos-list">
              <div className="logos-header">Přidaná loga ({logos.length}):</div>
              {logos.map((logo, index) => (
                <div key={index} className="logo-item-expanded">
                  <div
                    className="logo-item-header"
                    onClick={() => setExpandedLogo(expandedLogo === index ? null : index)}
                  >
                    <span className="logo-face" style={{ borderLeftColor: FACE_COLORS[logo.faceIndex] }}>
                      {FACE_LABELS[logo.faceIndex].split(' ')[0]}
                    </span>
                    <span className="expand-icon">{expandedLogo === index ? '▼' : '▶'}</span>
                    <button
                      className="remove-logo-btn"
                      onClick={(e) => { e.stopPropagation(); onRemoveLogo(index); }}
                      title="Odebrat"
                    >
                      ×
                    </button>
                  </div>

                  {expandedLogo === index && (
                    <div className="logo-controls">
                      <div className="control-row">
                        <label>X:</label>
                        <input
                          type="range"
                          min="-0.4"
                          max="0.4"
                          step="0.01"
                          value={logo.position?.x || 0}
                          onChange={(e) => handlePositionChange(index, 'x', e.target.value)}
                        />
                        <span className="value">{(logo.position?.x || 0).toFixed(2)}</span>
                      </div>
                      <div className="control-row">
                        <label>Y:</label>
                        <input
                          type="range"
                          min="-0.4"
                          max="0.4"
                          step="0.01"
                          value={logo.position?.y || 0}
                          onChange={(e) => handlePositionChange(index, 'y', e.target.value)}
                        />
                        <span className="value">{(logo.position?.y || 0).toFixed(2)}</span>
                      </div>
                      <div className="control-row">
                        <label>Velikost:</label>
                        <input
                          type="range"
                          min="0.1"
                          max="0.8"
                          step="0.05"
                          value={logo.scale || 0.3}
                          onChange={(e) => handleScaleChange(index, e.target.value)}
                        />
                        <span className="value">{((logo.scale || 0.3) * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  )}
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
              <div className="face-indicator" style={{ background: FACE_COLORS[index] }} />
              <label className="texture-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(index, e.target.files?.[0])}
                />
                {textures[index] ? (
                  <img src={textures[index]} alt={FACE_LABELS[index]} className="texture-thumb" />
                ) : (
                  <div className="placeholder"><span>+</span></div>
                )}
              </label>
              <span className="face-name">{FACE_LABELS[index]}</span>
              {textures[index] && (
                <button className="clear-btn" onClick={() => onTextureChange(index, null)} title="Odebrat">×</button>
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
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 12px;
          width: 200px;
          z-index: 100;
          max-height: 80vh;
          overflow-y: auto;
        }

        .panel-tabs {
          display: flex;
          gap: 4px;
          margin-bottom: 12px;
        }

        .tab-btn {
          flex: 1;
          padding: 8px;
          border: none;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tab-btn:hover { background: rgba(255, 255, 255, 0.2); }
        .tab-btn.active { background: var(--brand-primary, #bea2cd); color: white; }

        .selector-label {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 8px;
        }

        .logo-selector {
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .logo-options {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 6px;
        }

        .logo-option {
          aspect-ratio: 1;
          padding: 6px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          background: linear-gradient(45deg, #333 25%, #444 25%, #444 50%, #333 50%, #333 75%, #444 75%);
          background-size: 8px 8px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }

        .logo-option:hover { border-color: rgba(255, 255, 255, 0.5); transform: scale(1.05); }
        .logo-option.selected { border-color: var(--brand-primary, #bea2cd); box-shadow: 0 0 8px var(--brand-primary, #bea2cd); }

        .logo-option img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .logo-type {
          position: absolute;
          bottom: 2px;
          right: 2px;
          font-size: 8px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 1px 3px;
          border-radius: 3px;
        }

        .face-selector { margin-bottom: 12px; }

        .face-buttons {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 4px;
        }

        .face-logo-btn {
          padding: 6px 4px;
          border: 2px solid;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.05);
          color: white;
          font-size: 0.65rem;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }

        .face-logo-btn:hover:not(.disabled) { background: rgba(255, 255, 255, 0.15); }
        .face-logo-btn.disabled { opacity: 0.4; cursor: not-allowed; }

        .logo-count {
          position: absolute;
          top: -5px;
          right: -5px;
          background: var(--brand-primary, #bea2cd);
          color: white;
          font-size: 0.6rem;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logos-list {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 10px;
        }

        .logos-header {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 8px;
        }

        .logo-item-expanded {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 6px;
          margin-bottom: 6px;
          overflow: hidden;
        }

        .logo-item-header {
          display: flex;
          align-items: center;
          padding: 6px 8px;
          cursor: pointer;
          gap: 6px;
        }

        .logo-item-header:hover { background: rgba(255, 255, 255, 0.05); }

        .logo-face {
          font-size: 0.75rem;
          border-left: 3px solid;
          padding-left: 6px;
          flex: 1;
        }

        .expand-icon {
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .remove-logo-btn {
          width: 18px;
          height: 18px;
          border: none;
          border-radius: 50%;
          background: rgba(231, 76, 60, 0.6);
          color: white;
          font-size: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .remove-logo-btn:hover { background: #e74c3c; }

        .logo-controls {
          padding: 8px;
          background: rgba(0, 0, 0, 0.3);
        }

        .control-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 6px;
        }

        .control-row:last-child { margin-bottom: 0; }

        .control-row label {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.6);
          width: 50px;
        }

        .control-row input[type="range"] {
          flex: 1;
          height: 4px;
          -webkit-appearance: none;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
          cursor: pointer;
        }

        .control-row input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 12px;
          height: 12px;
          background: var(--brand-primary, #bea2cd);
          border-radius: 50%;
          cursor: pointer;
        }

        .control-row .value {
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.5);
          width: 35px;
          text-align: right;
          font-family: monospace;
        }

        .texture-list { display: flex; flex-direction: column; gap: 6px; }

        .texture-slot {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          position: relative;
        }

        .texture-slot:hover { background: rgba(255, 255, 255, 0.1); }
        .texture-slot.has-texture { border-color: var(--brand-primary, #bea2cd); }

        .face-indicator { width: 4px; height: 28px; border-radius: 2px; }
        .texture-upload { cursor: pointer; }
        .texture-upload input { display: none; }

        .texture-thumb {
          width: 32px;
          height: 32px;
          object-fit: cover;
          border-radius: 4px;
        }

        .placeholder {
          width: 32px;
          height: 32px;
          border: 2px dashed rgba(255, 255, 255, 0.3);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.4);
          font-size: 1rem;
        }

        .face-name {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.6);
          flex: 1;
        }

        .clear-btn {
          position: absolute;
          top: 2px;
          right: 2px;
          width: 14px;
          height: 14px;
          border: none;
          border-radius: 50%;
          background: rgba(231, 76, 60, 0.8);
          color: white;
          font-size: 10px;
          cursor: pointer;
          opacity: 0;
        }

        .texture-slot:hover .clear-btn { opacity: 1; }

        @media (max-width: 768px) {
          .texture-panel {
            position: fixed;
            bottom: 20px;
            right: 10px;
            left: 10px;
            top: auto;
            transform: none;
            width: auto;
            max-height: 50vh;
          }
          .logo-options { grid-template-columns: repeat(4, 1fr); }
          .face-buttons { grid-template-columns: repeat(6, 1fr); }
        }
      `}</style>
    </div>
  );
}
