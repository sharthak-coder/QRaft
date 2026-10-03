import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/ui/Logo';
import { Compass, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center z-10 relative">
      <div className="max-w-md w-full p-8 rounded-3xl bg-white/90 backdrop-blur-xl border border-surface-border shadow-lift flex flex-col items-center">
        <Logo size="md" className="mb-6" />

        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-google-yellow flex items-center justify-center mb-4">
          <Compass className="w-8 h-8 text-amber-500 animate-spin" style={{ animationDuration: '8s' }} />
        </div>

        <h1 className="text-3xl font-extrabold text-surface-text tracking-tight mb-2">404 - Not Found</h1>
        <p className="text-sm text-surface-muted mb-6 leading-relaxed">
          The QR matrix coordinates you were trying to scan don't exist or have moved elsewhere.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-google-blue-royal to-google-blue text-white font-semibold text-sm shadow-royal-glow hover:shadow-lg transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
};
