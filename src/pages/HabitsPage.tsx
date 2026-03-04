import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { PageContainer } from '../components/layout/PageContainer';
import { HabitCard } from '../components/habits/HabitCard';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { useHabits } from '../hooks/useHabits';
import type { TrackingType, Habit } from '../types';

const DAY_LABELS = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

interface HabitForm {
  name: string;
  emoji: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'custom';
  customDays: number[];
  trackingType: TrackingType;
}

const DEFAULT_FORM: HabitForm = {
  name: '',
  emoji: '⭐',
  description: '',
  frequency: 'daily',
  customDays: [],
  trackingType: 'boolean',
};

const TRACKING_TYPES: { value: TrackingType; label: string }[] = [
  { value: 'boolean', label: '✓ Ja/Nein' },
  { value: 'counter', label: '# Anzahl' },
  { value: 'duration', label: '⏱ Minuten' },
  { value: 'scale', label: '★ Skala' },
];

export const HabitsPage: React.FC = () => {
  const { habits, todayLogs, toggleHabit, getStreak, addCustomHabit, updateHabit, deleteHabit, reorderHabits } = useHabits();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [form, setForm] = useState<HabitForm>(DEFAULT_FORM);

  const completed = habits.filter(h => Boolean(todayLogs[h.id]?.value)).length;

  const systemHabits = habits.filter(h => h.isSystem);
  const customHabits = habits.filter(h => !h.isSystem);

  const openAdd = () => {
    setForm(DEFAULT_FORM);
    setShowAddModal(true);
  };

  const openEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setForm({
      name: habit.name,
      emoji: habit.emoji,
      description: habit.description ?? '',
      frequency: habit.frequency,
      customDays: habit.customDays ?? [],
      trackingType: habit.trackingType,
    });
  };

  const closeEdit = () => {
    setEditingHabit(null);
    setForm(DEFAULT_FORM);
  };

  const handleAdd = async () => {
    if (!form.name.trim()) return;
    await addCustomHabit({
      id: `custom-${Date.now()}`,
      name: form.name,
      emoji: form.emoji,
      description: form.description,
      frequency: form.frequency,
      customDays: form.frequency === 'custom' ? form.customDays : undefined,
      trackingType: form.trackingType,
      active: true,
    });
    setForm(DEFAULT_FORM);
    setShowAddModal(false);
  };

  const handleEdit = async () => {
    if (!editingHabit || !form.name.trim()) return;
    await updateHabit(editingHabit.id, {
      name: form.name,
      emoji: form.emoji,
      description: form.description,
      frequency: form.frequency,
      customDays: form.frequency === 'custom' ? form.customDays : undefined,
      trackingType: form.trackingType,
    });
    closeEdit();
  };

  const handleDelete = async (id: string) => {
    await deleteHabit(id);
  };

  const moveHabit = async (index: number, direction: -1 | 1) => {
    const subset = customHabits;
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= subset.length) return;
    const reordered = [...subset];
    [reordered[index], reordered[newIndex]] = [reordered[newIndex], reordered[index]];
    const allIds = [...systemHabits.map(h => h.id), ...reordered.map(h => h.id)];
    await reorderHabits(allIds);
  };

  const toggleCustomDay = (day: number) => {
    setForm(f => ({
      ...f,
      customDays: f.customDays.includes(day)
        ? f.customDays.filter(d => d !== day)
        : [...f.customDays, day],
    }));
  };

  const frequencyLabel = (h: Habit) => {
    if (h.frequency === 'daily') return 'Täglich';
    if (h.frequency === 'weekly') return 'Wöchentlich';
    if (h.frequency === 'custom' && h.customDays?.length) {
      return h.customDays.map(d => DAY_LABELS[d]).join('/');
    }
    return 'Custom';
  };

  const renderForm = (isEdit: boolean) => (
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
      <div>
        <p className="text-xs text-slate-500 mb-2">Häufigkeit</p>
        <div className="flex gap-2">
          {(['daily', 'weekly', 'custom'] as const).map(f => (
            <button
              key={f}
              onClick={() => setForm(p => ({ ...p, frequency: f }))}
              className={`flex-1 py-2 rounded-lg text-xs ${form.frequency === f ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400'}`}
            >
              {f === 'daily' ? 'Täglich' : f === 'weekly' ? 'Wöchentlich' : 'Custom'}
            </button>
          ))}
        </div>
        {form.frequency === 'custom' && (
          <div className="flex gap-1 mt-2">
            {DAY_LABELS.map((label, day) => (
              <button
                key={day}
                onClick={() => toggleCustomDay(day)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium ${form.customDays.includes(day) ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400'}`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div>
        <p className="text-xs text-slate-500 mb-2">Tracking-Typ</p>
        <div className="grid grid-cols-2 gap-2">
          {TRACKING_TYPES.map(t => (
            <button
              key={t.value}
              onClick={() => setForm(f => ({ ...f, trackingType: t.value }))}
              className={`py-2 rounded-lg text-xs ${form.trackingType === t.value ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={isEdit ? handleEdit : handleAdd} className="flex-1">
          {isEdit ? 'Speichern' : 'Hinzufügen'}
        </Button>
        <Button variant="secondary" onClick={isEdit ? closeEdit : () => setShowAddModal(false)} className="flex-1">
          Abbrechen
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <Header
        title="🎯 Gewohnheiten"
        subtitle={`${completed}/${habits.length} heute erledigt`}
        right={
          <Button variant="ghost" size="sm" onClick={openAdd}>
            + Neu
          </Button>
        }
      />
      <PageContainer>
        <div className="space-y-4">
          {systemHabits.length > 0 && (
            <div>
              <p className="text-xs text-slate-500 font-medium px-1 mb-2">⭐ System-Gewohnheiten</p>
              <div className="space-y-2">
                {systemHabits.map(habit => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    log={todayLogs[habit.id]}
                    onToggle={() => toggleHabit(habit.id)}
                    getStreak={getStreak}
                    frequencyLabel={frequencyLabel(habit)}
                  />
                ))}
              </div>
            </div>
          )}

          {customHabits.length > 0 && (
            <div>
              <p className="text-xs text-slate-500 font-medium px-1 mb-2">✏️ Eigene Gewohnheiten</p>
              <div className="space-y-2">
                {customHabits.map((habit, index) => (
                  <div key={habit.id} className="flex items-center gap-2">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => moveHabit(index, -1)}
                        disabled={index === 0}
                        className="text-slate-600 hover:text-slate-400 disabled:opacity-20 text-xs leading-none"
                        aria-label="Nach oben"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => moveHabit(index, 1)}
                        disabled={index === customHabits.length - 1}
                        className="text-slate-600 hover:text-slate-400 disabled:opacity-20 text-xs leading-none"
                        aria-label="Nach unten"
                      >
                        ▼
                      </button>
                    </div>
                    <div className="flex-1">
                      <HabitCard
                        habit={habit}
                        log={todayLogs[habit.id]}
                        onToggle={() => toggleHabit(habit.id)}
                        getStreak={getStreak}
                        frequencyLabel={frequencyLabel(habit)}
                        onEdit={() => openEdit(habit)}
                        onDelete={() => handleDelete(habit.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </PageContainer>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Neue Gewohnheit">
        {renderForm(false)}
      </Modal>

      <Modal isOpen={editingHabit !== null} onClose={closeEdit} title="Gewohnheit bearbeiten">
        {renderForm(true)}
      </Modal>
    </>
  );
};
