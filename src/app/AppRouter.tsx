import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BottomNav } from '../components/layout/BottomNav';
import { initializeSettings, getSetting } from '../db/database';

const DashboardPage = lazy(() => import('../pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const ChecklistPage = lazy(() => import('../pages/ChecklistPage').then(m => ({ default: m.ChecklistPage })));
const TrackingPage = lazy(() => import('../pages/TrackingPage').then(m => ({ default: m.TrackingPage })));
const KnowledgePage = lazy(() => import('../pages/KnowledgePage').then(m => ({ default: m.KnowledgePage })));
const SettingsPage = lazy(() => import('../pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const HabitsPage = lazy(() => import('../pages/HabitsPage').then(m => ({ default: m.HabitsPage })));
const SafetyPage = lazy(() => import('../pages/SafetyPage').then(m => ({ default: m.SafetyPage })));
const OnboardingPage = lazy(() => import('../pages/OnboardingPage').then(m => ({ default: m.OnboardingPage })));
const DailyReminderPage = lazy(() => import('../pages/DailyReminderPage').then(m => ({ default: m.DailyReminderPage })));

const REMINDER_KEY = 'neuroapp-reminder-dismissed';

function getTodayString(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function isReminderDismissedToday(): boolean {
  try {
    return localStorage.getItem(REMINDER_KEY) === getTodayString();
  } catch {
    return false;
  }
}

function markReminderDismissed(): void {
  try {
    localStorage.setItem(REMINDER_KEY, getTodayString());
  } catch {
    // localStorage not available – silently ignore
  }
}

const PageSkeleton: React.FC = () => (
  <div className="max-w-2xl mx-auto px-4 pt-4 space-y-4">
    <div className="skeleton h-32 w-full" />
    <div className="skeleton h-24 w-full" />
    <div className="skeleton h-48 w-full" />
    <div className="skeleton h-20 w-3/4" />
  </div>
);

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
};

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="min-h-screen"
      >
        <Suspense fallback={<PageSkeleton />}>
          <Routes location={location}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/checklist" element={<ChecklistPage />} />
            <Route path="/tracking" element={<TrackingPage />} />
            <Route path="/knowledge" element={<KnowledgePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/habits" element={<HabitsPage />} />
            <Route path="/safety" element={<SafetyPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
};

export const AppRouter: React.FC = () => {
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);
  const [reminderDismissed, setReminderDismissed] = useState<boolean>(false);

  useEffect(() => {
    initializeSettings().then(async () => {
      const done = await getSetting<boolean>('onboardingComplete');
      setOnboardingDone(done ?? false);
      if (done) {
        setReminderDismissed(isReminderDismissedToday());
      }
    });
  }, []);

  if (onboardingDone === null) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400 animate-pulse text-4xl">🧠</div>
      </div>
    );
  }

  if (!onboardingDone) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="text-4xl animate-pulse">🧠</div></div>}>
        <OnboardingPage
          onComplete={() => {
            setOnboardingDone(true);
            setReminderDismissed(false);
          }}
        />
      </Suspense>
    );
  }

  if (!reminderDismissed) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="text-4xl animate-pulse">🧠</div></div>}>
        <DailyReminderPage
          onStart={() => {
            markReminderDismissed();
            setReminderDismissed(true);
          }}
        />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <AnimatedRoutes />
      <BottomNav />
    </div>
  );
};
