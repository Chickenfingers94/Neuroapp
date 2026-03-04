# 🧠 Neuroapp v3.0

A **Neurobiological Supplement & Habit Tracker** PWA — dark-mode-first, fully offline, installable.

## Features

- **Phase-Based Protocol**: 3 phases (24+ weeks), 27 supplements with medically-correct data
- **Cycling Engine**: Automatic ON/OFF scheduling (Methylenblau Mo+Do, 9-Me-BC Di+Fr, Bromantane 5on/2off + 4w/1w macro, Fadiman LSD protocol, TAK-653 from week 16+)
- **Interaction Engine**: DANGER/CAUTION/SYNERGY detection with automatic warnings
- **Daily Checklist**: Supplements grouped by time-of-day (nüchtern/morgens/nachmittags/abends)
- **Wellbeing Tracking**: Sleep, focus, mood, energy sliders (1-10) with Recharts analytics
- **Habit Tracker**: 7 neurobiological system habits + custom habits with streak counters
- **Safety Dashboard**: Real-time interaction warnings, emergency protocol, contraindications
- **Offline-First PWA**: All data local via IndexedDB (Dexie.js), installable

## Tech Stack

- React 18 + TypeScript (strict mode) + Vite
- Tailwind CSS v4 (dark mode first)
- Dexie.js (IndexedDB)
- Recharts, Framer Motion
- vite-plugin-pwa (offline, installable)

## Development

```bash
npm install
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
```

## ⚠️ Medical Disclaimer

This app does not replace medical advice. Phase 2 and 3 substances are experimental and intended for research purposes. Consult a physician before starting any advanced supplement protocol.
