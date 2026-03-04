import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { PageContainer } from '../components/layout/PageContainer';
import { HabitCard } from '../components/habits/HabitCard';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { useHabits } from '../hooks/useHabits';
import type { TrackingType } from '../types';

interface NewHabitForm {
  id: string;
  name: string;
  emoji: string;
  description: string;
  frequency: 'daily' | 'weekly';
  trackingType: TrackingType;
  active: boolean;
}

const DEFAULT_FORM: NewHabitForm = {
  id: '',
  name: '',
  emoji: '⭐',
  description: '',
  frequency: 'daily',
  trackingType: 'boolean',
  active: true,
};

export const HabitsPage: React.FC = () => {
  const { habits, todayLogs, toggleHabit, getStreak, addCustomHabit } = useHabits();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<NewHabitForm>(DEFAULT_FORM);

  const completed = habits.filter(h => Boolean(todayLogs[h.id]?.value)).length;

  const handleAdd = async () => {
    if (!form.name.trim()) return;
    await addCustomHabit({
      id: `custom-${Date.now()}`,
      name: form.name,
      emoji: form.emoji,
      description: form.description,
      frequency: form.frequency,
      trackingType: form.trackingType,
      active: true,
    });
    setForm(DEFAULT_FORM);
    setShowModal(false);
  };

  return (
    <>
      <Header
        title="🎯 Gewohnheiten"
        subtitle={`${completed}/${habits.length} heute erledigt`}
        right={
          <Button variant="ghost" size="sm" onClick={() => setShowModal(true)}>
            + Neu
          </Button>
        }
      />
      <PageContainer>
        <div className="space-y-2">
          {habits.map(habit => (
            <HabitCard
              key={habit.id}
              habit={habit}
              log={todayLogs[habit.id]}
              onToggle={() => toggleHabit(habit.id)}
              getStreak={getStreak}
            />
          ))}
        </div>
      </PageContainer>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Neue Gewohnheit">
        <div className="space-y-4">
          <div className="flex gap-3">
            <input
              value={form.emoji}
              onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))}
              className="w-16 bg-slate-800 border border-white/10 rounded-xl px-3 py-2.5 text-center text-xl focus:outline-none"
              maxLength={2}
            />
            <input
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Name der Gewohnheit"
              className="flex-1 bg-slate-800 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50"
            />
          </div>
          <input
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Beschreibung (optional)"
            className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50"
          />
          <div className="flex gap-2">
            {(['daily', 'weekly'] as const).map(f => (
              <button
                key={f}
                onClick={() => setForm(p => ({ ...p, frequency: f }))}
                className={`flex-1 py-2 rounded-lg text-sm ${form.frequency === f ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400'}`}
              >
                {f === 'daily' ? 'Täglich' : 'Wöchentlich'}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAdd} className="flex-1">Hinzufügen</Button>
            <Button variant="secondary" onClick={() => setShowModal(false)} className="flex-1">Abbrechen</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
