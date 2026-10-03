import { useState, useEffect, useCallback } from 'react';

const CALM_MODE_KEY = 'qraft:calm-mode';
const EVENT_NAME = 'qraft:calm-mode-change';

/**
 * Hook for managing Calm Mode across the workspace.
 * When enabled: disables parallax motion, particle simulations, and continuous animations,
 * while maintaining static folk frames and decorations.
 * Automatically active under prefers-reduced-motion.
 */
export function useCalmMode() {
  const [isCalm, setIsCalm] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;

    const saved = localStorage.getItem(CALM_MODE_KEY);
    if (saved !== null) {
      return saved === 'true';
    }

    // Default to true if system prefers reduced motion
    if (typeof window.matchMedia === 'function') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  const prefersReducedMotion = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === CALM_MODE_KEY && e.newValue !== null) {
        setIsCalm(e.newValue === 'true');
      }
    };

    const handleCustom = (e: Event) => {
      const customEvent = e as CustomEvent<boolean>;
      setIsCalm(customEvent.detail);
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener(EVENT_NAME, handleCustom);

    let mediaQuery: MediaQueryList | null = null;
    let handleMediaChange: ((e: MediaQueryListEvent) => void) | null = null;

    if (typeof window.matchMedia === 'function') {
      mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      handleMediaChange = (e: MediaQueryListEvent) => {
        const saved = localStorage.getItem(CALM_MODE_KEY);
        if (saved === null && e.matches) {
          setIsCalm(true);
        }
      };
      mediaQuery.addEventListener('change', handleMediaChange);
    }

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(EVENT_NAME, handleCustom);
      if (mediaQuery && handleMediaChange) {
        mediaQuery.removeEventListener('change', handleMediaChange);
      }
    };
  }, []);

  const toggleCalmMode = useCallback(() => {
    setIsCalm((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(CALM_MODE_KEY, String(next));
      } catch (e) {
        console.error('Failed to save calm mode preference', e);
      }
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: next }));
      return next;
    });
  }, []);

  return {
    isCalm,
    toggleCalmMode,
    prefersReducedMotion,
  };
}
