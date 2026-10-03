import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { TemplateStore } from '../../services/templates';
import { CommunityStore } from '../../services/community';
import { RecentStore } from '../../services/recent';
import { Corner } from '../../art/Corner';
import {
  Trash2,
  Download,
  RotateCcw,
  Sparkles,
  LogOut,
  FileText,
} from 'lucide-react';

export const ProfileTab: React.FC = () => {
  const { user, isDemo, logout, deleteAccount, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleResetDemo = () => {
    if (window.confirm('Reset all demo templates and activity back to defaults?')) {
      TemplateStore.resetDemo();
      CommunityStore.resetCommunity();
      RecentStore.clear();
      alert('Demo data has been reset to defaults.');
      window.location.reload();
    }
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        'Are you sure you want to delete your account and all associated local templates? This cannot be undone.'
      )
    ) {
      deleteAccount();
      navigate('/');
    }
  };

  const handleExportBackup = () => {
    const backup = {
      version: 1,
      exportedAt: new Date().toISOString(),
      user,
      templates: TemplateStore.getAll(),
      recent: RecentStore.getAll(),
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `qraft-backup-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* User Information Card */}
      <div
        className="bg-paper-2/95 p-6 sm:p-8 rounded-3xl border border-paper-border shadow-card flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden"
        style={{ outline: '1px solid rgba(19, 80, 77, 0.1)', outlineOffset: '2px' }}
      >
        <Corner position="top-right" size={26} strokeColor="#13504D" fillColor="#F79454" />

        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-peacock-deep to-peacock text-white flex items-center justify-center font-heading font-extrabold text-2xl shadow-lift flex-shrink-0">
          {isAuthenticated && user ? user.name.charAt(0).toUpperCase() : 'G'}
        </div>

        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-heading font-bold text-peacock-deep">
                {isAuthenticated && user ? user.name : 'Guest User'}
              </h2>
              <p className="text-xs text-ink/70">
                {isAuthenticated && user ? user.email : 'Unauthenticated browser session'}
              </p>
            </div>

            {isDemo && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-saffron-50 text-peacock-deep border border-saffron-300 self-center sm:self-auto">
                <Sparkles className="w-3.5 h-3.5 text-vermilion" />
                <span>Demo Reviewer Mode</span>
              </span>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-paper-border grid grid-cols-2 sm:grid-cols-3 gap-4 text-left">
            <div className="bg-paper p-3 rounded-2xl border border-paper-border">
              <span className="text-[10px] uppercase font-bold text-ink/65 block">Saved Templates</span>
              <span className="text-base font-heading font-extrabold text-peacock-deep">
                {TemplateStore.getAll().length}
              </span>
            </div>
            <div className="bg-paper p-3 rounded-2xl border border-paper-border">
              <span className="text-[10px] uppercase font-bold text-ink/65 block">Recent QRs</span>
              <span className="text-base font-heading font-extrabold text-peacock-deep">
                {RecentStore.getAll().length}
              </span>
            </div>
            <div className="bg-paper p-3 rounded-2xl border border-paper-border col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase font-bold text-ink/65 block">Following</span>
              <span className="text-base font-heading font-extrabold text-peacock-deep">
                {user?.following?.length || 0} creators
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Guest Call to Action */}
      {!isAuthenticated && (
        <div
          className="p-6 rounded-3xl bg-paper-2 border border-paper-border shadow-card flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden"
          style={{ outline: '1px solid rgba(19, 80, 77, 0.1)', outlineOffset: '2px' }}
        >
          <Corner position="top-right" size={20} strokeColor="#13504D" fillColor="#A5B596" />
          <div>
            <h3 className="text-sm font-heading font-bold text-peacock-deep">Create an account or sign in</h3>
            <p className="text-xs text-ink/75 mt-0.5">
              Sync templates across sessions, follow sample templates, and publish designs.
            </p>
          </div>
          <Link
            to="/login"
            className="px-5 py-2.5 rounded-xl bg-vermilion hover:bg-vermilion-500 text-white font-heading font-bold text-xs shadow-sm shadow-vermilion-glow hover:shadow-saffron-glow whitespace-nowrap border border-white/30 cursor-pointer"
          >
            Sign In / Sign Up
          </Link>
        </div>
      )}

      {/* Account Settings & Data Management */}
      <div
        className="bg-paper-2/95 p-6 rounded-3xl border border-paper-border shadow-card space-y-4 relative overflow-hidden"
        style={{ outline: '1px solid rgba(19, 80, 77, 0.1)', outlineOffset: '2px' }}
      >
        <h3 className="text-xs font-heading font-bold text-peacock-deep uppercase tracking-wider mb-2">
          Data & Privacy Management
        </h3>

        {/* Export Data */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-paper border border-paper-border">
          <div className="flex items-center gap-3">
            <Download className="w-4 h-4 text-peacock-deep" />
            <div>
              <p className="text-xs font-heading font-bold text-peacock-deep">Export Local Data</p>
              <p className="text-[11px] text-ink/65">Download your templates and history as a JSON backup.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleExportBackup}
            className="px-3.5 py-1.5 rounded-xl bg-paper-2 border border-paper-border hover:bg-paper text-xs font-heading font-bold text-peacock-deep transition-colors cursor-pointer"
          >
            Export JSON
          </button>
        </div>

        {/* Reset Demo Option (if in demo mode) */}
        {isDemo && (
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-saffron-50 border border-saffron-300">
            <div className="flex items-center gap-3">
              <RotateCcw className="w-4 h-4 text-vermilion" />
              <div>
                <p className="text-xs font-heading font-bold text-peacock-deep">Reset Demo Data</p>
                <p className="text-[11px] text-ink/75">Restore pre-seeded sample templates and community posts.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleResetDemo}
              className="px-3.5 py-1.5 rounded-xl bg-paper border border-saffron-300 hover:bg-paper-2 text-xs font-heading font-bold text-peacock-deep transition-colors cursor-pointer"
            >
              Reset Data
            </button>
          </div>
        )}

        {/* View Legal Terms */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-paper border border-paper-border">
          <div className="flex items-center gap-3">
            <FileText className="w-4 h-4 text-peacock-deep" />
            <div>
              <p className="text-xs font-heading font-bold text-peacock-deep">Terms & Privacy Disclosures</p>
              <p className="text-[11px] text-ink/65">Review legal disclosures and client-side processing policies.</p>
            </div>
          </div>
          <Link
            to="/terms"
            className="px-3.5 py-1.5 rounded-xl bg-paper-2 border border-paper-border hover:bg-paper text-xs font-heading font-bold text-peacock-deep transition-colors"
          >
            View Terms
          </Link>
        </div>

        {/* Sign Out / Delete Account */}
        {isAuthenticated && (
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-paper-border">
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink/75 hover:text-peacock-deep cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>

            <button
              type="button"
              onClick={handleDeleteAccount}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-vermilion hover:underline cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Account & Local Storage</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
