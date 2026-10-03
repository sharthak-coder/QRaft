import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import { useAuth } from '../../hooks/useAuth';
import { Sparkles, User as UserIcon, LogOut } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isDemo, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-paper-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/app" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-peacock-deep rounded-xl p-1">
          <Logo size="md" />
          <span className="hidden sm:inline-block text-[11px] font-semibold text-peacock-deep bg-paper-2 px-2.5 py-1 rounded-full border border-paper-border">
            SRM GDG Technical
          </span>
        </Link>

        {/* Right side items: Demo Mode Badge, User Menu / Auth */}
        <div className="flex items-center gap-3">
          {isDemo && (
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-saffron-50 text-peacock-deep border border-saffron-300 shadow-sm"
              title="You are browsing with a pre-seeded demo account. Data resets locally."
            >
              <Sparkles className="w-3.5 h-3.5 text-vermilion" />
              <span>Demo Mode</span>
            </div>
          )}

          <Link
            to="/terms"
            className="text-xs text-ink/75 hover:text-peacock-deep font-semibold transition-colors px-2 py-1 rounded-md"
          >
            Terms
          </Link>

          {isAuthenticated && user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-paper-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-peacock-deep to-peacock text-white flex items-center justify-center font-heading font-bold text-xs shadow-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-xs font-semibold text-ink leading-tight">{user.name}</span>
                  <span className="text-[10px] text-ink/65 leading-tight">{user.email}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="p-1.5 text-ink/70 hover:text-vermilion rounded-lg hover:bg-vermilion-50 transition-colors"
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
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-heading font-bold text-white bg-vermilion hover:bg-vermilion-500 rounded-xl shadow-sm shadow-vermilion-glow hover:shadow-saffron-glow transition-all active:scale-95 border border-white/30"
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
