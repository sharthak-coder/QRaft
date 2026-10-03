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
  { id: '3d', label: 'Scenic 3D World', icon: Box, badge: 'Voxel Diorama' },
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
        className="flex items-center gap-1.5 p-1.5 bg-rice-panel/95 backdrop-blur-md rounded-2xl border-2 border-indigo-ink/20 shadow-folk-card max-w-full overflow-x-auto no-scrollbar scroll-smooth snap-x"
        style={{ outline: '1px solid rgba(26, 54, 68, 0.1)', outlineOffset: '2px' }}
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
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-heading font-bold transition-colors duration-200 snap-center flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-ink ${
                isActive
                  ? 'text-indigo-ink font-extrabold'
                  : 'text-indigo-ink/75 hover:text-indigo-ink hover:bg-rice'
              }`}
            >
              {/* Sliding Haldi Tag Pill with Tiny Travelling Lotus Bud */}
              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 bg-haldi rounded-xl shadow-haldi-glow border border-indigo-ink flex flex-col justify-between overflow-hidden"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                >
                  {/* Top Travelling Lotus Bud Ornament */}
                  <div className="w-full flex justify-center -mt-0.5">
                    <svg className="w-3.5 h-2.5" viewBox="0 0 16 10" fill="none">
                      <path d="M8 1 C6 3 5 6 5 8 C6.5 9 9.5 9 11 8 C11 6 10 3 8 1 Z" fill="#A62B2B" stroke="#1A3644" strokeWidth="0.8" />
                      <circle cx="8" cy="8" r="1" fill="#FFFFFF" />
                    </svg>
                  </div>

                  {/* Tribal zig-zag lower border trim */}
                  <span
                    className="w-full h-1 block opacity-30"
                    style={{
                      backgroundImage: 'repeating-linear-gradient(45deg, #1A3644 0, #1A3644 1.5px, transparent 1.5px, transparent 3px)',
                      backgroundSize: '4px 3px',
                      backgroundRepeat: 'repeat-x',
                    }}
                  />
                </motion.div>
              )}

              {/* Tab Content */}
              <span className="relative z-10 flex items-center gap-2">
                <Icon className={`w-4 h-4 transition-transform ${isActive ? 'scale-110 text-indigo-ink' : 'text-indigo-ink/70'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      isActive
                        ? 'bg-indigo-ink text-rice'
                        : 'bg-leaf/20 text-leaf'
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
