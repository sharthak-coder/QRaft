import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Logo } from '../components/ui/Logo';
import { useAuth } from '../hooks/useAuth';
import { evaluatePasswordStrength } from '../lib/crypto';
import { Sparkles, ArrowRight, ShieldAlert, Eye, EyeOff } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, signUp, loginDemo } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const strength = evaluatePasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isSignUp) {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError('Please enter a valid email address.');
        return;
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (!agreedToTerms) {
        setError('You must agree to the Terms & Conditions and Privacy Policy to create an account.');
        return;
      }

      setLoading(true);
      try {
        await signUp(name, email, password);
        navigate('/app');
      } catch (err: any) {
        setError(err.message || 'Failed to sign up.');
      } finally {
        setLoading(false);
      }
    } else {
      if (!email.trim() || !password) {
        setError('Please enter your email and password.');
        return;
      }

      setLoading(true);
      try {
        await login(email, password);
        navigate('/app');
      } catch (err: any) {
        setError(err.message || 'Invalid email or password.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDemoLogin = () => {
    loginDemo();
    navigate('/app');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 z-10 relative">
      <div className="w-full max-w-md">
        {/* Header Branding */}
        <div className="flex flex-col items-center mb-6 text-center">
          <Logo size="lg" className="mb-2" />
          <p className="text-xs text-surface-muted">Craft QR codes that stand out</p>
        </div>

        {/* Auth Card */}
        <div className="p-8 rounded-3xl bg-white/95 backdrop-blur-xl border border-surface-border shadow-lift">
          {/* Quick Demo Access Button */}
          <div className="mb-6 p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-left">
              <Sparkles className="w-4 h-4 text-google-blue-royal flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-google-blue-royal">Reviewing this project?</p>
                <p className="text-[11px] text-surface-muted">Pre-filled templates, recent items & feed.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white border border-google-blue/30 text-google-blue-royal hover:bg-google-blue/5 text-xs font-bold shadow-sm transition-all whitespace-nowrap active:scale-95"
            >
              Try Demo Account
            </button>
          </div>

          {/* Tab switch between Sign In and Sign Up */}
          <div className="flex rounded-xl bg-surface-soft p-1 mb-6 border border-surface-border/80">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(false);
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                !isSignUp ? 'bg-white text-surface-text shadow-sm' : 'text-surface-muted hover:text-surface-text'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(true);
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                isSignUp ? 'bg-white text-surface-text shadow-sm' : 'text-surface-muted hover:text-surface-text'
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-google-red text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-surface-text mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border text-sm focus:outline-none focus:ring-2 focus:ring-google-blue"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-surface-text mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border text-sm focus:outline-none focus:ring-2 focus:ring-google-blue"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-surface-text">Password</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-surface-muted hover:text-surface-text flex items-center gap-1"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPassword ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border text-sm focus:outline-none focus:ring-2 focus:ring-google-blue"
                required
              />

              {/* Password Strength Indicator on Sign Up */}
              {isSignUp && password && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-surface-muted">Strength:</span>
                    <span className="font-bold" style={{ color: strength.color }}>
                      {strength.label}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex gap-1">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className="h-full flex-1 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor:
                            step <= strength.score ? strength.color : '#E2E8F0',
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-surface-text mb-1">Confirm Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border text-sm focus:outline-none focus:ring-2 focus:ring-google-blue"
                  required
                />
              </div>
            )}

            {/* Terms checkbox */}
            {isSignUp && (
              <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 rounded border-surface-border text-google-blue focus:ring-google-blue"
                />
                <span className="text-xs text-surface-muted leading-tight">
                  I agree to the{' '}
                  <Link to="/terms" className="text-google-blue-royal font-semibold hover:underline" target="_blank">
                    Terms & Conditions and Privacy Policy
                  </Link>
                </span>
              </label>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-google-blue-royal to-google-blue hover:from-google-blue-deep hover:to-google-blue-royal text-white font-heading font-bold text-sm shadow-royal-glow hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Client-Side Architecture Honest Notice */}
          <div className="mt-6 pt-5 border-t border-surface-border/80 flex items-start gap-2 text-[11px] text-surface-muted">
            <ShieldAlert className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Browser-Only Demo:</strong> Accounts use PBKDF2 Web Crypto hashing and store sessions in local browser storage. No data is transmitted to an external server.
            </p>
          </div>
        </div>

        {/* Back to Home / Guest Workspace */}
        <div className="mt-4 text-center">
          <Link to="/app" className="text-xs font-semibold text-surface-muted hover:text-google-blue-royal">
            Continue as Guest &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};
