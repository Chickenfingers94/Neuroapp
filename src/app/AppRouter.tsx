import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { BottomNav } from '../components/layout/BottomNav';
import { DashboardPage } from '../pages/DashboardPage';
import { ChecklistPage } from '../pages/ChecklistPage';
import { TrackingPage } from '../pages/TrackingPage';
import { KnowledgePage } from '../pages/KnowledgePage';
import { SettingsPage } from '../pages/SettingsPage';
import { HabitsPage } from '../pages/HabitsPage';
import { SafetyPage } from '../pages/SafetyPage';
import { OnboardingPage } from '../pages/OnboardingPage';
import { DailyReminderPage } from '../pages/DailyReminderPage';
import { initializeSettings, getSetting } from '../db/database';

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
        <div className="text-slate-400 animate-pulse text-lg">🧠</div>
      </div>
    );
  }

  if (!onboardingDone) {
    return (
      <OnboardingPage
        onComplete={() => {
          setOnboardingDone(true);
          setReminderDismissed(false);
        }}
      />
    );
  }

  if (!reminderDismissed) {
    return (
      <DailyReminderPage
        onStart={() => {
          markReminderDismissed();
          setReminderDismissed(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/checklist" element={<ChecklistPage />} />
        <Route path="/tracking" element={<TrackingPage />} />
        <Route path="/knowledge" element={<KnowledgePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/habits" element={<HabitsPage />} />
        <Route path="/safety" element={<SafetyPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNav />
    </div>
  );
};
