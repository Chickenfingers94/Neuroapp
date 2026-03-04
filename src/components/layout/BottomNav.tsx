import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const TABS = [
  { path: '/', label: 'Dashboard', icon: '🧠' },
  { path: '/checklist', label: 'Checklist', icon: '✅' },
  { path: '/habits', label: 'Habits', icon: '🎯' },
  { path: '/tracking', label: 'Tracking', icon: '📊' },
  { path: '/settings', label: 'Settings', icon: '⚙️' },
];

export const BottomNav: React.FC = () => {
  const location = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 glass-nav border-t"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-stretch justify-around max-w-2xl mx-auto">
        {TABS.map(tab => {
          const isActive = tab.path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(tab.path);
          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              end={tab.path === '/'}
              className="flex flex-col items-center justify-center py-2 px-2 flex-1 relative"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-active-pill"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-sky-400"
                  style={{ boxShadow: '0 0 8px 2px rgba(56,189,248,0.6)' }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <motion.span
                className="text-xl"
                animate={{ scale: isActive ? 1.15 : 1, y: isActive ? -1 : 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {tab.icon}
              </motion.span>
              <span
                className={`text-[10px] mt-0.5 font-medium transition-colors duration-200 ${
                  isActive ? 'text-sky-400' : 'text-slate-500'
                }`}
              >
                {tab.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
