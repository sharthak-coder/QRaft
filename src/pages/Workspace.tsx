import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { TabBar, WorkspaceTabId } from '../components/layout/TabBar';
import { GeneratorTab } from '../components/tabs/GeneratorTab';
import { TemplatesTab } from '../components/tabs/TemplatesTab';
import { CommunityTab } from '../components/tabs/CommunityTab';
import { RecentTab } from '../components/tabs/RecentTab';
import { ProfileTab } from '../components/tabs/ProfileTab';
import { TemplateStore } from '../services/templates';
import { decodeShareLink, SharedTemplatePayload } from '../lib/shareLink';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, X, RefreshCw } from 'lucide-react';

// Lazy-load the 3D WebGL Tab so the initial application bundle remains lean
const ThreeTab = lazy(() =>
  import('../components/tabs/ThreeTab').then((m) => ({ default: m.ThreeTab }))
);

export const WorkspacePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const tabFromQuery = (searchParams.get('tab') as WorkspaceTabId) || 'generator';
  const [activeTab, setActiveTab] = useState<WorkspaceTabId>(tabFromQuery);

  // Cross-device share modal state
  const [sharedPayload, setSharedPayload] = useState<SharedTemplatePayload | null>(null);
  const [sharedImportSuccess, setSharedImportSuccess] = useState(false);

  // Detect and decode shared templates in URL hash or query
  useEffect(() => {
    const checkShareParam = () => {
      let shareParam = searchParams.get('share');
      if (!shareParam && window.location.hash.includes('share=')) {
        const hashPart = window.location.hash.split('share=')[1];
        if (hashPart) {
          shareParam = hashPart.split('&')[0];
        }
      }

      if (shareParam) {
        const decoded = decodeShareLink(shareParam);
        if (decoded) {
          setSharedPayload(decoded);
        }
      }
    };

    checkShareParam();
  }, [searchParams]);

  const handleTabChange = (tabId: WorkspaceTabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  // Touch swipe gesture handling
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 60;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    const tabs: WorkspaceTabId[] = ['generator', '3d', 'templates', 'community', 'recent', 'profile'];
    const currentIndex = tabs.indexOf(activeTab);

    if (isLeftSwipe && currentIndex < tabs.length - 1) {
      handleTabChange(tabs[currentIndex + 1]);
    } else if (isRightSwipe && currentIndex > 0) {
      handleTabChange(tabs[currentIndex - 1]);
    }
  };

  // Handle importing shared template
  const handleImportShared = () => {
    if (!sharedPayload) return;
    TemplateStore.create(
      {
        name: sharedPayload.name,
        type: sharedPayload.type,
        inputs: sharedPayload.inputs,
        style: sharedPayload.style,
        threeSettings: sharedPayload.threeSettings,
        tags: sharedPayload.tags || [],
        originalAuthor: sharedPayload.authorName,
      }
    );
    setSharedImportSuccess(true);
    setTimeout(() => {
      setSharedPayload(null);
      setSharedImportSuccess(false);
      handleTabChange('templates');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col z-10 relative">
      <Navbar />

      <main
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Animated Sliding Tab Bar */}
        <TabBar activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Dynamic Tab Content Area */}
        <div className="flex-1 mt-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              role="tabpanel"
              id={`tabpanel-${activeTab}`}
              aria-labelledby={`tab-${activeTab}`}
              className="w-full"
            >
              {activeTab === 'generator' && <GeneratorTab />}

              {activeTab === '3d' && (
                <Suspense
                  fallback={
                    <div className="p-16 flex flex-col items-center justify-center text-center">
                      <RefreshCw className="w-8 h-8 text-google-blue-royal animate-spin mb-3" />
                      <p className="text-xs font-bold text-surface-text">Loading 3D WebGL Engine...</p>
                      <p className="text-[11px] text-surface-muted mt-1">
                        Compiling Three.js shader pipelines and instanced mesh geometry.
                      </p>
                    </div>
                  }
                >
                  <ThreeTab />
                </Suspense>
              )}

              {activeTab === 'templates' && (
                <TemplatesTab
                  onLoadTemplate={() => {
                    handleTabChange('generator');
                  }}
                />
              )}

              {activeTab === 'community' && (
                <CommunityTab
                  onRemixSuccess={() => {
                    handleTabChange('templates');
                  }}
                />
              )}

              {activeTab === 'recent' && (
                <RecentTab
                  onLoadItem={() => {
                    handleTabChange('generator');
                  }}
                />
              )}

              {activeTab === 'profile' && <ProfileTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Shared Link Import Modal */}
      {sharedPayload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white shadow-2xl border border-surface-border text-center relative">
            <button
              type="button"
              onClick={() => setSharedPayload(null)}
              className="absolute top-4 right-4 p-1.5 text-surface-muted hover:text-surface-text rounded-xl hover:bg-surface-soft"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-google-blue-royal flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-surface-text">Shared QRaft Template</h3>
            <p className="text-xs text-surface-muted mt-1 mb-4">
              Someone shared a custom QR code design with you via an encrypted URL hash.
            </p>

            <div className="p-4 rounded-2xl bg-surface-soft border border-surface-border text-left mb-6 space-y-1.5">
              <p className="text-xs font-bold text-surface-text">{sharedPayload.name}</p>
              <p className="text-[11px] text-surface-muted">
                Type: <strong className="uppercase">{sharedPayload.type}</strong> &bull; Author: {sharedPayload.authorName || 'Anonymous'}
              </p>
            </div>

            {sharedImportSuccess ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-google-green text-xs font-bold rounded-xl flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                <span>Saved to My Templates! Redirecting...</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSharedPayload(null)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-surface-border text-xs font-semibold text-surface-text hover:bg-surface-soft"
                >
                  Dismiss
                </button>
                <button
                  type="button"
                  onClick={handleImportShared}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-google-blue-royal to-google-blue text-white text-xs font-bold shadow-royal-glow hover:shadow transition-all"
                >
                  Import Template
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
