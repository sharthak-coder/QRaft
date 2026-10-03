import React from 'react';
import { motion } from 'framer-motion';

export const AbstractBackground: React.FC = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {/* Subtle Google-colored dot grid */}
      <div className="absolute inset-0 bg-dot-pattern opacity-60" />

      {/* Floating Blobs in Google Palette */}
      {/* 1. Google Blue / Royal Blob */}
      <motion.div
        className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-gradient-to-br from-google-blue/15 to-google-blue-royal/10 blur-3xl"
        animate={{
          x: [0, 40, -20, 0],
          y: [0, 30, -15, 0],
          scale: [1, 1.08, 0.95, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* 2. Google Red Blob */}
      <motion.div
        className="absolute top-1/4 -right-28 w-[28rem] h-[28rem] rounded-full bg-gradient-to-bl from-google-red/10 to-pink-500/5 blur-3xl"
        animate={{
          x: [0, -35, 25, 0],
          y: [0, -40, 20, 0],
          scale: [1, 0.94, 1.05, 1],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* 3. Google Yellow / Warm Amber Blob */}
      <motion.div
        className="absolute top-2/3 left-1/4 w-80 h-80 rounded-full bg-gradient-to-tr from-google-yellow/15 to-amber-300/10 blur-3xl"
        animate={{
          x: [0, 30, -30, 0],
          y: [0, -25, 35, 0],
          scale: [1, 1.1, 0.92, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* 4. Google Green Blob */}
      <motion.div
        className="absolute -bottom-28 -right-16 w-96 h-96 rounded-full bg-gradient-to-tl from-google-green/12 to-emerald-400/8 blur-3xl"
        animate={{
          x: [0, -25, 30, 0],
          y: [0, 35, -25, 0],
          scale: [1, 0.96, 1.07, 1],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Gentle Decorative Abstract Geometric Rings */}
      <svg
        className="absolute top-20 right-1/4 w-48 h-48 opacity-[0.06] text-google-blue-royal hidden md:block"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="50" cy="50" r="40" strokeDasharray="4 4" />
        <circle cx="50" cy="50" r="28" />
        <rect x="36" y="36" width="28" height="28" rx="6" />
      </svg>

      <svg
        className="absolute bottom-24 left-16 w-36 h-36 opacity-[0.05] text-google-green hidden md:block"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="20" y="20" width="60" height="60" rx="14" strokeDasharray="3 3" />
        <circle cx="50" cy="50" r="18" />
      </svg>
    </div>
  );
};
