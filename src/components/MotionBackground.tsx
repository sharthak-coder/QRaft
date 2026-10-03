import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useCalmMode } from '../hooks/useCalmMode';
import { FOLK_PALETTE } from '../lib/contrastCheck';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  rotation: number;
  vRot: number;
  shape: 'petal' | 'speck' | 'dot';
}

/**
 * Interactive HTML5 Canvas Motion Background
 * Features:
 * - 3 parallax depth layers (Surya/Chandra, Midground Fauna, Near ambient particles)
 * - Smooth lerp tracking for desktop mouse and mobile gyro tilt
 * - Idle throttling to 10 FPS after 2 seconds of inactivity
 * - Complete pause on document.hidden
 * - Single-frame static render when Calm Mode or prefers-reduced-motion is active
 * - Device pixel ratio clamping for optimal GPU/battery efficiency
 */
export const MotionBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const location = useLocation();
  const isWelcome = location.pathname === '/';
  const { isCalm, prefersReducedMotion } = useCalmMode();

  // iOS Gyro permission state if needed
  const [showGyroBtn, setShowGyroBtn] = useState(false);
  const [gyroActive, setGyroActive] = useState(false);

  // Motion state refs
  const mouseRef = useRef({
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0,
    lastActive: performance.now(),
  });

  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const lastRenderTimeRef = useRef<number>(0);

  // Initialize ambient folk particles
  const initParticles = useCallback((width: number, height: number) => {
    const count = isWelcome ? 32 : 18;
    const colors = [
      FOLK_PALETTE.indigoInk,
      FOLK_PALETTE.sindoor,
      FOLK_PALETTE.haldi,
      FOLK_PALETTE.leaf,
    ];

    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const typeRand = Math.random();
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: 0.1 + Math.random() * 0.2, // gentle downward drift
        size: 2 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.08 + Math.random() * 0.12,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.015,
        shape: typeRand > 0.6 ? 'petal' : typeRand > 0.3 ? 'dot' : 'speck',
      });
    }
    particlesRef.current = particles;
  }, [isWelcome]);

  // Request iOS Gyro Permission
  const requestGyroPermission = async () => {
    try {
      if (typeof DeviceOrientationEvent !== 'undefined') {
        const anyDeviceOrientation = DeviceOrientationEvent as unknown as {
          requestPermission?: () => Promise<'granted' | 'denied'>;
        };
        if (typeof anyDeviceOrientation.requestPermission === 'function') {
          const res = await anyDeviceOrientation.requestPermission();
          if (res === 'granted') {
            setGyroActive(true);
            setShowGyroBtn(false);
          }
        }
      }
    } catch {
      setShowGyroBtn(false);
    }
  };

  // Setup Interaction Listeners
  useEffect(() => {
    // Check if iOS permission is required
    if (typeof DeviceOrientationEvent !== 'undefined') {
      const anyDeviceOrientation = DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<'granted' | 'denied'>;
      };
      if (typeof anyDeviceOrientation.requestPermission === 'function') {
        setShowGyroBtn(true);
      }
    }

    const onPointerMove = (e: PointerEvent) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      mouseRef.current.targetX = (e.clientX / w) * 2 - 1;
      mouseRef.current.targetY = (e.clientY / h) * 2 - 1;
      mouseRef.current.lastActive = performance.now();
    };

    const onOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        setGyroActive(true);
        setShowGyroBtn(false);
        // gamma: left-to-right [-90, 90]
        // beta: front-to-back [-180, 180]
        mouseRef.current.targetX = Math.max(-1, Math.min(1, e.gamma / 40));
        mouseRef.current.targetY = Math.max(-1, Math.min(1, (e.beta - 45) / 40));
        mouseRef.current.lastActive = performance.now();
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('deviceorientation', onOrientation, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('deviceorientation', onOrientation);
    };
  }, []);

  // Main Drawing Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (particlesRef.current.length === 0) {
        initParticles(width, height);
      }
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Drawing Helpers
    const drawSurya = (
      x: number,
      y: number,
      radius: number,
      t: number,
      opacity: number
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(t * 0.03); // slow celestial rotation
      ctx.strokeStyle = FOLK_PALETTE.haldi;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = opacity;

      // Outer ray spokes
      const rays = 16;
      for (let i = 0; i < rays; i++) {
        const ang = (i * 2 * Math.PI) / rays;
        const innerR = radius * 0.9;
        const outerR = radius * (1.18 + Math.sin(t * 0.5 + i) * 0.08);
        ctx.beginPath();
        ctx.moveTo(Math.cos(ang) * innerR, Math.sin(ang) * innerR);
        ctx.lineTo(Math.cos(ang) * outerR, Math.sin(ang) * outerR);
        ctx.stroke();

        // Ray tip sacred dot
        ctx.fillStyle = FOLK_PALETTE.sindoor;
        ctx.beginPath();
        ctx.arc(Math.cos(ang) * (outerR + 4), Math.sin(ang) * (outerR + 4), 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Double concentric sun disc
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.85, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.65, 0, Math.PI * 2);
      ctx.strokeStyle = FOLK_PALETTE.sindoor;
      ctx.stroke();

      // Inner warm glow
      ctx.fillStyle = FOLK_PALETTE.haldi;
      ctx.globalAlpha = opacity * 0.4;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.6, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const drawChandra = (
      x: number,
      y: number,
      radius: number,
      t: number,
      opacity: number
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.sin(t * 0.02) * 0.08);
      ctx.globalAlpha = opacity;

      // Crescent Moon path
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0.4 * Math.PI, 1.6 * Math.PI, false);
      ctx.bezierCurveTo(
        -radius * 0.3,
        -radius * 0.6,
        -radius * 0.3,
        radius * 0.6,
        Math.cos(0.4 * Math.PI) * radius,
        Math.sin(0.4 * Math.PI) * radius
      );
      ctx.strokeStyle = FOLK_PALETTE.indigoInk;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = FOLK_PALETTE.haldi;
      ctx.globalAlpha = opacity * 0.35;
      ctx.fill();

      // Katchni hatching strokes inside the crescent
      ctx.strokeStyle = FOLK_PALETTE.indigoInk;
      ctx.lineWidth = 0.8;
      ctx.globalAlpha = opacity * 0.7;
      for (let i = -radius * 0.6; i <= radius * 0.6; i += 7) {
        ctx.beginPath();
        ctx.moveTo(-radius * 0.7, i);
        ctx.lineTo(-radius * 0.2, i + 4);
        ctx.stroke();
      }

      ctx.restore();
    };

    const drawPeacockArc = (
      x: number,
      y: number,
      scale: number,
      t: number,
      opacity: number
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);
      ctx.globalAlpha = opacity;
      ctx.strokeStyle = FOLK_PALETTE.leaf;
      ctx.lineWidth = 1.6;

      // Flowing tail feathers radiating out
      const feathers = 7;
      for (let i = 0; i < feathers; i++) {
        const spread = (i - (feathers - 1) / 2) * 0.18;
        const wave = Math.sin(t * 0.8 + i) * 8;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(
          Math.sin(spread) * 80 + wave,
          -60,
          Math.sin(spread) * 160 + wave * 1.5,
          -140
        );
        ctx.stroke();

        // Eye motif at tip of feather
        const tipX = Math.sin(spread) * 160 + wave * 1.5;
        const tipY = -140;
        ctx.beginPath();
        ctx.ellipse(tipX, tipY, 9, 6, spread, 0, Math.PI * 2);
        ctx.fillStyle = FOLK_PALETTE.haldi;
        ctx.fill();
        ctx.strokeStyle = FOLK_PALETTE.indigoInk;
        ctx.stroke();

        // Core sindoor iris
        ctx.beginPath();
        ctx.arc(tipX, tipY, 3, 0, Math.PI * 2);
        ctx.fillStyle = FOLK_PALETTE.sindoor;
        ctx.fill();
      }

      // Sinuous neck and body outline
      ctx.beginPath();
      ctx.moveTo(-15, 20);
      ctx.bezierCurveTo(-25, -20, 10, -50, 0, -85);
      ctx.strokeStyle = FOLK_PALETTE.indigoInk;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.restore();
    };

    const drawFishPair = (
      x: number,
      y: number,
      scale: number,
      t: number,
      opacity: number
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);
      ctx.globalAlpha = opacity;

      // Draw two counter-swimming twin fish
      for (let f = 0; f < 2; f++) {
        ctx.save();
        const dir = f === 0 ? 1 : -1;
        const yOffset = f === 0 ? -24 : 24;
        const phase = f * Math.PI;
        const swimWave = Math.sin(t * 1.2 + phase) * 6;

        ctx.translate(0, yOffset);
        ctx.scale(dir, 1);

        // Fish outline (Mithila almond form)
        ctx.beginPath();
        ctx.moveTo(-60, 0);
        ctx.bezierCurveTo(-30, -22 + swimWave, 20, -18, 50, 0);
        ctx.bezierCurveTo(20, 18, -30, 22 + swimWave, -60, 0);
        ctx.strokeStyle = FOLK_PALETTE.indigoInk;
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // Fish tail fin
        ctx.beginPath();
        ctx.moveTo(50, 0);
        ctx.lineTo(75, -16 + swimWave);
        ctx.quadraticCurveTo(62, 0, 75, 16 + swimWave);
        ctx.closePath();
        ctx.fillStyle = FOLK_PALETTE.sindoor;
        ctx.fill();
        ctx.stroke();

        // Eye with sindoor dot
        ctx.beginPath();
        ctx.arc(-42, -3, 4, 0, Math.PI * 2);
        ctx.fillStyle = FOLK_PALETTE.rice;
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(-42, -3, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = FOLK_PALETTE.sindoor;
        ctx.fill();

        // Bharni fish scales
        ctx.strokeStyle = FOLK_PALETTE.haldi;
        ctx.lineWidth = 1.2;
        for (let s = -18; s <= 24; s += 10) {
          ctx.beginPath();
          ctx.arc(s, 0, 8, -Math.PI / 2, Math.PI / 2);
          ctx.stroke();
        }

        ctx.restore();
      }

      ctx.restore();
    };

    const drawParticles = (
      particles: Particle[],
      parX: number,
      parY: number
    ) => {
      for (const p of particles) {
        ctx.save();
        const px = (p.x + parX * 35) % width;
        const py = (p.y + parY * 35) % height;
        const safeX = px < 0 ? px + width : px;
        const safeY = py < 0 ? py + height : py;

        ctx.translate(safeX, safeY);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;

        if (p.shape === 'petal') {
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 1.6, p.size * 0.7, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'speck') {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    };

    // Render single frame
    const render = (time: number, isSingleStaticFrame: boolean = false) => {
      ctx.clearRect(0, 0, width, height);

      // Lerp mouse positions
      const m = mouseRef.current;
      if (!isSingleStaticFrame) {
        m.currentX += (m.targetX - m.currentX) * 0.05;
        m.currentY += (m.targetY - m.currentY) * 0.05;
      } else {
        m.currentX = 0;
        m.currentY = 0;
      }

      const t = time * 0.001;

      // Base opacities honoring the Calm Workspace Rule:
      // Welcome page has richer art (~0.09); workspace has faint peripheral accents (~0.025)
      const baseAlpha = isWelcome ? 0.09 : 0.025;

      // LAYER 1: FAR CELESTIAL MOTIFS (Surya & Chandra) - Parallax factor 0.02
      const farParX = m.currentX * 14;
      const farParY = m.currentY * 14;

      if (isWelcome) {
        // Surya at Top-Left
        drawSurya(
          width * 0.12 + farParX,
          height * 0.18 + farParY,
          width < 768 ? 55 : 85,
          t,
          baseAlpha * 1.1
        );

        // Chandra at Top-Right
        drawChandra(
          width * 0.86 - farParX,
          height * 0.22 + farParY,
          width < 768 ? 40 : 65,
          t,
          baseAlpha * 0.95
        );
      } else {
        // Peripheral faint celestial presence
        drawSurya(
          width * 0.08 + farParX,
          height * 0.12 + farParY,
          60,
          t,
          baseAlpha * 0.8
        );
      }

      // LAYER 2: MIDGROUND FAUNA (Peacock & Fish Pairs) - Parallax factor 0.05
      const midParX = m.currentX * 30;
      const midParY = m.currentY * 30;

      if (isWelcome) {
        // Proud Peacock top-right quadrant
        drawPeacockArc(
          width * 0.88 + midParX,
          height * 0.68 + midParY,
          width < 768 ? 0.75 : 1.15,
          t,
          baseAlpha * 1.2
        );

        // Fish Pair bottom-left
        drawFishPair(
          width * 0.16 + midParX * 0.8,
          height * 0.82 + midParY * 0.8,
          width < 768 ? 0.8 : 1.2,
          t,
          baseAlpha * 1.15
        );
      } else {
        // Workspace tab periphery (outside central workspace cards)
        drawFishPair(
          width * 0.09 + midParX * 0.5,
          height * 0.88 + midParY * 0.5,
          0.75,
          t,
          baseAlpha * 0.9
        );
      }

      // LAYER 3: NEAR AMBIENT FOLK PARTICLES - Parallax factor 0.10
      const nearParX = m.currentX * 55;
      const nearParY = m.currentY * 55;

      if (!isSingleStaticFrame) {
        // Update particle drift
        for (const p of particlesRef.current) {
          p.x += p.vx;
          p.y += p.vy;
          p.rotation += p.vRot;
          if (p.y > height + 20) p.y = -20;
          if (p.x > width + 20) p.x = -20;
          if (p.x < -20) p.x = width + 20;
        }
      }

      drawParticles(particlesRef.current, nearParX / width, nearParY / height);
    };

    // If Calm Mode or Reduced Motion is active: Render ONE pristine frame and STOP!
    if (isCalm || prefersReducedMotion) {
      render(0, true);
      return () => {
        window.removeEventListener('resize', resize);
      };
    }

    // Animation Loop with Idle Throttling & Visibility Pause
    let isRunning = true;

    const frameLoop = (timestamp: number) => {
      if (!isRunning) return;

      // Check tab visibility
      if (document.hidden) {
        animFrameRef.current = requestAnimationFrame(frameLoop);
        return;
      }

      const idleDuration = timestamp - mouseRef.current.lastActive;
      const isIdle = idleDuration > 2000;
      const minInterval = isIdle ? 100 : 16; // 10 FPS when idle, 60 FPS when active

      if (timestamp - lastRenderTimeRef.current >= minInterval) {
        lastRenderTimeRef.current = timestamp;
        render(timestamp, false);
      }

      animFrameRef.current = requestAnimationFrame(frameLoop);
    };

    animFrameRef.current = requestAnimationFrame(frameLoop);

    return () => {
      isRunning = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [isCalm, prefersReducedMotion, isWelcome, initParticles]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none overflow-hidden z-0"
        aria-hidden="true"
      />

      {/* Optional iOS Gyro Permission Button (only rendered when iOS requires explicit opt-in) */}
      {showGyroBtn && !gyroActive && !isCalm && (
        <div className="fixed bottom-3 right-3 z-30 pointer-events-auto">
          <button
            onClick={requestGyroPermission}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-rice-panel/90 text-indigo-ink border border-rice-border shadow-sm backdrop-blur-sm active:scale-95 transition-transform"
            aria-label="Enable device tilt motion"
          >
            <span>🌀</span> Enable Tilt Motion
          </button>
        </div>
      )}
    </>
  );
};
