'use client';
import DomeGallery from '@/components/demos/DomeGallery';

const COMPUFEST_IMAGES = [
  { src: '/compu-fest-images/IMG_0649.webp', alt: 'CompuFest 2026 - 1' },
  { src: '/compu-fest-images/IMG_0650.webp', alt: 'CompuFest 2026 - 2' },
  { src: '/compu-fest-images/IMG_0653.webp', alt: 'CompuFest 2026 - 3' },
  { src: '/compu-fest-images/IMG_0654.webp', alt: 'CompuFest 2026 - 4' },
  { src: '/compu-fest-images/IMG_0655.webp', alt: 'CompuFest 2026 - 5' },
  { src: '/compu-fest-images/IMG_0656.webp', alt: 'CompuFest 2026 - 6' },
  { src: '/compu-fest-images/IMG_0657.webp', alt: 'CompuFest 2026 - 7' },
  { src: '/compu-fest-images/IMG_0659.webp', alt: 'CompuFest 2026 - 8' },
  { src: '/compu-fest-images/IMG_0660.webp', alt: 'CompuFest 2026 - 9' },
  { src: '/compu-fest-images/IMG_0662.webp', alt: 'CompuFest 2026 - 10' },
  { src: '/compu-fest-images/IMG_0664.webp', alt: 'CompuFest 2026 - 11' },
  { src: '/compu-fest-images/IMG_0667.webp', alt: 'CompuFest 2026 - 12' },
  { src: '/compu-fest-images/IMG_0669.webp', alt: 'CompuFest 2026 - 13' },
  { src: '/compu-fest-images/IMG_0670.webp', alt: 'CompuFest 2026 - 14' },
  { src: '/compu-fest-images/IMG_0671.webp', alt: 'CompuFest 2026 - 15' }
];

export function GalleryDemo() {
  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, position: 'relative' }}>
        <DomeGallery
          images={COMPUFEST_IMAGES}
          fit={0.8}
          minRadius={600}
          maxVerticalRotationDeg={0}
          segments={34}
          dragDampening={2}
          grayscale={false}
        />
      </div>
    </div>
  );
}
