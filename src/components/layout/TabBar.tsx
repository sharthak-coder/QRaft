import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Box, Bookmark, Users, Clock, User } from 'lucide-react';

export type WorkspaceTabId = 'generator' | '3d' | 'templates' | 'community' | 'recent' | 'profile';

export interface TabItem {
  id: WorkspaceTabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const WORKSPACE_TABS: TabItem[] = [
  { id: 'generator', label: 'QR Generator', icon: QrCode },
  { id: '3d', label: '3D QR', icon: Box, badge: 'WebGL' },
  { id: 'templates', label: 'My Templates', icon: Bookmark },
  { id: 'community', label: 'Community', icon: Users },
  { id: 'recent', label: 'Recent', icon: Clock },
  { id: 'profile', label: 'Profile', icon: User },
];

interface TabBarProps {
  activeTab: WorkspaceTabId;
  onTabChange: (tabId: WorkspaceTabId) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll active tab into view on mobile
  useEffect(() => {
    if (activeTabRef.current && containerRef.current) {
      const container = containerRef.current;
      const tab = activeTabRef.current;
      const scrollLeft = tab.offsetLeft - container.offsetWidth / 2 + tab.offsetWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [activeTab]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index;
    if (e.key === 'ArrowRight') {
      nextIndex = (index + 1) % WORKSPACE_TABS.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (index - 1 + WORKSPACE_TABS.length) % WORKSPACE_TABS.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = WORKSPACE_TABS.length - 1;
    } else {
      return;
    }
    e.preventDefault();
    onTabChange(WORKSPACE_TABS[nextIndex].id);
  };

  return (
    <div className="w-full flex justify-center px-4 py-3">
      <div
        ref={containerRef}
        role="tablist"
        aria-label="Workspace feature tabs"
        className="flex items-center gap-1.5 p-1.5 bg-white/90 backdrop-blur-md rounded-2xl border border-surface-border shadow-card max-w-full overflow-x-auto no-scrollbar scroll-smooth snap-x"
      >
        {WORKSPACE_TABS.map((tab, idx) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              ref={isActive ? activeTabRef : undefined}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              id={`tab-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onTabChange(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors snap-center flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-google-blue ${
                isActive
                  ? 'text-white'
                  : 'text-surface-muted hover:text-surface-text hover:bg-slate-50/80'
              }`}
            >
              {/* Sliding Pill Indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 bg-gradient-to-r from-google-blue-royal to-google-blue rounded-xl shadow-royal-glow"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}

              {/* Tab Content */}
              <span className="relative z-10 flex items-center gap-2">
                <Icon className={`w-4 h-4 transition-transform ${isActive ? 'scale-110' : ''}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-google-blue/10 text-google-blue-royal'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
