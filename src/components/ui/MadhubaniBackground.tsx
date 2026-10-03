import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { FishPair } from '../../art/FishPair';
import { Peacock } from '../../art/Peacock';
import { Lotus } from '../../art/Lotus';
import { Sun } from '../../art/Sun';
import { LeafVine } from '../../art/LeafVine';
import { MadhubaniPatternDefs } from '../../art/PatternFill';

export const MadhubaniBackground: React.FC = () => {
  const location = useLocation();
  const isWelcome = location.pathname === '/';
  const shouldReduceMotion = useReducedMotion();

  // Tab visibility check to pause animations when hidden
  const [isTabVisible, setIsTabVisible] = useState(true);
  useEffect(() => {
    const handleVisibility = () => {
      setIsTabVisible(document.visibilityState === 'visible');
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Subtle cursor parallax on desktop
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (shouldReduceMotion) return;

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
  }, [shouldReduceMotion]);

  // Motion config active only when tab is visible and reduced motion is off
  const enableMotion = isTabVisible && !shouldReduceMotion;

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-paper"
      aria-hidden="true"
    >
      {/* Reusable SVG Pattern Defs */}
      <MadhubaniPatternDefs strokeColor="#13504D" />

      {/* Faint Rangoli Dot Grid */}
      <div className="absolute inset-0 bg-dot-pattern opacity-60" />

      {/* Asymmetrical Motifs with High Negative Space */}
      {isWelcome ? (
        // WELCOME PAGE: Richer artistic presentation with stroke-draw entry
        <>
          {/* Top-Right: Proud Peacock */}
          <motion.div
            className="absolute -top-10 -right-12 md:right-4 w-72 md:w-96 opacity-[0.09] text-peacock-deep"
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
            animate={
              enableMotion
                ? {
                    opacity: 0.1,
                    scale: 1,
                    x: mouseOffset.x * 0.8,
                    y: [0, -10, 0],
                  }
                : { opacity: 0.08 }
            }
            transition={{
              y: { duration: 18, repeat: Infinity, ease: 'easeInOut' },
              opacity: { duration: 1.2 },
            }}
          >
            <Peacock size="100%" strokeColor="#13504D" fillColor="#2F7A72" accentColor="#F79454" secondaryFill="#C54845" />
          </motion.div>

          {/* Top-Left: Warm Radiating Sun */}
          <motion.div
            className="absolute -top-12 -left-12 md:left-6 w-64 md:w-80 opacity-[0.08]"
            initial={shouldReduceMotion ? false : { opacity: 0, rotate: -15 }}
            animate={
              enableMotion
                ? {
                    opacity: 0.09,
                    x: -mouseOffset.x * 0.6,
                    y: [0, 8, 0],
                    rotate: [0, 6, 0],
                  }
                : { opacity: 0.07 }
            }
            transition={{
              y: { duration: 22, repeat: Infinity, ease: 'easeInOut' },
              rotate: { duration: 30, repeat: Infinity, ease: 'easeInOut' },
              opacity: { duration: 1.4 },
            }}
          >
            <Sun size="100%" strokeColor="#13504D" fillColor="#F79454" accentColor="#C54845" secondaryFill="#A5B596" />
          </motion.div>

          {/* Bottom-Left: Harmonious Fish Pair */}
          <motion.div
            className="absolute -bottom-16 -left-16 md:left-10 w-80 md:w-[28rem] opacity-[0.09]"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
            animate={
              enableMotion
                ? {
                    opacity: 0.1,
                    x: mouseOffset.x * 0.5,
                    y: [0, -12, 0],
                  }
                : { opacity: 0.08 }
            }
            transition={{
              y: { duration: 20, repeat: Infinity, ease: 'easeInOut' },
              opacity: { duration: 1.5 },
            }}
          >
            <FishPair size="100%" strokeColor="#13504D" fillColor="#F79454" accentColor="#C54845" secondaryFill="#A5B596" />
          </motion.div>

          {/* Bottom-Right: Blooming Sacred Lotus */}
          <motion.div
            className="absolute bottom-6 right-8 md:right-24 w-60 md:w-72 opacity-[0.08]"
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.9 }}
            animate={
              enableMotion
                ? {
                    opacity: 0.09,
                    x: -mouseOffset.x * 0.7,
                    y: [0, 10, 0],
                  }
                : { opacity: 0.07 }
            }
            transition={{
              y: { duration: 16, repeat: Infinity, ease: 'easeInOut' },
              opacity: { duration: 1.6 },
            }}
          >
            <Lotus size="100%" strokeColor="#13504D" fillColor="#C54845" accentColor="#F79454" secondaryFill="#A5B596" />
          </motion.div>

          {/* Left Edge: Swaying Vine */}
          <motion.div
            className="absolute top-1/3 -left-4 hidden lg:block opacity-[0.07]"
            animate={
              enableMotion
                ? {
                    rotate: [-1.5, 1.5, -1.5],
                    y: [0, -6, 0],
                  }
                : undefined
            }
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <LeafVine orientation="vertical" size={280} strokeColor="#13504D" fillColor="#A5B596" accentColor="#F79454" />
          </motion.div>
        </>
      ) : (
        // WORKSPACE / APP PAGES: Ultra-minimal peripheral motifs to keep tools 100% readable
        <>
          {/* Subtle Top-Right Sun Fragment */}
          <motion.div
            className="absolute -top-20 -right-20 w-80 opacity-[0.04]"
            animate={
              enableMotion
                ? {
                    rotate: [0, 10, 0],
                  }
                : undefined
            }
            transition={{ duration: 40, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sun size="100%" strokeColor="#13504D" fillColor="#F79454" />
          </motion.div>

          {/* Subtle Bottom-Left Fish Fragment */}
          <motion.div
            className="absolute -bottom-24 -left-24 w-96 opacity-[0.04]"
            animate={
              enableMotion
                ? {
                    x: [0, 10, 0],
                    y: [0, -8, 0],
                  }
                : undefined
            }
            transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          >
            <FishPair size="100%" strokeColor="#13504D" fillColor="#F79454" />
          </motion.div>

          {/* Subtle Peripheral Lotus in Bottom Corner */}
          <div className="absolute -bottom-10 -right-10 w-64 opacity-[0.035]">
            <Lotus size="100%" strokeColor="#13504D" fillColor="#C54845" />
          </div>
        </>
      )}
    </div>
  );
};
