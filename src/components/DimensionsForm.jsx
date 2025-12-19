import { useState } from 'react';

export function DimensionsForm({ initialDimensions, onSubmit, brand }) {
  const [dimensions, setDimensions] = useState({
    width: initialDimensions?.width || 100,
    height: initialDimensions?.height || 200,
    depth: initialDimensions?.depth || 80,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(dimensions);
  };

  return (
    <div className="dimensions-form">
      <div className="form-container">
        <h2>Box Dimensions</h2>
        <p>Enter the box dimensions in millimeters</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Width (mm)</label>
            <input
              type="number"
              value={dimensions.width}
              onChange={(e) => setDimensions(prev => ({ ...prev, width: parseFloat(e.target.value) || 0 }))}
              min="10"
              max="500"
              step="0.1"
            />
          </div>

          <div className="input-group">
            <label>Height (mm)</label>
            <input
              type="number"
              value={dimensions.height}
              onChange={(e) => setDimensions(prev => ({ ...prev, height: parseFloat(e.target.value) || 0 }))}
              min="10"
              max="500"
              step="0.1"
            />
          </div>

          <div className="input-group">
            <label>Depth (mm)</label>
            <input
              type="number"
              value={dimensions.depth}
              onChange={(e) => setDimensions(prev => ({ ...prev, depth: parseFloat(e.target.value) || 0 }))}
              min="10"
              max="500"
              step="0.1"
            />
          </div>

          <div className="dimension-preview">
            <span>{dimensions.width} × {dimensions.height} × {dimensions.depth} mm</span>
          </div>

          <button
            type="submit"
            className="submit-btn"
            style={{ background: brand?.colors?.primary }}
          >
            Create Box →
          </button>
        </form>
      </div>

      <style>{`
        .dimensions-form {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 60vh;
          padding: 20px;
        }

        .form-container {
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 32px 40px;
          max-width: 400px;
          width: 100%;
        }

        .form-container h2 {
          margin: 0 0 8px 0;
          font-size: 1.5rem;
          text-align: center;
        }

        .form-container p {
          margin: 0 0 24px 0;
          opacity: 0.7;
          text-align: center;
          font-size: 0.9rem;
        }

        .input-group {
          margin-bottom: 16px;
        }

        .input-group label {
          display: block;
          margin-bottom: 6px;
          font-size: 0.85rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.8);
        }

        .input-group input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          font-size: 1.1rem;
          transition: all 0.2s;
        }

        .input-group input:focus {
          outline: none;
          border-color: var(--brand-primary, #bea2cd);
          background: rgba(255, 255, 255, 0.15);
        }

        .dimension-preview {
          text-align: center;
          padding: 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          margin: 20px 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--brand-primary, #bea2cd);
        }

        .submit-btn {
          width: 100%;
          padding: 14px 24px;
          border: none;
          border-radius: 8px;
          color: white;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
}
