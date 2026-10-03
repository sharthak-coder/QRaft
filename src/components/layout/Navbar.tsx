import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import { useAuth } from '../../hooks/useAuth';
import { Sparkles, User as UserIcon, LogOut } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isDemo, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-surface-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link to="/app" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-google-blue rounded-xl p-1">
          <Logo size="md" />
          <span className="hidden sm:inline-block text-xs font-medium text-surface-muted bg-surface-soft px-2.5 py-1 rounded-full border border-surface-border">
            SRM GDG Technical
          </span>
        </Link>

        {/* Right side items: Demo Mode Badge, User Menu / Auth */}
        <div className="flex items-center gap-3">
          {/* Demo Mode Badge */}
          {isDemo && (
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 shadow-sm animate-pulse"
              title="You are browsing with a pre-seeded demo account. Data resets locally."
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Demo Mode</span>
            </div>
          )}

          {/* Terms quick link */}
          <Link
            to="/terms"
            className="text-xs text-surface-muted hover:text-google-blue-royal font-medium transition-colors px-2 py-1 rounded-md"
          >
            Terms
          </Link>

          {/* User status */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-surface-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-google-blue-royal to-google-blue text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-xs font-semibold text-surface-text leading-tight">{user.name}</span>
                  <span className="text-[10px] text-surface-muted leading-tight">{user.email}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="p-1.5 text-surface-muted hover:text-google-red rounded-lg hover:bg-red-50 transition-colors"
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
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-google-blue-royal to-google-blue hover:from-google-blue-deep hover:to-google-blue-royal rounded-xl shadow-sm shadow-royal-glow hover:shadow-md transition-all active:scale-95"
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
