import { BRANDS, getAllBrandIds } from '../config/brands';

export function BrandSwitcher({ currentBrand, onBrandChange }) {
  const brandIds = getAllBrandIds();

  return (
    <div className="brand-switcher">
      {brandIds.map((id) => {
        const brand = BRANDS[id];
        const isActive = currentBrand === id;

        return (
          <button
            key={id}
            className={`brand-btn ${isActive ? 'active' : ''}`}
            onClick={() => onBrandChange(id)}
            style={{
              '--brand-primary': brand.colors.primary,
              '--brand-secondary': brand.colors.secondary,
            }}
          >
            <span className="brand-dot" style={{ background: brand.colors.primary }} />
            <span className="brand-name">{brand.name}</span>
          </button>
        );
      })}

      <style>{`
        .brand-switcher {
          display: flex;
          gap: 8px;
          padding: 4px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
        }

        .brand-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: transparent;
          border: 2px solid transparent;
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .brand-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .brand-btn.active {
          background: var(--brand-primary);
          border-color: var(--brand-primary);
          color: var(--brand-secondary);
        }

        .brand-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          transition: transform 0.2s;
        }

        .brand-btn.active .brand-dot {
          transform: scale(1.2);
          box-shadow: 0 0 8px var(--brand-primary);
        }

        .brand-name {
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
