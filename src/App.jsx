import { useState, useRef, useEffect, useCallback } from 'react';
import { DimensionsForm } from './components/DimensionsForm';
import { BoxViewer } from './components/BoxViewer';
import { TexturePanel } from './components/TexturePanel';
import { Controls } from './components/Controls';
import { BrandSwitcher } from './components/BrandSwitcher';
import { BackgroundSwitcher } from './components/BackgroundSwitcher';
import { getBrand, mmToUnits, DEFAULT_BRAND } from './config/brands';

function App() {
  const [mode, setMode] = useState('dimensions'); // 'dimensions' or 'view'
  const [boxDimensions, setBoxDimensions] = useState(null);
  const [textures, setTextures] = useState([null, null, null, null, null, null]);
  const [logos, setLogos] = useState([]); // Array of { faceIndex, url, scale }
  const [autoRotate, setAutoRotate] = useState(false);
  const [currentBrand, setCurrentBrand] = useState(DEFAULT_BRAND);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const viewerRef = useRef();

  const brand = getBrand(currentBrand);

  // Apply brand colors to CSS variables
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--brand-primary', brand.colors.primary);
    root.style.setProperty('--brand-secondary', brand.colors.secondary);
    root.style.setProperty('--brand-background', brand.colors.background);
    root.style.setProperty('--brand-text', brand.colors.text);
    root.style.setProperty('--brand-accent', brand.colors.accent);
  }, [brand]);

  // When brand changes, update default dimensions (only in dimensions mode)
  useEffect(() => {
    if (mode === 'dimensions') {
      setBoxDimensions(brand.defaultBox);
    }
  }, [brand, mode]);

  const handleDimensionsSubmit = (dimensions) => {
    setBoxDimensions(dimensions);
    setMode('view');
  };

  const handleTextureChange = useCallback((index, textureDataUrl) => {
    setTextures(prev => {
      const newTextures = [...prev];
      newTextures[index] = textureDataUrl;
      return newTextures;
    });
  }, []);

  const handleAddLogo = useCallback((faceIndex, logoUrl, scale = 0.5) => {
    setLogos(prev => [...prev, { faceIndex, url: logoUrl, scale }]);
  }, []);

  const handleRemoveLogo = useCallback((index) => {
    setLogos(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleResetView = () => {
    if (viewerRef.current) {
      viewerRef.current.resetCamera();
    }
  };

  const handleBack = () => {
    setMode('dimensions');
    setAutoRotate(false);
  };

  // Convert mm to Three.js units
  const sceneDimensions = boxDimensions
    ? mmToUnits(boxDimensions)
    : { width: 1, height: 2, depth: 0.8 };

  return (
    <div className="app" style={{
      background: `linear-gradient(135deg, ${brand.colors.secondary} 0%, ${brand.colors.background}22 100%)`
    }}>
      <header className="header">
        <div className="header-left">
          {mode === 'view' && (
            <button className="back-btn" onClick={handleBack}>
              ← Back
            </button>
          )}
        </div>

        <div className="header-center">
          <h1 style={{ color: brand.colors.primary }}>
            3D Box Viewer
          </h1>
          <span className="brand-tagline">{brand.tagline}</span>
        </div>

        <div className="header-right">
          <BrandSwitcher
            currentBrand={currentBrand}
            onBrandChange={setCurrentBrand}
          />
        </div>
      </header>

      {/* Brand Info Bar */}
      <div className="brand-bar" style={{ background: brand.colors.primary + '20' }}>
        <div className="brand-info">
          <img src={brand.logo} alt={brand.name} className="brand-logo" />
          <div className="box-specs">
            {boxDimensions && (
              <span>Box: {boxDimensions.width} × {boxDimensions.height} × {boxDimensions.depth} mm</span>
            )}
            {brand.partialLacquer.enabled && (
              <span className="lacquer-badge">
                ✨ UV Lak: {brand.partialLacquer.areas.join(', ')}
              </span>
            )}
          </div>
        </div>
      </div>

      <main className="main-content">
        {mode === 'dimensions' && (
          <DimensionsForm
            initialDimensions={brand.defaultBox}
            onSubmit={handleDimensionsSubmit}
            brand={brand}
          />
        )}

        {mode === 'view' && (
          <>
            <BoxViewer
              ref={viewerRef}
              textures={textures}
              autoRotate={autoRotate}
              dimensions={[sceneDimensions.width, sceneDimensions.height, sceneDimensions.depth]}
              brandColors={brand.boxColors}
              backgroundColor={backgroundColor}
              logos={logos}
            />

            <BackgroundSwitcher
              background={backgroundColor}
              onBackgroundChange={setBackgroundColor}
            />

            <TexturePanel
              textures={textures}
              onTextureChange={handleTextureChange}
              brand={brand}
              logos={logos}
              onAddLogo={handleAddLogo}
              onRemoveLogo={handleRemoveLogo}
            />

            <Controls
              autoRotate={autoRotate}
              onAutoRotateToggle={() => setAutoRotate(!autoRotate)}
              onReset={handleResetView}
            />
          </>
        )}
      </main>

      <style>{`
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 20px;
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(10px);
        }

        .header-left, .header-right {
          flex: 1;
        }

        .header-left {
          display: flex;
          justify-content: flex-start;
        }

        .header-right {
          display: flex;
          justify-content: flex-end;
        }

        .header-center {
          text-align: center;
        }

        .header-center h1 {
          font-size: 1.4rem;
          font-weight: 700;
          margin: 0;
        }

        .brand-tagline {
          font-size: 0.75rem;
          opacity: 0.7;
          display: block;
          margin-top: 2px;
        }

        .back-btn {
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          color: #fff;
          cursor: pointer;
          font-size: 0.85rem;
          transition: all 0.2s ease;
        }

        .back-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .brand-bar {
          padding: 8px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .brand-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .brand-logo {
          height: 24px;
          width: auto;
          object-fit: contain;
        }

        .box-specs {
          display: flex;
          gap: 16px;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .lacquer-badge {
          background: rgba(255, 215, 0, 0.2);
          padding: 2px 8px;
          border-radius: 4px;
          color: #ffd700;
        }

        @media (max-width: 768px) {
          .header {
            flex-direction: column;
            gap: 12px;
          }

          .header-left, .header-right {
            width: 100%;
            justify-content: center;
          }

          .brand-info {
            flex-direction: column;
            gap: 8px;
          }

          .box-specs {
            flex-direction: column;
            gap: 4px;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
