import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Logo } from '../components/ui/Logo';
import { useAuth } from '../hooks/useAuth';
import { RangoliQrAnimator } from '../components/qr/RangoliQrAnimator';
import { BorderFrame, Corner } from '../art';
import { Lotus } from '../art/Lotus';
import { MadhubaniArtCredit } from '../art/ArtCreditNote';
import { ArrowRight, CheckCircle2, Sparkles, Wifi, Globe, Calendar } from 'lucide-react';

const SAMPLE_PAYLOADS = [
  {
    id: 'wifi',
    label: 'Campus Wi-Fi',
    icon: Wifi,
    payload: 'WIFI:T:WPA;S:SRM-Innovation-5G;P:CampusConnect2026;;',
    desc: 'Standard WPA Wi-Fi format for one-tap phone joining',
  },
  {
    id: 'repo',
    label: 'Project Link',
    icon: Globe,
    payload: 'https://github.com/developer/qraft',
    desc: 'HTTPS web link formatted for direct browser launch',
  },
  {
    id: 'event',
    label: 'SRM GDG Event',
    icon: Calendar,
    payload: 'https://gdg.community.dev/srm-ist',
    desc: 'Community meetup URL with embedded query parameters',
  },
];

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activeSampleIdx, setActiveSampleIdx] = useState(0);

  const activeSample = SAMPLE_PAYLOADS[activeSampleIdx];

  const handleLetsGo = () => {
    sessionStorage.setItem('qraft:gate_passed', 'true');
    if (isAuthenticated) {
      navigate('/app');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between p-5 sm:p-10 max-w-7xl mx-auto z-10">
      {/* Top Navigation */}
      <header className="flex items-center justify-between pb-6">
        <Logo size="lg" />
        <div className="flex items-center gap-3">
          <Link
            to="/terms"
            className="text-xs font-semibold text-ink/75 hover:text-peacock-deep transition-colors px-3 py-1.5 rounded-xl border border-paper-border bg-paper-2 hover:bg-paper"
          >
            Terms & Disclosures
          </Link>
        </div>
      </header>

      {/* Main Hero & Rangoli QR Showcase */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center my-auto py-6">
        {/* Left Column: Clear, honest introduction */}
        <div className="lg:col-span-7 flex flex-col items-start gap-6 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-peacock/10 text-peacock-deep border border-peacock/25">
            <Sparkles className="w-3.5 h-3.5 text-vermilion" />
            <span>GDG on Campus SRM IST &bull; Frontend Domain Submission</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-peacock-deep tracking-tight leading-[1.12]">
            QR codes crafted with{' '}
            <span className="text-vermilion underline decoration-saffron decoration-wavy decoration-2">
              Mithila folk art
            </span>{' '}
            and verified contrast.
          </h1>

          <p className="text-base sm:text-lg text-ink/80 max-w-xl leading-relaxed">
            QRaft pairs traditional Madhubani motifs with client-side matrix rendering. Every QR code is checked with
            the WCAG contrast algorithm and verified through an automatic jsQR test before you download.
          </p>

          {/* Concrete Technical Facts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full pt-1">
            <div className="p-4 rounded-2xl bg-paper-2 border border-paper-border shadow-card relative overflow-hidden">
              <Corner position="top-right" size={24} strokeColor="#13504D" fillColor="#F79454" />
              <p className="text-xs font-bold text-peacock-deep font-heading">Five Data Payloads</p>
              <p className="text-xs text-ink/70 mt-1 leading-normal">
                Generates RFC-compliant URL, plain text, email, phone dialer, and Wi-Fi network payloads.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-paper-2 border border-paper-border shadow-card relative overflow-hidden">
              <Corner position="top-right" size={24} strokeColor="#13504D" fillColor="#A5B596" />
              <p className="text-xs font-bold text-peacock-deep font-heading">Browser-Only Privacy</p>
              <p className="text-xs text-ink/70 mt-1 leading-normal">
                Rendered entirely on client HTML5 canvas. No tracking telemetry, no cloud storage dependency.
              </p>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button
              onClick={handleLetsGo}
              className="relative group px-8 py-4 rounded-2xl bg-vermilion hover:bg-vermilion-500 text-white font-heading font-bold text-base shadow-vermilion-glow hover:shadow-saffron-glow transition-all active:scale-[0.98] border-2 border-dashed border-white/40 flex items-center justify-center gap-3 cursor-pointer"
            >
              <span>Open QR Studio</span>
              <div className="transition-transform group-hover:rotate-45">
                <Lotus size={20} strokeColor="#FFFFFF" fillColor="#F79454" accentColor="#FFFDF8" />
              </div>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <span className="text-xs text-ink/65">Instant access &bull; No login required to create</span>
          </div>
        </div>

        {/* Right Column: Live Rangoli Assembly Demo */}
        <div className="lg:col-span-5 flex justify-center">
          <BorderFrame
            className="w-full max-w-sm p-6 text-center shadow-card-hover"
            cornerSize={32}
            strokeColor="#13504D"
            fillColor="#F79454"
            accentColor="#C54845"
          >
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-saffron-50 text-peacock-deep border border-saffron-200 mb-4">
              <span className="w-2 h-2 rounded-full bg-vermilion animate-ping" />
              <span>Radial Rangoli Assembly</span>
            </div>

            {/* Canvas Container with Rangoli Assembly */}
            <div className="p-3 bg-paper rounded-2xl border border-paper-border shadow-inner inline-block mx-auto mb-4">
              <RangoliQrAnimator
                key={activeSample.payload}
                payload={activeSample.payload}
                size={210}
                fgColor="#13504D"
                bgColor="#FFFDF8"
                accentColor="#C54845"
              />
            </div>

            {/* Interactive Payload Switcher */}
            <div className="space-y-2 text-left mb-4">
              <p className="text-[11px] font-bold text-peacock-deep uppercase tracking-wider">
                Select sample to trigger assembly:
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                {SAMPLE_PAYLOADS.map((sample, idx) => {
                  const isSelected = activeSampleIdx === idx;
                  const Icon = sample.icon;
                  return (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => setActiveSampleIdx(idx)}
                      className={`px-2 py-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 text-center ${
                        isSelected
                          ? 'border-peacock-deep bg-peacock-deep text-white shadow-sm'
                          : 'border-paper-border bg-paper hover:bg-paper-2 text-ink'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="text-[10px] truncate max-w-full">{sample.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Payload preview string */}
            <div className="p-2.5 bg-paper rounded-xl border border-paper-border text-left font-mono text-[11px] text-ink/80 break-all min-h-[38px]">
              <span className="text-vermilion font-bold mr-1">&gt;</span>
              <span>{activeSample.payload}</span>
            </div>

            {/* Verification confirmation */}
            <div className="flex items-center justify-center gap-1.5 mt-3 text-[11px] text-peacock-deep font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-peacock" />
              <span>Scans reliably on Android & iOS cameras</span>
            </div>
          </BorderFrame>
        </div>
      </main>

      {/* Footer & Respectful Art Style Credit */}
      <footer className="pt-6 border-t border-paper-border flex flex-col md:flex-row items-center justify-between text-xs text-ink/70 gap-4">
        <MadhubaniArtCredit className="max-w-2xl text-left" />
        <div className="flex items-center gap-4 flex-shrink-0">
          <Link to="/terms" className="hover:text-peacock-deep underline underline-offset-2">
            Terms & Privacy
          </Link>
          <span>&bull;</span>
          <span>SRM IST 2026</span>
        </div>
      </footer>
    </div>
  );
};
