import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { useSettings } from '../hooks/useSettings';

interface OnboardingStep {
  title: string;
  subtitle: string;
  content: React.ReactNode;
  icon: string;
}

interface OnboardingPageProps {
  onComplete: () => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const { settings, update } = useSettings();

  const steps: OnboardingStep[] = [
    {
      icon: '🧠',
      title: 'Willkommen bei Neuroapp',
      subtitle: 'Dein neurobiologischer Supplement & Habit Tracker',
      content: (
        <div className="space-y-4 text-slate-300 text-sm">
          <p>Neuroapp hilft dir dabei, dein phasenbasiertes Supplement-Protokoll sicher und effektiv zu verwalten.</p>
          <div className="space-y-3">
            {[
              { icon: '✅', text: 'Tägliche Supplement-Checkliste mit Cycling-Engine' },
              { icon: '📊', text: 'Wohlbefinden-Tracking (Schlaf, Fokus, Stimmung, Energie)' },
              { icon: '🛡️', text: 'Automatische Interaktionserkennung & Sicherheitswarnungen' },
              { icon: '🎯', text: 'Habit Tracker mit Streak-Countern' },
              { icon: '💾', text: 'Alles offline & lokal – keine Daten verlassen dein Gerät' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-white/5 rounded-xl p-3">
                <span className="text-xl">{item.icon}</span>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      icon: '🔬',
      title: 'Phase-System',
      subtitle: '3 aufbauende Phasen über 24+ Wochen',
      content: (
        <div className="space-y-3">
          {[
            { phase: 1, bg: 'bg-sky-500/10 border border-sky-500/30', text: 'text-sky-400', label: 'Phase 1 (Wo 1-8)', desc: 'Grundversorgung: Vitaminen, Mineralstoffe, Aminosäuren, Basis-Nootropika', count: '19 Supplements' },
            { phase: 2, bg: 'bg-amber-500/10 border border-amber-500/30', text: 'text-amber-400', label: 'Phase 2 (Wo 9-16)', desc: 'Erweiterung mit CDP-Cholin, Methylenblau und Bromantane', count: '+3 Supplements' },
            { phase: 3, bg: 'bg-red-500/10 border border-red-500/30', text: 'text-red-400', label: 'Phase 3 (Wo 17+)', desc: 'Advanced: PhP, 9-Me-BC, Dihexa, LSD, TAK-653', count: '+5 Supplements' },
          ].map(p => (
            <div key={p.phase} className={`${p.bg} rounded-xl p-4`}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-bold ${p.text}`}>{p.label}</span>
                <span className={`text-xs font-mono ${p.text}`}>{p.count}</span>
              </div>
              <p className="text-xs text-slate-400">{p.desc}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      icon: '📅',
      title: 'Startdatum festlegen',
      subtitle: 'Wann hast du Phase 1 begonnen?',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-400">Das Startdatum wird für die Cycling-Engine (Macro-Zyklen) und die Protokoll-Wochennummer benötigt.</p>
          <input
            type="date"
            value={settings.startDate}
            onChange={e => update('startDate', e.target.value)}
            className="w-full bg-slate-800/60 border border-white/10 rounded-xl px-4 py-3 text-white text-base focus:outline-none focus:border-sky-500/50"
          />
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3">
            <p className="text-xs text-amber-400 font-medium">⚠️ Wichtig:</p>
            <p className="text-xs text-slate-400 mt-1">Wähle das Datum, an dem du tatsächlich mit Phase 1 begonnen hast – nicht das heutige Datum, falls du schon länger dabei bist.</p>
          </div>
        </div>
      ),
    },
    {
      icon: '🛡️',
      title: 'Sicherheitshinweis',
      subtitle: 'Bitte lies dies sorgfältig',
      content: (
        <div className="space-y-4 text-sm text-slate-300">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 space-y-2">
            <p className="font-bold text-red-400">⚠️ Medizinischer Disclaimer</p>
            <p className="text-xs leading-relaxed text-slate-400">
              Diese App ersetzt <strong className="text-white">keine medizinische Beratung</strong>. Die Substanzen in Phase 2 und 3 sind experimentell und für Forschungszwecke konzipiert. Konsultiere einen Arzt bevor du mit fortgeschrittenen Substanzen beginnst.
            </p>
          </div>
          <div className="space-y-2 text-xs text-slate-400">
            <p>✓ Alle Daten bleiben lokal auf deinem Gerät</p>
            <p>✓ Keine Daten werden gesendet oder geteilt</p>
            <p>✓ Die App funktioniert vollständig offline</p>
          </div>
        </div>
      ),
    },
  ];

  const currentStep = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? 'w-8 bg-sky-500' : i < step ? 'w-3 bg-sky-700' : 'w-3 bg-slate-700'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="text-6xl mb-4">{currentStep.icon}</div>
              <h1 className="text-2xl font-bold text-white">{currentStep.title}</h1>
              <p className="text-slate-400 mt-2">{currentStep.subtitle}</p>
            </div>

            <div>{currentStep.content}</div>

            <div className="flex gap-3 pt-4">
              {step > 0 && (
                <Button variant="secondary" onClick={() => setStep(s => s - 1)} className="flex-1">
                  Zurück
                </Button>
              )}
              <Button
                onClick={() => {
                  if (isLast) {
                    update('onboardingComplete', true);
                    onComplete();
                  } else {
                    setStep(s => s + 1);
                  }
                }}
                className="flex-1"
              >
                {isLast ? 'Loslegen 🚀' : 'Weiter'}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
