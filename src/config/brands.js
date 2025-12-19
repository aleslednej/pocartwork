// Brand configurations for elem6 product boxes
const BASE_URL = import.meta.env.BASE_URL || '/';

export const BRANDS = {
  truelife: {
    id: 'truelife',
    name: 'TrueLife',
    tagline: 'True care for real life',
    colors: {
      primary: '#bfa2cd',      // Mauve (from visual book)
      secondary: '#332231',    // Dark burgundy/plum
      background: '#dfd8ec',   // Light purple/lavender header
      text: '#697077',         // Muted gray-blue
      accent: '#9b7aa8',       // Medium purple
    },
    // Box face default colors (when no texture)
    boxColors: {
      primary: '#dfd8ec',      // Light lavender
      secondary: '#bfa2cd',    // Mauve
      accent: '#332231',       // Dark plum
    },
    logo: `${BASE_URL}logos/truelife/logo-white.png`,  // Local from brand manual
    // Default box dimensions in mm
    defaultBox: {
      width: 107,
      height: 270,
      depth: 82,
    },
    // Partial lacquer (UV varnish) settings
    partialLacquer: {
      enabled: true,
      areas: ['logo', 'product'],
      glossiness: 0.9,
    },
  },

  lamax: {
    id: 'lamax',
    name: 'LAMAX',
    tagline: 'Experience the difference',
    colors: {
      primary: '#00b9b4',      // Turquoise
      secondary: '#0e1716',    // Charcoal/dark
      background: '#0e1716',   // Dark background
      text: '#ffffff',         // White text
      accent: '#00d4ce',       // Bright turquoise
    },
    boxColors: {
      primary: '#0e1716',      // Dark charcoal
      secondary: '#00b9b4',    // Turquoise
      accent: '#00d4ce',       // Bright turquoise
    },
    logo: 'https://cdn-elem6-productdata.azureedge.net/general-assets/brand-logos/lamax-logo.png',
    defaultBox: {
      width: 120,
      height: 200,
      depth: 60,
    },
    partialLacquer: {
      enabled: false,
      areas: [],
      glossiness: 0,
    },
  },

  lauben: {
    id: 'lauben',
    name: 'Lauben',
    tagline: 'Smart home, smart life',
    colors: {
      primary: '#ff9509',      // Orange
      secondary: '#281414',    // Dark brown
      background: '#281414',   // Dark background
      text: '#ffffff',         // White text
      accent: '#ffaa33',       // Light orange
    },
    boxColors: {
      primary: '#281414',      // Dark brown
      secondary: '#ff9509',    // Orange
      accent: '#ffaa33',       // Light orange
    },
    logo: 'https://cdn-elem6-productdata.azureedge.net/general-assets/brand-logos/lauben-logo.png',
    defaultBox: {
      width: 150,
      height: 250,
      depth: 100,
    },
    partialLacquer: {
      enabled: false,
      areas: [],
      glossiness: 0,
    },
  },
};

export const DEFAULT_BRAND = 'truelife';

// Get brand by ID
export function getBrand(brandId) {
  return BRANDS[brandId] || BRANDS[DEFAULT_BRAND];
}

// Get all brand IDs
export function getAllBrandIds() {
  return Object.keys(BRANDS);
}

// Convert mm dimensions to Three.js units (normalized)
export function mmToUnits(mm, scale = 0.01) {
  return {
    width: mm.width * scale,
    height: mm.height * scale,
    depth: mm.depth * scale,
  };
}
