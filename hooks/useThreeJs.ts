import { useEffect, useState } from 'react';

// Lazy load Three.js only when needed
export const useThreeJs = () => {
  const [THREE, setTHREE] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Dynamically import Three.js only when component mounts
    import('three').then((module) => {
      setTHREE(module.default || module);
      setIsLoading(false);
    }).catch((err) => {
      console.error('Failed to load Three.js:', err);
      setIsLoading(false);
    });
  }, []);

  return { THREE, isLoading };
};
