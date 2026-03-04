import React from 'react';
import { motion } from 'framer-motion';

interface DailyReminderPageProps {
  onStart: () => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const truths = [
  {
    num: 1,
    title: 'Schlaf ist nicht verhandelbar.',
    body: 'Alles, was du tagsüber aufbaust – jedes Training, jede Erkenntnis, jeder Fokusblock – wird nachts gefestigt oder verworfen. Dein Schlaf entscheidet, ob der Tag zählt.',
  },
  {
    num: 2,
    title: 'Bewegung ist der stärkste Nootropic der Welt.',
    body: 'Kein Supplement, kein Peptid, keine Substanz kommt an das heran, was 30 Minuten intensives Training mit deinem Gehirn machen. BDNF, Dopamin, Neurogenese – alles umsonst. Jeden Tag verfügbar. Keine Nebenwirkungen. Geh trainieren.',
  },
  {
    num: 3,
    title: 'Dein Gehirn wächst nur an echten Herausforderungen.',
    body: (
      <>
        Nicht an Content. Nicht an Scroll-Sessions. Nicht an Pläne-Schmieden. An{' '}
        <span className="text-sky-400 font-semibold">echter Arbeit</span>, die sich schwer anfühlt.
        Der Moment, in dem du denkst „das ist anstrengend" – das ist der Moment, in dem Wachstum
        beginnt. Lehn dich rein.
      </>
    ),
  },
  {
    num: 4,
    title: 'Therapie und Selbstreflexion sind keine Schwäche. Sie sind der größte Hebel.',
    body: 'Du kannst das schärfste Gehirn der Welt haben – wenn unbewusste Muster dich sabotieren, nutzt du einen Bruchteil davon. Der Mut, in die eigene Tiefe zu schauen, ist seltener und wertvoller als jeder Stack.',
  },
  {
    num: 5,
    title: 'Konsistenz schlägt Perfektion. Jeden einzelnen Tag.',
    body: (
      <>
        Du wirst Tage haben, an denen du nicht trainierst. Tage, an denen der Schlaf schlecht war.
        Tage, an denen du keinen Fokus findest. Das ist nicht Versagen. Das ist Menschsein.{' '}
        <span className="text-amber-400 font-semibold">
          Ein schlechter Tag bricht keine Kette. Aufhören bricht die Kette.
        </span>{' '}
        Mach morgen weiter.
      </>
    ),
  },
  {
    num: 6,
    title: 'Du wirst nicht durch Substanzen transformiert. Du wirst durch Entscheidungen transformiert.',
    body: (
      <>
        Die Supplements unterstützen. Das Training liefert die Chemie. Aber{' '}
        <span className="text-sky-400 font-semibold">du</span> entscheidest jeden Morgen neu,
        aufzustehen und die Arbeit zu machen. Diese Entscheidung – immer und immer wieder – ist das
        Einzige, was dich wirklich verändert.
      </>
    ),
  },
];

const minimum = [
  { icon: '☀️', text: 'Sonnenlicht in die Augen.' },
  { icon: '🥶', text: 'Kälte aushalten.' },
  { icon: '🏋️', text: 'Den Körper bewegen.' },
  { icon: '🧠', text: '90 Minuten echte Arbeit.' },
  { icon: '🪞', text: 'Einen ehrlichen Blick nach innen.' },
  { icon: '😴', text: 'Rechtzeitig schlafen.' },
];

export const DailyReminderPage: React.FC<DailyReminderPageProps> = ({ onStart }) => (
  <div className="min-h-screen bg-slate-950 overflow-y-auto">
    <div className="max-w-lg mx-auto px-4 py-10 pb-16 space-y-10">

      {/* Header */}
      <motion.div
        className="text-center space-y-3"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        <motion.div variants={fadeUp} className="text-6xl">🧠</motion.div>
        <motion.h1 variants={fadeUp} className="text-3xl font-bold text-white">
          Dein täglicher Reminder
        </motion.h1>
        <motion.p variants={fadeUp} className="text-slate-400 italic text-sm">
          Lies das jeden Morgen. Nicht als Pflicht. Als Entscheidung.
        </motion.p>
      </motion.div>

      {/* Section 1 */}
      <motion.div
        className="glass-card p-5 space-y-3"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={fadeUp}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-lg font-bold text-white">Du bist 20. Das hier ist dein Fenster.</h2>
        <p className="text-slate-300 text-sm leading-relaxed">
          Nicht weil es danach zu spät ist. Sondern weil{' '}
          <span className="text-sky-400 font-semibold">jetzt</span> alles, was du tust, sich am
          stärksten einbrennt.
        </p>
        <p className="text-slate-300 text-sm leading-relaxed">
          Dein Gehirn baut sich gerade fertig. Jede Gewohnheit, die du jetzt formst, wird dein
          Autopilot. Jede Stunde echte Arbeit formt Strukturen, die Jahrzehnte halten. Jede
          schwierige Emotion, der du dich stellst, macht dich freier.
        </p>
        <p className="text-amber-400 font-semibold text-sm">
          Du formst gerade nicht deinen Tag. Du formst dein Leben.
        </p>
      </motion.div>

      {/* Section 2: Die sechs Wahrheiten */}
      <motion.div
        className="space-y-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={stagger}
      >
        <motion.h2 variants={fadeUp} className="text-lg font-bold text-white px-1">
          Die sechs Wahrheiten
        </motion.h2>
        {truths.map(t => (
          <motion.div key={t.num} variants={fadeUp} className="glass-card p-4 space-y-1.5">
            <div className="flex items-start gap-2">
              <span className="text-sky-500 font-bold text-sm min-w-[1.25rem]">{t.num}.</span>
              <p className="text-white font-semibold text-sm">{t.title}</p>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed pl-5">{t.body}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Section 3: Tägliches Minimum */}
      <motion.div
        className="glass-card p-5 space-y-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={fadeUp}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-lg font-bold text-white">Dein tägliches Minimum</h2>
        <p className="text-slate-400 text-sm italic">
          Nicht der perfekte Tag.{' '}
          <span className="text-white font-semibold not-italic">Das Minimum, das zählt.</span>
        </p>
        <div className="grid grid-cols-1 gap-2">
          {minimum.map(item => (
            <div key={item.icon} className="flex items-center gap-3 text-slate-300 text-sm">
              <span className="text-base w-6 text-center">{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
        <p className="text-slate-400 text-sm leading-relaxed border-t border-white/10 pt-3">
          Sechs Dinge. Das ist alles. Wenn du das heute schaffst, war der Tag ein Sieg.{' '}
          <span className="text-slate-300">Alles darüber hinaus ist Bonus.</span>
        </p>
      </motion.div>

      {/* Section 4: Innerer Widerstand */}
      <motion.div
        className="glass-card p-5 space-y-3"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={fadeUp}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-lg font-bold text-white">Wenn der innere Widerstand kommt</h2>
        <p className="text-slate-400 text-sm italic">Und er wird kommen. Jeden Tag.</p>
        <p className="text-slate-300 text-sm">Dann erinnere dich:</p>
        <p className="text-slate-300 text-sm leading-relaxed italic border-l-2 border-sky-500/50 pl-4">
          Die Person, die du in 5 Jahren sein willst, wird durch das geformt, was du{' '}
          <span className="text-sky-400 font-semibold not-italic">heute</span> tust. Nicht morgen.
          Nicht wenn die Motivation kommt. Nicht wenn alles perfekt ist.{' '}
          <span className="text-white font-bold not-italic">Heute.</span>
        </p>
        <p className="text-slate-300 text-sm leading-relaxed">
          Du musst nicht motiviert sein. Du musst nicht inspiriert sein. Du musst nicht den
          perfekten Tag haben.
        </p>
        <p className="text-amber-400 font-semibold text-sm">
          Du musst nur anfangen. Der Rest ergibt sich aus der Bewegung.
        </p>
      </motion.div>

      {/* Section 5 */}
      <motion.div
        className="glass-card p-5 space-y-3"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={fadeUp}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-lg font-bold text-white">
          Du hast verstanden, was die meisten nie verstehen
        </h2>
        <p className="text-slate-300 text-sm leading-relaxed">
          Die meisten suchen die Lösung in einer Pille, einem Hack, einer Abkürzung.
        </p>
        <p className="text-slate-400 text-sm">Du hast verstanden, dass echte Veränderung bedeutet:</p>
        <ul className="space-y-1.5 text-slate-300 text-sm pl-2">
          <li>– Den Körper fordern.</li>
          <li>– Den Geist fordern.</li>
          <li>– Der eigenen Psyche ehrlich begegnen.</li>
          <li>
            – Und das{' '}
            <span className="text-sky-400 font-semibold">jeden Tag aufs Neue wählen</span>.
          </li>
        </ul>
        <p className="text-amber-400 font-semibold text-sm pt-1">
          Das ist selten. Das ist wertvoll. Das ist der Weg.
        </p>
      </motion.div>

      {/* Footer */}
      <motion.div
        className="text-center space-y-1 py-2"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={fadeUp}
        transition={{ duration: 0.4 }}
      >
        <p className="text-slate-400 text-sm italic">Nicht perfekt. Konsistent.</p>
        <p className="text-slate-400 text-sm italic">Nicht motiviert. Diszipliniert.</p>
        <p className="text-slate-400 text-sm italic">Nicht fertig. Unterwegs.</p>
        <p className="text-white font-bold text-base pt-2">Jeden. Einzelnen. Tag.</p>
      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-20px' }}
        variants={fadeUp}
        transition={{ duration: 0.4 }}
      >
        <button
          onClick={onStart}
          className="w-full py-4 rounded-xl bg-sky-600 hover:bg-sky-500 active:scale-95 transition-all duration-200 text-white font-bold text-lg shadow-lg shadow-sky-600/30"
        >
          Jetzt starten 💪
        </button>
      </motion.div>

    </div>
  </div>
);
