import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import QRCode from 'qrcode';
import { motion } from 'framer-motion';
import { Logo } from '../components/ui/Logo';
import { useAuth } from '../hooks/useAuth';
import { ShieldCheck, Box, Share2, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

const DEMO_PHRASES = [
  'https://gdg.community.dev/srmist',
  'Craft QR codes that stand out.',
  'WIFI:T:WPA;S:SRM-Innovation;P:Hack2026;;',
  'mailto:leads@gdgsrm.org?subject=QRaft%20Demo',
];

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Typewriter demo state
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Typewriter effect
  useEffect(() => {
    const currentPhrase = DEMO_PHRASES[phraseIndex];
    let timer: NodeJS.Timeout;

    if (!isDeleting) {
      if (displayText.length < currentPhrase.length) {
        timer = setTimeout(() => {
          setDisplayText(currentPhrase.slice(0, displayText.length + 1));
        }, 60);
      } else {
        timer = setTimeout(() => setIsDeleting(true), 2200);
      }
    } else {
      if (displayText.length > 0) {
        timer = setTimeout(() => {
          setDisplayText(currentPhrase.slice(0, displayText.length - 1));
        }, 30);
      } else {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % DEMO_PHRASES.length);
      }
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, phraseIndex]);

  // Live QR canvas render
  useEffect(() => {
    if (canvasRef.current && displayText) {
      QRCode.toCanvas(
        canvasRef.current,
        displayText,
        {
          width: 220,
          margin: 3,
          color: {
            dark: '#1A56DB',
            light: '#FFFFFF',
          },
          errorCorrectionLevel: 'M',
        },
        () => {}
      );
    }
  }, [displayText]);

  const handleLetsGo = () => {
    sessionStorage.setItem('qraft:gate_passed', 'true');
    if (isAuthenticated) {
      navigate('/app');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between p-6 sm:p-10 max-w-7xl mx-auto z-10">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <Logo size="lg" />
        <div className="flex items-center gap-3">
          <Link
            to="/terms"
            className="text-xs font-semibold text-surface-muted hover:text-google-blue-royal transition-colors px-3 py-1.5 rounded-lg border border-surface-border bg-white/70"
          >
            Terms & Conditions
          </Link>
        </div>
      </div>

      {/* Hero section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto py-8">
        {/* Left Column: Headline, Value prop, CTA */}
        <div className="lg:col-span-7 flex flex-col items-start gap-6 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-google-blue/10 text-google-blue-royal border border-google-blue/20">
            <Sparkles className="w-3.5 h-3.5 text-google-blue" />
            <span>GDG on Campus SRM Submission &bull; Frontend Domain</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-surface-text tracking-tight leading-[1.12]">
            Craft QR codes that{' '}
            <span className="bg-gradient-to-r from-google-blue-royal via-google-blue to-google-green bg-clip-text text-transparent">
              stand out
            </span>
            .
          </h1>

          <p className="text-base sm:text-lg text-surface-muted max-w-xl leading-relaxed">
            QRaft is an advanced, privacy-first QR designer with automated WCAG contrast checks,
            real-time scan verification, and a 3D WebGL studio. Designed entirely for the browser.
          </p>

          {/* Three Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full pt-2">
            <div className="p-4 rounded-2xl bg-white/80 border border-surface-border/80 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-google-blue flex items-center justify-center mb-2.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="font-heading font-bold text-sm text-surface-text">Reliability Engine</h3>
              <p className="text-xs text-surface-muted mt-1 leading-normal">
                WCAG contrast math & instant jsQR scanner verification.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 border border-surface-border/80 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2.5">
                <Box className="w-4 h-4" />
              </div>
              <h3 className="font-heading font-bold text-sm text-surface-text">3D WebGL Studio</h3>
              <p className="text-xs text-surface-muted mt-1 leading-normal">
                Extruded 3D modules with 16 original themes & top-down scan mode.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 border border-surface-border/80 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-google-green flex items-center justify-center mb-2.5">
                <Share2 className="w-4 h-4" />
              </div>
              <h3 className="font-heading font-bold text-sm text-surface-text">Zero Backend</h3>
              <p className="text-xs text-surface-muted mt-1 leading-normal">
                Runs 100% in your browser. Encrypted URL-hash cross-device sharing.
              </p>
            </div>
          </div>

          {/* Primary Let's Go Button */}
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button
              onClick={handleLetsGo}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-google-blue-royal to-google-blue hover:from-google-blue-deep hover:to-google-blue-royal text-white font-heading font-bold text-base shadow-royal-glow hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all focus:outline-none focus:ring-4 focus:ring-google-blue/30"
            >
              <span>Let's Go</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <span className="text-xs text-surface-muted">No account required to start creating</span>
          </div>
        </div>

        {/* Right Column: Live auto-typing demo QR interactive card */}
        <div className="lg:col-span-5 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-sm p-6 rounded-3xl bg-white/90 backdrop-blur-xl border border-surface-border shadow-lift text-center relative"
          >
            {/* Live Typing Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-surface-soft text-surface-muted border border-surface-border mb-4">
              <span className="w-2 h-2 rounded-full bg-google-green animate-ping" />
              <span>Real-Time Synthesizer</span>
            </div>

            {/* Canvas Container */}
            <div className="p-4 bg-white rounded-2xl border border-surface-border shadow-inner inline-block mx-auto mb-4">
              <canvas ref={canvasRef} className="rounded-lg shadow-sm" />
            </div>

            {/* Live auto-typing text output */}
            <div className="p-3 bg-surface-soft rounded-xl border border-surface-border/80 text-left font-mono text-xs text-surface-text break-all flex items-center min-h-[44px]">
              <span className="text-google-blue-royal font-bold mr-2">&gt;</span>
              <span>{displayText}</span>
              <span className="inline-block w-1.5 h-4 bg-google-blue-royal ml-1 animate-pulse" />
            </div>

            <div className="flex items-center justify-center gap-2 mt-4 text-[11px] text-surface-muted font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-google-green" />
              <span>100% Scannable Dynamic Payload</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer info */}
      <footer className="pt-6 border-t border-surface-border/60 flex flex-col sm:flex-row items-center justify-between text-xs text-surface-muted gap-2">
        <p>QRaft &copy; 2026 &bull; Technical Submission for GDG on Campus, SRM IST</p>
        <div className="flex items-center gap-4">
          <Link to="/terms" className="hover:text-google-blue-royal underline underline-offset-2">
            Terms & Conditions &bull; Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  );
};
