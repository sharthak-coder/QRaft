import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/ui/Logo';
import { ArrowLeft } from 'lucide-react';
import { Sun } from '../art/Sun';
import { Corner } from '../art/Corner';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center z-10 relative">
      <div
        className="max-w-md w-full p-8 rounded-3xl bg-paper-2/95 border border-paper-border shadow-card flex flex-col items-center relative overflow-hidden"
        style={{ outline: '1px solid rgba(19, 80, 77, 0.1)', outlineOffset: '2px' }}
      >
        <Corner position="top-right" size={28} strokeColor="#13504D" fillColor="#F79454" />
        <Logo size="md" className="mb-6" />

        <div className="mb-4">
          <Sun size={80} strokeColor="#13504D" fillColor="#F79454" accentColor="#C54845" />
        </div>

        <h1 className="text-3xl font-heading font-extrabold text-peacock-deep tracking-tight mb-2">
          Matrix Coordinate Not Found
        </h1>
        <p className="text-sm text-ink/75 mb-6 leading-relaxed">
          The QR matrix coordinates or link you were trying to access do not exist in this canvas.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-vermilion hover:bg-vermilion-500 text-white font-heading font-bold text-sm shadow-sm shadow-vermilion-glow hover:shadow-saffron-glow transition-all border-2 border-dashed border-white/40 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Studio Gate</span>
        </Link>
      </div>
    </div>
  );
};
