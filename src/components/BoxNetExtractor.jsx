import { useState, useRef, useEffect, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

// Default crop regions for TrueLife HairDryer D2 box (percentages of page)
const DEFAULT_REGIONS = {
  front: { x: 0.02, y: 0.22, width: 0.22, height: 0.65, label: 'Front', color: '#ff4444' },
  back: { x: 0.24, y: 0.22, width: 0.17, height: 0.65, label: 'Back', color: '#44ff44' },
  left: { x: 0.41, y: 0.22, width: 0.12, height: 0.65, label: 'Left', color: '#4444ff' },
  right: { x: 0.53, y: 0.30, width: 0.22, height: 0.55, label: 'Right', color: '#ffff44' },
  top: { x: 0.02, y: 0.08, width: 0.22, height: 0.12, label: 'Top', color: '#ff44ff' },
  bottom: { x: 0.02, y: 0.88, width: 0.22, height: 0.10, label: 'Bottom', color: '#44ffff' },
};

export function BoxNetExtractor({ onTexturesExtracted }) {
  const [pdfImage, setPdfImage] = useState(null);
  const [regions, setRegions] = useState(DEFAULT_REGIONS);
  const [selectedRegion, setSelectedRegion] = useState('front');
  const [loading, setLoading] = useState(false);
  const [scale, setScale] = useState(3);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [extractedPreviews, setExtractedPreviews] = useState([]);

  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Load PDF and render to canvas
  const loadPDF = useCallback(async (file) => {
    setLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const page = await pdf.getPage(1);

      const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: ctx, viewport }).promise;

      setPdfImage({
        dataUrl: canvas.toDataURL('image/png'),
        width: viewport.width,
        height: viewport.height,
        canvas: canvas,
      });
      setZoom(1);
      setPan({ x: 0, y: 0 });
    } catch (err) {
      console.error('Error loading PDF:', err);
      alert('Failed to load PDF: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [scale]);

  // Extract region from canvas
  const extractRegion = useCallback((regionKey) => {
    if (!pdfImage?.canvas) return null;

    const region = regions[regionKey];
    const { canvas: sourceCanvas } = pdfImage;

    const x = Math.floor(region.x * sourceCanvas.width);
    const y = Math.floor(region.y * sourceCanvas.height);
    const w = Math.floor(region.width * sourceCanvas.width);
    const h = Math.floor(region.height * sourceCanvas.height);

    const extractCanvas = document.createElement('canvas');
    extractCanvas.width = w;
    extractCanvas.height = h;
    const ctx = extractCanvas.getContext('2d');

    ctx.drawImage(sourceCanvas, x, y, w, h, 0, 0, w, h);

    return extractCanvas.toDataURL('image/png');
  }, [pdfImage, regions]);

  // Update previews when regions change
  useEffect(() => {
    if (!pdfImage?.canvas) return;

    const previews = Object.keys(regions).map(key => ({
      key,
      label: regions[key].label,
      color: regions[key].color,
      dataUrl: extractRegion(key)
    }));
    setExtractedPreviews(previews);
  }, [pdfImage, regions, extractRegion]);

  // Extract all and send to 3D viewer
  const extractAllTextures = useCallback(() => {
    if (!pdfImage?.canvas) return;

    // Three.js BoxGeometry material order: [right, left, top, bottom, front, back]
    const textures = [
      extractRegion('right'),
      extractRegion('left'),
      extractRegion('top'),
      extractRegion('bottom'),
      extractRegion('front'),
      extractRegion('back'),
    ];

    onTexturesExtracted(textures);
  }, [pdfImage, extractRegion, onTexturesExtracted]);

  // Update region
  const updateRegion = (key, updates) => {
    setRegions(prev => ({
      ...prev,
      [key]: { ...prev[key], ...updates }
    }));
  };

  // Draw canvas with regions
  useEffect(() => {
    if (!pdfImage?.dataUrl || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      const containerWidth = containerRef.current?.clientWidth || 800;
      const containerHeight = 500;

      canvas.width = containerWidth;
      canvas.height = containerHeight;

      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Calculate scaled dimensions
      const baseScale = Math.min(containerWidth / img.width, containerHeight / img.height) * 0.9;
      const scaledWidth = img.width * baseScale * zoom;
      const scaledHeight = img.height * baseScale * zoom;

      const x = (containerWidth - scaledWidth) / 2 + pan.x;
      const y = (containerHeight - scaledHeight) / 2 + pan.y;

      // Draw image
      ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

      // Draw region rectangles
      Object.entries(regions).forEach(([key, region]) => {
        const rx = x + region.x * scaledWidth;
        const ry = y + region.y * scaledHeight;
        const rw = region.width * scaledWidth;
        const rh = region.height * scaledHeight;

        // Fill with semi-transparent color
        ctx.fillStyle = region.color + '20';
        ctx.fillRect(rx, ry, rw, rh);

        // Border
        ctx.strokeStyle = selectedRegion === key ? '#ffffff' : region.color;
        ctx.lineWidth = selectedRegion === key ? 3 : 2;
        ctx.strokeRect(rx, ry, rw, rh);

        // Label background
        ctx.fillStyle = region.color;
        const labelWidth = ctx.measureText(region.label).width + 8;
        ctx.fillRect(rx, ry - 20, labelWidth + 4, 18);

        // Label text
        ctx.fillStyle = '#000';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(region.label, rx + 4, ry - 6);
      });
    };

    img.src = pdfImage.dataUrl;
  }, [pdfImage, regions, selectedRegion, zoom, pan]);

  // Mouse handlers for panning
  const handleMouseDown = (e) => {
    if (e.button === 0) { // Left click
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.5, Math.min(5, prev * delta)));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) loadPDF(file);
  };

  return (
    <div className="box-net-extractor">
      {/* Top Controls */}
      <div className="top-controls">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <button className="load-btn" onClick={() => fileInputRef.current?.click()} disabled={loading}>
          {loading ? 'Loading...' : 'Load PDF'}
        </button>

        <div className="zoom-controls">
          <button onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}>−</button>
          <span>{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.min(5, z + 0.25))}>+</button>
          <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}>Reset</button>
        </div>

        <select value={scale} onChange={(e) => setScale(Number(e.target.value))}>
          <option value={2}>2x DPI</option>
          <option value={3}>3x DPI</option>
          <option value={4}>4x DPI</option>
        </select>

        {pdfImage && (
          <button className="extract-btn" onClick={extractAllTextures}>
            View 3D Box →
          </button>
        )}
      </div>

      {/* Main Canvas Area */}
      <div className="canvas-area" ref={containerRef}>
        {!pdfImage ? (
          <div className="placeholder">
            <p>Load a PDF to start extracting textures</p>
            <p className="hint">Scroll to zoom, drag to pan</p>
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
          />
        )}
      </div>

      {/* Region Controls - Side Panel */}
      {pdfImage && (
        <div className="side-panel">
          <h3>Crop Regions</h3>
          {Object.entries(regions).map(([key, region]) => (
            <div
              key={key}
              className={`region-btn ${selectedRegion === key ? 'selected' : ''}`}
              style={{ borderColor: region.color }}
              onClick={() => setSelectedRegion(key)}
            >
              <span className="color-dot" style={{ background: region.color }} />
              {region.label}
            </div>
          ))}

          {selectedRegion && (
            <div className="sliders">
              <label>
                X: {(regions[selectedRegion].x * 100).toFixed(0)}%
                <input
                  type="range" min="0" max="100" step="0.5"
                  value={regions[selectedRegion].x * 100}
                  onChange={(e) => updateRegion(selectedRegion, { x: e.target.value / 100 })}
                />
              </label>
              <label>
                Y: {(regions[selectedRegion].y * 100).toFixed(0)}%
                <input
                  type="range" min="0" max="100" step="0.5"
                  value={regions[selectedRegion].y * 100}
                  onChange={(e) => updateRegion(selectedRegion, { y: e.target.value / 100 })}
                />
              </label>
              <label>
                W: {(regions[selectedRegion].width * 100).toFixed(0)}%
                <input
                  type="range" min="1" max="60" step="0.5"
                  value={regions[selectedRegion].width * 100}
                  onChange={(e) => updateRegion(selectedRegion, { width: e.target.value / 100 })}
                />
              </label>
              <label>
                H: {(regions[selectedRegion].height * 100).toFixed(0)}%
                <input
                  type="range" min="1" max="100" step="0.5"
                  value={regions[selectedRegion].height * 100}
                  onChange={(e) => updateRegion(selectedRegion, { height: e.target.value / 100 })}
                />
              </label>
            </div>
          )}
        </div>
      )}

      {/* Bottom Texture Previews */}
      {extractedPreviews.length > 0 && (
        <div className="texture-strip">
          {extractedPreviews.map(({ key, label, color, dataUrl }) => (
            <div
              key={key}
              className={`texture-thumb ${selectedRegion === key ? 'selected' : ''}`}
              onClick={() => setSelectedRegion(key)}
              style={{ borderColor: selectedRegion === key ? color : 'transparent' }}
            >
              {dataUrl && <img src={dataUrl} alt={label} />}
              <span style={{ color }}>{label}</span>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .box-net-extractor {
          width: 100%;
          height: calc(100vh - 80px);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .top-controls {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
          padding: 0 12px;
        }

        .load-btn {
          padding: 10px 20px;
          background: #bea2cd;
          border: none;
          border-radius: 6px;
          color: #1a1a2e;
          font-weight: 600;
          cursor: pointer;
        }
        .load-btn:disabled { opacity: 0.5; }

        .zoom-controls {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.1);
          padding: 4px 12px;
          border-radius: 6px;
        }
        .zoom-controls button {
          width: 28px;
          height: 28px;
          background: rgba(255,255,255,0.1);
          border: none;
          border-radius: 4px;
          color: white;
          cursor: pointer;
          font-size: 16px;
        }
        .zoom-controls button:hover { background: rgba(255,255,255,0.2); }
        .zoom-controls span { min-width: 50px; text-align: center; }

        .top-controls select {
          padding: 8px 12px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 6px;
          color: white;
        }

        .extract-btn {
          margin-left: auto;
          padding: 10px 24px;
          background: linear-gradient(135deg, #bea2cd, #462a3f);
          border: none;
          border-radius: 6px;
          color: white;
          font-weight: 600;
          cursor: pointer;
        }
        .extract-btn:hover { opacity: 0.9; }

        .canvas-area {
          flex: 1;
          min-height: 400px;
          background: #0a0a15;
          border-radius: 8px;
          margin: 0 12px;
          position: relative;
          overflow: hidden;
        }

        .canvas-area canvas {
          display: block;
          width: 100%;
          height: 100%;
        }

        .placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.5);
        }
        .placeholder .hint {
          font-size: 12px;
          margin-top: 8px;
          opacity: 0.6;
        }

        .side-panel {
          position: absolute;
          top: 120px;
          right: 24px;
          background: rgba(0,0,0,0.8);
          padding: 12px;
          border-radius: 8px;
          min-width: 160px;
          backdrop-filter: blur(10px);
        }

        .side-panel h3 {
          font-size: 12px;
          margin-bottom: 8px;
          color: rgba(255,255,255,0.7);
        }

        .region-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px;
          margin-bottom: 4px;
          background: rgba(255,255,255,0.05);
          border: 2px solid transparent;
          border-radius: 4px;
          cursor: pointer;
          font-size: 13px;
        }
        .region-btn:hover { background: rgba(255,255,255,0.1); }
        .region-btn.selected { background: rgba(255,255,255,0.15); }

        .color-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .sliders {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        .sliders label {
          display: block;
          margin-bottom: 8px;
          font-size: 11px;
          color: rgba(255,255,255,0.7);
        }
        .sliders input[type="range"] {
          width: 100%;
          margin-top: 4px;
        }

        .texture-strip {
          display: flex;
          gap: 8px;
          padding: 12px;
          background: rgba(0,0,0,0.3);
          overflow-x: auto;
        }

        .texture-thumb {
          flex-shrink: 0;
          width: 100px;
          text-align: center;
          cursor: pointer;
          padding: 4px;
          border: 2px solid transparent;
          border-radius: 6px;
          transition: all 0.2s;
        }
        .texture-thumb:hover { background: rgba(255,255,255,0.05); }
        .texture-thumb.selected { background: rgba(255,255,255,0.1); }

        .texture-thumb img {
          width: 100%;
          height: 80px;
          object-fit: contain;
          background: rgba(255,255,255,0.05);
          border-radius: 4px;
        }

        .texture-thumb span {
          display: block;
          font-size: 11px;
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
}
