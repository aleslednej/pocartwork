import { useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export function usePDFTextures() {
  const [textures, setTextures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const extractPageAsTexture = async (pdf, pageNum, scale = 2) => {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
      canvasContext: ctx,
      viewport: viewport,
    }).promise;

    return canvas.toDataURL('image/png');
  };

  const processPDF = useCallback(async (file) => {
    setLoading(true);
    setError(null);
    setTextures([]);
    setProgress(0);

    try {
      // Read file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();

      // Load PDF document
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;

      console.log(`PDF loaded: ${numPages} pages`);

      // We need exactly 6 textures for a box
      // If PDF has fewer pages, we'll duplicate/mirror some
      // If PDF has more pages, we'll use only the first 6
      const pagesToExtract = Math.min(numPages, 6);
      const extractedTextures = [];

      for (let i = 1; i <= pagesToExtract; i++) {
        const texture = await extractPageAsTexture(pdf, i);
        extractedTextures.push(texture);
        setProgress((i / 6) * 100);
      }

      // If we have fewer than 6 pages, fill remaining with copies
      while (extractedTextures.length < 6) {
        // Use first texture for remaining faces
        extractedTextures.push(extractedTextures[0]);
      }

      // Map textures to Three.js box face order:
      // Three.js BoxGeometry expects: [right, left, top, bottom, front, back]
      // We assume PDF pages are: [front, back, left, right, top, bottom]
      // Reorder accordingly
      const orderedTextures = [
        extractedTextures[3] || extractedTextures[0], // right (+X)
        extractedTextures[2] || extractedTextures[0], // left (-X)
        extractedTextures[4] || extractedTextures[0], // top (+Y)
        extractedTextures[5] || extractedTextures[0], // bottom (-Y)
        extractedTextures[0],                          // front (+Z)
        extractedTextures[1] || extractedTextures[0], // back (-Z)
      ];

      setTextures(orderedTextures);
      setProgress(100);
    } catch (err) {
      console.error('Error processing PDF:', err);
      setError(err.message || 'Failed to process PDF');
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setTextures([]);
    setError(null);
    setProgress(0);
  }, []);

  return {
    textures,
    loading,
    error,
    progress,
    processPDF,
    reset,
    hasTextures: textures.length === 6,
  };
}
