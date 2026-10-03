import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Logo } from '../components/ui/Logo';
import { useAuth } from '../hooks/useAuth';
import { evaluatePasswordStrength } from '../lib/crypto';
import { Sparkles, ArrowRight, ShieldAlert, Eye, EyeOff } from 'lucide-react';
import { Corner } from '../art/Corner';

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
        setError('You must agree to the Terms & Disclosures to create an account.');
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
          <p className="text-xs text-ink/75 font-heading">Handcrafted Madhubani QR Studio</p>
        </div>

        {/* Auth Card */}
        <div
          className="p-8 rounded-3xl bg-paper-2/95 border border-paper-border shadow-card relative overflow-hidden"
          style={{ outline: '1px solid rgba(19, 80, 77, 0.1)', outlineOffset: '2px' }}
        >
          <Corner position="top-right" size={28} strokeColor="#13504D" fillColor="#F79454" />

          {/* Quick Demo Access Button */}
          <div className="mb-6 p-3.5 rounded-2xl bg-saffron-50 border border-saffron-300 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-left">
              <Sparkles className="w-4 h-4 text-vermilion flex-shrink-0" />
              <div>
                <p className="text-xs font-heading font-bold text-peacock-deep">Reviewing this submission?</p>
                <p className="text-[11px] text-ink/70">Pre-seeded templates and local workspace.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-paper border border-peacock/40 text-peacock-deep hover:bg-paper-2 text-xs font-heading font-bold shadow-sm transition-all whitespace-nowrap active:scale-95 cursor-pointer"
            >
              Try Demo Account
            </button>
          </div>

          {/* Tab switch between Sign In and Sign Up */}
          <div className="flex rounded-xl bg-paper p-1 mb-6 border border-paper-border">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(false);
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-heading font-bold rounded-lg transition-all ${
                !isSignUp
                  ? 'bg-peacock-deep text-white shadow-sm'
                  : 'text-ink/70 hover:text-peacock-deep'
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
              className={`flex-1 py-2 text-xs font-heading font-bold rounded-lg transition-all ${
                isSignUp
                  ? 'bg-peacock-deep text-white shadow-sm'
                  : 'text-ink/70 hover:text-peacock-deep'
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-vermilion-50/60 border border-vermilion/30 text-vermilion text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-heading font-semibold text-peacock-deep mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-paper-border bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-peacock-deep"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-heading font-semibold text-peacock-deep mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-paper-border bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-peacock-deep"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-heading font-semibold text-peacock-deep">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-ink/70 hover:text-peacock-deep flex items-center gap-1"
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
                className="w-full px-3.5 py-2.5 rounded-xl border border-paper-border bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-peacock-deep"
                required
              />

              {/* Password Strength Indicator on Sign Up */}
              {isSignUp && password && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-ink/65">Strength:</span>
                    <span className="font-bold" style={{ color: strength.color }}>
                      {strength.label}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-paper-border rounded-full overflow-hidden flex gap-1">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className="h-full flex-1 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor:
                            step <= strength.score ? strength.color : '#E8DEC8',
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {isSignUp && (
              <div>
                <label className="block text-xs font-heading font-semibold text-peacock-deep mb-1">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-paper-border bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-peacock-deep"
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
                  className="mt-0.5 rounded border-paper-border text-peacock-deep focus:ring-peacock-deep"
                />
                <span className="text-xs text-ink/75 leading-tight">
                  I agree to the{' '}
                  <Link to="/terms" className="text-peacock-deep font-semibold underline hover:text-vermilion" target="_blank">
                    Terms & Privacy Disclosures
                  </Link>
                </span>
              </label>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-vermilion hover:bg-vermilion-500 text-white font-heading font-bold text-sm shadow-sm shadow-vermilion-glow hover:shadow-saffron-glow transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 border-2 border-dashed border-white/40 cursor-pointer"
            >
              <span>{loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Client-Side Architecture Honest Notice */}
          <div className="mt-6 pt-5 border-t border-paper-border flex items-start gap-2 text-[11px] text-ink/70">
            <ShieldAlert className="w-4 h-4 text-vermilion flex-shrink-0 mt-0.5" />
            <p>
              <strong>Browser-Only Architecture:</strong> Accounts derive keys via PBKDF2 Web Crypto hashing and store sessions in local browser storage. No credentials leave your device.
            </p>
          </div>
        </div>

        {/* Back to Home / Guest Workspace */}
        <div className="mt-4 text-center">
          <Link to="/app" className="text-xs font-semibold text-ink/75 hover:text-peacock-deep">
            Continue to Workspace as Guest &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};
