import { useState, useEffect, useMemo } from 'react';

const HEADER_HEIGHT = 73;

export const useSidebarScroll = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const progress = Math.min(scrollTop / HEADER_HEIGHT, 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sidebarTop = useMemo(() => HEADER_HEIGHT - scrollProgress * HEADER_HEIGHT, [scrollProgress]);

  const sidebarHeight = useMemo(
    () => `calc(100vh - ${HEADER_HEIGHT - scrollProgress * HEADER_HEIGHT}px)`,
    [scrollProgress]
  );

  const borderOpacity = useMemo(() => 0.1 + scrollProgress * 0.9, [scrollProgress]);

  return {
    sidebarTop,
    sidebarHeight,
    borderOpacity,
  };
};
