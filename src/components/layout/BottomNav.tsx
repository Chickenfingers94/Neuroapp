import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const TABS = [
  { path: '/', label: 'Dashboard', icon: '🧠' },
  { path: '/checklist', label: 'Checklist', icon: '✅' },
  { path: '/tracking', label: 'Tracking', icon: '📊' },
  { path: '/knowledge', label: 'Wissen', icon: '📚' },
  { path: '/settings', label: 'Settings', icon: '⚙️' },
];

export const BottomNav: React.FC = () => (
  <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-md border-t border-white/10">
    <div className="flex items-stretch justify-around max-w-2xl mx-auto">
      {TABS.map(tab => (
        <NavLink
          key={tab.path}
          to={tab.path}
          end={tab.path === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-2 px-3 flex-1 transition-colors duration-200 ${
              isActive ? 'text-sky-400' : 'text-slate-500 hover:text-slate-300'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <motion.span
                className="text-xl"
                animate={{ scale: isActive ? 1.15 : 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {tab.icon}
              </motion.span>
              <span className="text-xs mt-0.5 font-medium">{tab.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  </nav>
);
