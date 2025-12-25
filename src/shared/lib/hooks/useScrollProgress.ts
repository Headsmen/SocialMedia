import { useState, useEffect } from 'react';

interface UseScrollProgressOptions {
  threshold?: number;
  elementId?: string;
}

export const useScrollProgress = ({ threshold = 73, elementId }: UseScrollProgressOptions = {}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const element = elementId ? document.getElementById(elementId) : window;

      let scrollY: number;
      let maxScroll: number;

      if (element === window) {
        scrollY = window.scrollY;
        maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      } else {
        const elem = element as HTMLElement;
        scrollY = elem.scrollTop;
        maxScroll = elem.scrollHeight - elem.clientHeight;
      }

      const scrollProgress = maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0;
      setProgress(scrollProgress);
    };

    const target = elementId ? document.getElementById(elementId) : window;
    target?.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      target?.removeEventListener('scroll', handleScroll);
    };
  }, [elementId]);

  return {
    progress,
    top: threshold - progress * threshold,
  };
};
