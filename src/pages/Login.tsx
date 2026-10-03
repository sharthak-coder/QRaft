import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Logo } from '../components/ui/Logo';
import { useAuth } from '../hooks/useAuth';
import { evaluatePasswordStrength } from '../lib/crypto';
import { Sparkles, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { DoubleLineBorder } from '../art/DoubleLineBorder';

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
          <p className="text-xs text-indigo-ink/75 font-heading">Handcrafted Madhubani QR Studio</p>
        </div>

        {/* Auth Card wrapped in DoubleLineBorder */}
        <DoubleLineBorder
          variant="kachni"
          strokeColor="#1A3644"
          bandColor="#D99B26"
          className="p-7 sm:p-8 bg-rice shadow-folk-card"
        >
          {/* Quick Demo Access Button */}
          <div className="mb-6 p-3.5 rounded-2xl bg-haldi/20 border border-haldi/50 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-left">
              <Sparkles className="w-4 h-4 text-sindoor flex-shrink-0" />
              <div>
                <p className="text-xs font-heading font-bold text-indigo-ink">Reviewing this submission?</p>
                <p className="text-[11px] text-indigo-ink/70">Pre-seeded templates and local workspace.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-rice border-2 border-indigo-ink text-indigo-ink hover:bg-rice-panel text-xs font-heading font-bold shadow-sm transition-all whitespace-nowrap active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-ink"
            >
              Try Demo Account
            </button>
          </div>

          {/* Tab switch between Sign In and Sign Up */}
          <div className="flex rounded-xl bg-rice-panel p-1 mb-6 border border-rice-border">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(false);
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-heading font-bold rounded-lg transition-all ${
                !isSignUp
                  ? 'bg-indigo-ink text-rice shadow-sm'
                  : 'text-indigo-ink/70 hover:text-indigo-ink'
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
                  ? 'bg-indigo-ink text-rice shadow-sm'
                  : 'text-indigo-ink/70 hover:text-indigo-ink'
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-sindoor/15 border border-sindoor/30 text-sindoor text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-heading font-semibold text-indigo-ink mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-rice-border bg-rice text-indigo-ink text-base focus:outline-none focus:ring-2 focus:ring-haldi"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-heading font-semibold text-indigo-ink mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-rice-border bg-rice text-indigo-ink text-base focus:outline-none focus:ring-2 focus:ring-haldi"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-heading font-semibold text-indigo-ink">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-indigo-ink/70 hover:text-indigo-ink flex items-center gap-1"
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
                className="w-full px-3.5 py-2.5 rounded-xl border border-rice-border bg-rice text-indigo-ink text-base focus:outline-none focus:ring-2 focus:ring-haldi"
                required
              />

              {/* Password Strength Indicator on Sign Up */}
              {isSignUp && password && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-indigo-ink/65">Strength:</span>
                    <span className="font-bold" style={{ color: strength.color }}>
                      {strength.label}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-rice-border rounded-full overflow-hidden flex gap-1">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className="flex-1 h-full rounded-full transition-all"
                        style={{
                          backgroundColor:
                            step <= strength.score
                              ? strength.color
                              : 'transparent',
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {isSignUp && (
              <div>
                <label className="block text-xs font-heading font-semibold text-indigo-ink mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-rice-border bg-rice text-indigo-ink text-base focus:outline-none focus:ring-2 focus:ring-haldi"
                  required
                />
              </div>
            )}

            {isSignUp && (
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-0.5 rounded border-rice-border text-sindoor focus:ring-haldi"
                    required
                  />
                  <span className="text-xs text-indigo-ink/80 leading-snug">
                    I agree to the{' '}
                    <Link to="/terms" target="_blank" className="text-indigo-ink font-bold underline hover:text-sindoor">
                      Terms of Service & Privacy Disclosures
                    </Link>
                  </span>
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-sindoor hover:bg-sindoor-600 text-rice font-heading font-bold text-sm shadow-sm shadow-haldi-glow hover:shadow transition-all active:scale-95 flex items-center justify-center gap-2 border-2 border-haldi disabled:opacity-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-haldi"
            >
              <span>{loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Academic & Privacy Note */}
          <div className="mt-6 pt-4 border-t border-rice-border text-center">
            <p className="text-[11px] text-indigo-ink/65 leading-relaxed">
              Passwords are cryptographically salted and hashed using PBKDF2/SHA-256 in your browser. All session data stays strictly on your local device.
            </p>
          </div>
        </DoubleLineBorder>

        {/* Back Link */}
        <div className="mt-4 text-center">
          <Link to="/" className="text-xs text-indigo-ink/75 hover:text-indigo-ink underline font-semibold">
            &larr; Back to Welcome Gate
          </Link>
        </div>
      </div>
    </div>
  );
};
