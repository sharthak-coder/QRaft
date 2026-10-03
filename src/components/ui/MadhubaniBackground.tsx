import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { FishPair } from '../../art/FishPair';
import { Peacock } from '../../art/Peacock';
import { Lotus } from '../../art/Lotus';
import { Sun } from '../../art/Sun';
import { Moon } from '../../art/Moon';
import { Kadamba } from '../../art/Kadamba';
import { LeafVine } from '../../art/LeafVine';
import { MadhubaniPatternDefs } from '../../art/PatternFill';
import { useCalmMode } from '../../hooks/useCalmMode';

export const MadhubaniBackground: React.FC = () => {
  const location = useLocation();
  const isWelcome = location.pathname === '/';
  const shouldReduceMotion = useReducedMotion();
  const { isCalm } = useCalmMode();

  // Tab visibility check to pause animations when hidden
  const [isTabVisible, setIsTabVisible] = useState(true);
  useEffect(() => {
    const handleVisibility = () => {
      setIsTabVisible(document.visibilityState === 'visible');
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Cursor parallax on desktop (disabled when Calm Mode or Reduced Motion is active)
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (shouldReduceMotion || isCalm) {
      setMouseOffset({ x: 0, y: 0 });
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        const xNorm = (e.clientX / window.innerWidth - 0.5) * 16;
        const yNorm = (e.clientY / window.innerHeight - 0.5) * 16;
        setMouseOffset({ x: xNorm, y: yNorm });
        rafRef.current = null;
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [shouldReduceMotion, isCalm]);

  // Motion config active only when tab is visible and reduced motion / calm mode are off
  const enableMotion = isTabVisible && !shouldReduceMotion && !isCalm;

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-rice"
      aria-hidden="true"
    >
      {/* Reusable SVG Pattern Defs */}
      <MadhubaniPatternDefs strokeColor="#1A3644" />

      {/* Faint Rangoli Dot Grid */}
      <div className="absolute inset-0 bg-dot-pattern opacity-40" />

      {/* Asymmetrical Motifs with High Negative Space */}
      {isWelcome ? (
        // WELCOME PAGE: Richer artistic presentation
        <>
          {/* Top-Right: Proud Peacock */}
          <motion.div
            className="absolute -top-10 -right-12 md:right-4 w-72 md:w-96 opacity-[0.09] text-indigo-ink"
            initial={shouldReduceMotion || isCalm ? false : { opacity: 0, scale: 0.95 }}
            animate={
              enableMotion
                ? {
                    opacity: 0.1,
                    scale: 1,
                    x: mouseOffset.x * 0.8,
                    y: [0, -10, 0],
                  }
                : { opacity: 0.07 }
            }
            transition={{
              y: { duration: 18, repeat: Infinity, ease: 'easeInOut' },
              opacity: { duration: 1.2 },
            }}
          >
            <Peacock size="100%" strokeColor="#1A3644" fillColor="#2D5A3E" accentColor="#D99B26" secondaryFill="#A62B2B" />
          </motion.div>

          {/* Top-Left: Warm Radiating Sun */}
          <motion.div
            className="absolute -top-12 -left-12 md:left-6 w-64 md:w-80 opacity-[0.08]"
            initial={shouldReduceMotion || isCalm ? false : { opacity: 0, rotate: -15 }}
            animate={
              enableMotion
                ? {
                    opacity: 0.09,
                    x: -mouseOffset.x * 0.6,
                    y: [0, 8, 0],
                    rotate: [0, 6, 0],
                  }
                : { opacity: 0.06 }
            }
            transition={{
              y: { duration: 22, repeat: Infinity, ease: 'easeInOut' },
              rotate: { duration: 30, repeat: Infinity, ease: 'easeInOut' },
              opacity: { duration: 1.4 },
            }}
          >
            <Sun size="100%" strokeColor="#1A3644" fillColor="#D99B26" accentColor="#A62B2B" secondaryFill="#2D5A3E" />
          </motion.div>

          {/* Bottom-Left: Harmonious Fish Pair */}
          <motion.div
            className="absolute -bottom-16 -left-16 md:left-10 w-80 md:w-[28rem] opacity-[0.09]"
            initial={shouldReduceMotion || isCalm ? false : { opacity: 0, y: 30 }}
            animate={
              enableMotion
                ? {
                    opacity: 0.1,
                    x: mouseOffset.x * 0.5,
                    y: [0, -12, 0],
                  }
                : { opacity: 0.07 }
            }
            transition={{
              y: { duration: 20, repeat: Infinity, ease: 'easeInOut' },
              opacity: { duration: 1.5 },
            }}
          >
            <FishPair size="100%" strokeColor="#1A3644" fillColor="#D99B26" accentColor="#A62B2B" secondaryFill="#2D5A3E" />
          </motion.div>

          {/* Bottom-Right: Blooming Sacred Lotus */}
          <motion.div
            className="absolute bottom-6 right-8 md:right-24 w-60 md:w-72 opacity-[0.08]"
            initial={shouldReduceMotion || isCalm ? false : { opacity: 0, scale: 0.9 }}
            animate={
              enableMotion
                ? {
                    opacity: 0.09,
                    x: -mouseOffset.x * 0.7,
                    y: [0, 10, 0],
                  }
                : { opacity: 0.06 }
            }
            transition={{
              y: { duration: 16, repeat: Infinity, ease: 'easeInOut' },
              opacity: { duration: 1.6 },
            }}
          >
            <Lotus size="100%" strokeColor="#1A3644" fillColor="#A62B2B" accentColor="#D99B26" />
          </motion.div>

          {/* Floating Sacred Kadamba Tree Motif */}
          <div className="absolute top-1/2 left-4 w-32 opacity-[0.05] hidden lg:block">
            <Kadamba size="100%" strokeColor="#1A3644" fillColor="#2D5A3E" accentColor="#D99B26" secondaryFill="#A62B2B" />
          </div>

          {/* Gentle Floating Chandra / Moon Motif */}
          <div className="absolute top-1/3 right-8 w-24 opacity-[0.06] hidden lg:block">
            <Moon size="100%" strokeColor="#1A3644" fillColor="#D99B26" accentColor="#A62B2B" />
          </div>
        </>
      ) : (
        // WORKSPACE TABS (Calm Workspace Rule - Section 2.4):
        // Quieter, lower opacity, fewer elements, behind solid rice panels so no pattern is ever behind small text
        <>
          <div className="absolute -top-16 -right-16 w-80 opacity-[0.035] pointer-events-none">
            <Peacock size="100%" strokeColor="#1A3644" fillColor="#2D5A3E" accentColor="#D99B26" secondaryFill="#A62B2B" />
          </div>
          <div className="absolute -bottom-20 -left-20 w-96 opacity-[0.035] pointer-events-none">
            <FishPair size="100%" strokeColor="#1A3644" fillColor="#D99B26" accentColor="#A62B2B" secondaryFill="#2D5A3E" />
          </div>
          <div className="absolute top-1/2 -right-10 w-48 opacity-[0.025] pointer-events-none">
            <LeafVine size="100%" strokeColor="#1A3644" fillColor="#2D5A3E" />
          </div>
        </>
      )}
    </div>
  );
};
