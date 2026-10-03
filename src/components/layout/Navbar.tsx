import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import { useAuth } from '../../hooks/useAuth';
import { useCalmMode } from '../../hooks/useCalmMode';
import { Sparkles, User as UserIcon, LogOut, Eye, EyeOff } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isDemo, logout, isAuthenticated } = useAuth();
  const { isCalm, toggleCalmMode } = useCalmMode();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-rice-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/app" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-indigo-ink rounded-xl p-1">
          <Logo size="md" />
          <span className="hidden sm:inline-block text-[11px] font-semibold text-indigo-ink bg-rice-panel px-2.5 py-1 rounded-full border border-rice-border">
            SRM GDG Technical
          </span>
        </Link>

        {/* Right side items: Calm Mode Toggle, Demo Mode Badge, User Menu / Auth */}
        <div className="flex items-center gap-3">
          {/* Calm Mode Toggle (Section 2.4) */}
          <button
            type="button"
            onClick={toggleCalmMode}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-heading font-semibold transition-all border ${
              isCalm
                ? 'bg-haldi text-indigo-ink border-indigo-ink shadow-sm'
                : 'bg-rice-panel text-indigo-ink/80 border-rice-border hover:border-indigo-ink/40'
            }`}
            title={isCalm ? 'Calm mode is ACTIVE (motion & particles paused)' : 'Click to enable Calm mode (quieter background)'}
            aria-label="Toggle Calm Mode"
            aria-pressed={isCalm}
          >
            {isCalm ? <EyeOff className="w-3.5 h-3.5 text-indigo-ink" /> : <Eye className="w-3.5 h-3.5 text-indigo-ink/70" />}
            <span className="hidden md:inline">{isCalm ? 'Calm Mode' : 'Calm Mode'}</span>
          </button>

          {isDemo && (
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-haldi/20 text-indigo-ink border border-haldi/50 shadow-sm"
              title="You are browsing with a pre-seeded demo account. Data resets locally."
            >
              <Sparkles className="w-3.5 h-3.5 text-sindoor" />
              <span>Demo Mode</span>
            </div>
          )}

          <Link
            to="/terms"
            className="text-xs text-indigo-ink/75 hover:text-sindoor font-semibold transition-colors px-2 py-1 rounded-md"
          >
            Terms
          </Link>

          {isAuthenticated && user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-rice-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-ink text-rice flex items-center justify-center font-heading font-bold text-xs shadow-sm border border-haldi/40">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-xs font-semibold text-indigo-ink leading-tight">{user.name}</span>
                  <span className="text-[10px] text-indigo-ink/65 leading-tight">{user.email}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="p-1.5 text-indigo-ink/70 hover:text-sindoor rounded-lg hover:bg-sindoor/10 transition-colors"
                title="Log out of session"
                aria-label="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-heading font-bold text-rice bg-sindoor hover:bg-sindoor-600 rounded-xl shadow-sm shadow-haldi-glow hover:shadow transition-all active:scale-95 border border-haldi"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
