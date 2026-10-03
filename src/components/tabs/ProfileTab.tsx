import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { TemplateStore } from '../../services/templates';
import { CommunityStore } from '../../services/community';
import { RecentStore } from '../../services/recent';
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
    if (window.confirm('Reset all demo templates and activity back to factory defaults?')) {
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
      <div className="bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-surface-border shadow-card flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-google-blue-royal to-google-blue text-white flex items-center justify-center font-heading font-extrabold text-2xl shadow-lift flex-shrink-0">
          {isAuthenticated && user ? user.name.charAt(0).toUpperCase() : 'G'}
        </div>

        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-surface-text">
                {isAuthenticated && user ? user.name : 'Guest User'}
              </h2>
              <p className="text-xs text-surface-muted">
                {isAuthenticated && user ? user.email : 'Unauthenticated browser session'}
              </p>
            </div>

            {isDemo && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 self-center sm:self-auto">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Demo Reviewer Mode</span>
              </span>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-surface-border grid grid-cols-2 sm:grid-cols-3 gap-4 text-left">
            <div className="bg-surface-soft p-3 rounded-2xl border border-surface-border/80">
              <span className="text-[10px] uppercase font-bold text-surface-muted block">Saved Templates</span>
              <span className="text-base font-extrabold text-surface-text">
                {TemplateStore.getAll().length}
              </span>
            </div>
            <div className="bg-surface-soft p-3 rounded-2xl border border-surface-border/80">
              <span className="text-[10px] uppercase font-bold text-surface-muted block">Recent QRs</span>
              <span className="text-base font-extrabold text-surface-text">
                {RecentStore.getAll().length}
              </span>
            </div>
            <div className="bg-surface-soft p-3 rounded-2xl border border-surface-border/80 col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase font-bold text-surface-muted block">Following</span>
              <span className="text-base font-extrabold text-surface-text">
                {user?.following?.length || 0} authors
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Guest Call to Action */}
      {!isAuthenticated && (
        <div className="p-6 rounded-3xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-google-blue-royal">Create an account or sign in</h3>
            <p className="text-xs text-blue-800 mt-0.5">
              Sync templates across sessions, follow community creators, and publish designs.
            </p>
          </div>
          <Link
            to="/login"
            className="px-5 py-2.5 rounded-xl bg-google-blue-royal hover:bg-google-blue-deep text-white text-xs font-bold shadow-sm whitespace-nowrap"
          >
            Sign In / Sign Up
          </Link>
        </div>
      )}

      {/* Account Settings & Data Management */}
      <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-surface-border shadow-card space-y-4">
        <h3 className="text-xs font-bold text-surface-text uppercase tracking-wider mb-2">
          Data & Privacy Management
        </h3>

        {/* Export Data */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-soft border border-surface-border">
          <div className="flex items-center gap-3">
            <Download className="w-4 h-4 text-google-blue-royal" />
            <div>
              <p className="text-xs font-bold text-surface-text">Export Local Data</p>
              <p className="text-[11px] text-surface-muted">Download your templates and history as a JSON backup.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleExportBackup}
            className="px-3.5 py-1.5 rounded-xl bg-white border border-surface-border hover:bg-slate-50 text-xs font-bold text-surface-text transition-colors"
          >
            Export JSON
          </button>
        </div>

        {/* Reset Demo Option (if in demo mode) */}
        {isDemo && (
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200">
            <div className="flex items-center gap-3">
              <RotateCcw className="w-4 h-4 text-amber-600" />
              <div>
                <p className="text-xs font-bold text-amber-900">Reset Demo Data</p>
                <p className="text-[11px] text-amber-700">Restore pre-seeded templates and community posts.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleResetDemo}
              className="px-3.5 py-1.5 rounded-xl bg-white border border-amber-300 hover:bg-amber-50 text-xs font-bold text-amber-800 transition-colors"
            >
              Reset Data
            </button>
          </div>
        )}

        {/* View Legal Terms */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-soft border border-surface-border">
          <div className="flex items-center gap-3">
            <FileText className="w-4 h-4 text-surface-muted" />
            <div>
              <p className="text-xs font-bold text-surface-text">Terms & Privacy Policy</p>
              <p className="text-[11px] text-surface-muted">Review legal disclosures and client-side data declarations.</p>
            </div>
          </div>
          <Link
            to="/terms"
            className="px-3.5 py-1.5 rounded-xl bg-white border border-surface-border hover:bg-slate-50 text-xs font-bold text-surface-text transition-colors"
          >
            View Terms
          </Link>
        </div>

        {/* Sign Out / Delete Account */}
        {isAuthenticated && (
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-surface-border">
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-surface-muted hover:text-surface-text"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>

            <button
              type="button"
              onClick={handleDeleteAccount}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-google-red hover:underline"
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
