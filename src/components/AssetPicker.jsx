import { useState } from 'react';

const BASE_PATH = import.meta.env.BASE_URL || '/';

// TrueLife brand assets from brand manual
const TRUELIFE_ASSETS = {
  logos: [
    { id: 'logo-white', name: 'Logo Bílé', url: `${BASE_PATH}logos/truelife/logo-white.png`, category: 'logo' },
    { id: 'logo-black', name: 'Logo Černé', url: `${BASE_PATH}logos/truelife/logo-black.png`, category: 'logo' },
    { id: 'symbol-white', name: 'Symbol Bílý', url: `${BASE_PATH}logos/truelife/symbol-white.png`, category: 'symbol' },
    { id: 'symbol-black', name: 'Symbol Černý', url: `${BASE_PATH}logos/truelife/symbol-black.png`, category: 'symbol' },
  ],
  colors: [
    { id: 'levandulova', name: 'Levandulová', hex: '#DFDAEE' },
    { id: 'vinova', name: 'Vínová', hex: '#462A3F' },
    { id: 'lila', name: 'Lila', hex: '#BFA2CD' },
    { id: 'black', name: 'Černá', hex: '#000000' },
    { id: 'white', name: 'Bílá', hex: '#FFFFFF' },
  ],
};

// LAMAX brand assets
const LAMAX_ASSETS = {
  logos: [
    { id: 'lamax-logo', name: 'LAMAX Logo', url: 'https://cdn-elem6-productdata.azureedge.net/general-assets/brand-logos/lamax-logo.png', category: 'logo' },
  ],
  colors: [
    { id: 'turquoise', name: 'Tyrkysová', hex: '#00B9B4' },
    { id: 'charcoal', name: 'Antracit', hex: '#0E1716' },
    { id: 'white', name: 'Bílá', hex: '#FFFFFF' },
  ],
};

// Lauben brand assets
const LAUBEN_ASSETS = {
  logos: [
    { id: 'lauben-logo', name: 'Lauben Logo', url: 'https://cdn-elem6-productdata.azureedge.net/general-assets/brand-logos/lauben-logo.png', category: 'logo' },
  ],
  colors: [
    { id: 'orange', name: 'Oranžová', hex: '#FF9509' },
    { id: 'brown', name: 'Hnědá', hex: '#281414' },
    { id: 'white', name: 'Bílá', hex: '#FFFFFF' },
  ],
};

const BRAND_ASSETS = {
  truelife: TRUELIFE_ASSETS,
  lamax: LAMAX_ASSETS,
  lauben: LAUBEN_ASSETS,
};

export function AssetPicker({ isOpen, onClose, onSelectAsset, brandId = 'truelife' }) {
  const [activeCategory, setActiveCategory] = useState('logos');
  const assets = BRAND_ASSETS[brandId] || BRAND_ASSETS.truelife;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="asset-picker-backdrop" onClick={onClose} />

      {/* Sheet */}
      <div className="asset-picker-sheet">
        <div className="sheet-header">
          <h3>Vybrat asset</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* Category tabs */}
        <div className="sheet-tabs">
          <button
            className={`sheet-tab ${activeCategory === 'logos' ? 'active' : ''}`}
            onClick={() => setActiveCategory('logos')}
          >
            🏷️ Loga & Symboly
          </button>
          <button
            className={`sheet-tab ${activeCategory === 'colors' ? 'active' : ''}`}
            onClick={() => setActiveCategory('colors')}
          >
            🎨 Barvy
          </button>
        </div>

        {/* Content */}
        <div className="sheet-content">
          {activeCategory === 'logos' && (
            <div className="asset-grid">
              {assets.logos.map(asset => (
                <button
                  key={asset.id}
                  className="asset-item"
                  onClick={() => {
                    onSelectAsset({ type: 'logo', ...asset });
                    onClose();
                  }}
                >
                  <div className="asset-preview logo-preview">
                    <img src={asset.url} alt={asset.name} />
                  </div>
                  <span className="asset-name">{asset.name}</span>
                  <span className="asset-category">{asset.category}</span>
                </button>
              ))}
            </div>
          )}

          {activeCategory === 'colors' && (
            <div className="color-grid">
              {assets.colors.map(color => (
                <button
                  key={color.id}
                  className="color-item"
                  onClick={() => {
                    onSelectAsset({ type: 'color', ...color });
                    onClose();
                  }}
                >
                  <div
                    className="color-swatch"
                    style={{
                      backgroundColor: color.hex,
                      border: color.hex === '#FFFFFF' ? '2px solid #ccc' : 'none'
                    }}
                  />
                  <span className="color-name">{color.name}</span>
                  <span className="color-hex">{color.hex}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .asset-picker-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 200;
        }

        .asset-picker-sheet {
          position: fixed;
          right: 0;
          top: 0;
          bottom: 0;
          width: 320px;
          max-width: 90vw;
          background: #1a1a2e;
          z-index: 201;
          display: flex;
          flex-direction: column;
          animation: slideIn 0.2s ease-out;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .sheet-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .sheet-header h3 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: white;
        }

        .close-btn {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          font-size: 1.2rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .sheet-tabs {
          display: flex;
          gap: 8px;
          padding: 12px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .sheet-tab {
          flex: 1;
          padding: 10px 12px;
          border: none;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .sheet-tab:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .sheet-tab.active {
          background: var(--brand-primary, #bea2cd);
          color: white;
        }

        .sheet-content {
          flex: 1;
          overflow-y: auto;
          padding: 16px 20px;
        }

        .asset-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .asset-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 12px;
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.02);
          cursor: pointer;
          transition: all 0.2s;
        }

        .asset-item:hover {
          border-color: var(--brand-primary, #bea2cd);
          background: rgba(255, 255, 255, 0.05);
          transform: scale(1.02);
        }

        .asset-preview {
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          overflow: hidden;
        }

        .logo-preview {
          background: linear-gradient(45deg, #333 25%, #444 25%, #444 50%, #333 50%, #333 75%, #444 75%);
          background-size: 10px 10px;
        }

        .asset-preview img {
          max-width: 90%;
          max-height: 90%;
          object-fit: contain;
        }

        .asset-name {
          font-size: 0.8rem;
          font-weight: 500;
          color: white;
          text-align: center;
        }

        .asset-category {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
        }

        .color-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .color-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 12px;
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.02);
          cursor: pointer;
          transition: all 0.2s;
        }

        .color-item:hover {
          border-color: var(--brand-primary, #bea2cd);
          background: rgba(255, 255, 255, 0.05);
        }

        .color-swatch {
          width: 60px;
          height: 60px;
          border-radius: 8px;
        }

        .color-name {
          font-size: 0.85rem;
          font-weight: 500;
          color: white;
        }

        .color-hex {
          font-size: 0.7rem;
          font-family: monospace;
          color: rgba(255, 255, 255, 0.5);
        }

        @media (max-width: 480px) {
          .asset-picker-sheet {
            width: 100%;
            max-width: 100%;
          }

          .asset-grid,
          .color-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </>
  );
}
