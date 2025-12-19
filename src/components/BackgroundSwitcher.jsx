import { useState } from 'react';

const PRESETS = [
  { id: 'white', label: 'White', color: '#ffffff' },
  { id: 'black', label: 'Black', color: '#1a1a1a' },
  { id: 'gray', label: 'Gray', color: '#4a4a4a' },
  { id: 'custom', label: 'Custom', color: null },
];

export function BackgroundSwitcher({ background, onBackgroundChange }) {
  const [showPicker, setShowPicker] = useState(false);
  const [customColor, setCustomColor] = useState('#808080');

  const handlePresetClick = (preset) => {
    if (preset.id === 'custom') {
      setShowPicker(true);
      onBackgroundChange(customColor);
    } else {
      setShowPicker(false);
      onBackgroundChange(preset.color);
    }
  };

  const handleCustomColorChange = (e) => {
    const color = e.target.value;
    setCustomColor(color);
    onBackgroundChange(color);
  };

  return (
    <div className="background-switcher">
      <span className="switcher-label">BG</span>
      <div className="preset-buttons">
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            className={`preset-btn ${background === preset.color || (preset.id === 'custom' && showPicker) ? 'active' : ''}`}
            onClick={() => handlePresetClick(preset)}
            style={{
              '--preset-color': preset.color || customColor,
            }}
            title={preset.label}
          >
            <span
              className="color-dot"
              style={{
                background: preset.id === 'custom'
                  ? `conic-gradient(red, yellow, lime, aqua, blue, magenta, red)`
                  : preset.color
              }}
            />
          </button>
        ))}
      </div>

      {showPicker && (
        <input
          type="color"
          value={customColor}
          onChange={handleCustomColorChange}
          className="color-picker"
        />
      )}

      <style>{`
        .background-switcher {
          position: fixed;
          left: 20px;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(10px);
          border-radius: 8px;
          padding: 12px 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          z-index: 100;
        }

        .switcher-label {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          opacity: 0.6;
        }

        .preset-buttons {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .preset-btn {
          width: 28px;
          height: 28px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.1);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .preset-btn:hover {
          border-color: rgba(255, 255, 255, 0.5);
        }

        .preset-btn.active {
          border-color: var(--brand-primary, #bea2cd);
          background: rgba(255, 255, 255, 0.2);
        }

        .color-dot {
          width: 16px;
          height: 16px;
          border-radius: 4px;
          border: 1px solid rgba(0, 0, 0, 0.2);
        }

        .color-picker {
          width: 28px;
          height: 28px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          padding: 0;
          background: transparent;
        }

        .color-picker::-webkit-color-swatch-wrapper {
          padding: 0;
        }

        .color-picker::-webkit-color-swatch {
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 4px;
        }

        @media (max-width: 768px) {
          .background-switcher {
            left: 10px;
            top: auto;
            bottom: 100px;
            transform: none;
            flex-direction: row;
            padding: 8px 12px;
          }

          .preset-buttons {
            flex-direction: row;
          }

          .switcher-label {
            writing-mode: horizontal-tb;
          }
        }
      `}</style>
    </div>
  );
}
