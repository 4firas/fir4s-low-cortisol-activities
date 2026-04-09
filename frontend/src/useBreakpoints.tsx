import { useEffect, useMemo, useRef, useState } from 'react';

const useWindowSizeDebounced = (delay = 150) => {
  const [size, setSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const handleResize = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setSize({ width: window.innerWidth, height: window.innerHeight });
      }, delay);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [delay]);

  return size;
};

export const useWindowAspectRatio = () => {
  const windowSize = useWindowSizeDebounced();
  const aspectRatio = windowSize.width / windowSize.height;
  return aspectRatio;
};

export const useBreakpoints = () => {
  const aspectRatio = useWindowAspectRatio();

  return useMemo(() => ({
    projects: aspectRatio >= 0.8,
    projectOpen: aspectRatio >= 1,
    menu: aspectRatio >= 1,
    about: aspectRatio >= 1,
    square: aspectRatio >= 1,
  }), [aspectRatio >= 0.8, aspectRatio >= 1]);
};
