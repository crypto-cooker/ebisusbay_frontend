import { Box } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';

interface StaticAPNGProps {
  src: string;
  alt: string;
}

const StaticAPNG: React.FC<StaticAPNGProps> = ({ src, alt }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const loadAPNG = async () => {
      const img = new Image();
      img.src = src;

      // Wait for the image to load
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Set canvas size to match the image's natural dimensions
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;

          // Draw the first frame of the APNG
          ctx.drawImage(img, 0, 0);
        }
      }
    };

    loadAPNG().catch(console.error);
  }, [src]);

  return (
    <Box position="relative" overflow="hidden">
      <canvas ref={canvasRef} aria-label={alt} style={{ display: 'block' }}></canvas>
    </Box>
  );
};

export default StaticAPNG;
