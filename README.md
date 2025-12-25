# Heara

**Hear what truly matters.**

## 🎯 The Problem

Professionals lose track of how their time is actually spent. Conversations drift, focus fragments, and the cost—financial and cognitive—remains invisible.

## 💡 The Solution

Heara is a calm productivity companion that:
- **Observes your work sessions** (Focus, Deep Focus, Conversation, Pause)
- **Reveals conversation costs in real-time** (direct + opportunity cost)
- **Understands your rhythm** (when you're most focused, when to pause)
- **Protects your privacy** (your data never leaves your device)

## 🚀 Tech Stack

- **Vue 3** + **Vite** + **TypeScript**
- **Pinia** (State Management)
- **Dexie.js** (IndexedDB / Local Storage)
- **Chart.js** (Analytics Visualization)
- **PWA** (Workbox - Offline Support)
- **Vercel** (Deployment)

## 📦 MVP Scope (LOCKED)

### ✅ IN
- Multi-mode timer (Focus / Deep Focus / Conversation / Pause)
- Conversation cost tracker (live, gentle counter)
- Weekly insights with calm observations
- PWA installation (iOS + Android)
- Export/backup functionality

### ❌ OUT (for now)
- Team mode
- Authentication
- Cloud sync
- Advanced AI recommendations

## 🏗️ Development Timeline

- **Days 0-1**: Setup + Design Foundation
- **Days 1-2**: Timer Core
- **Days 3-4**: Conversation Cost Tracker (Core Feature)
- **Days 5-6**: Weekly Insights
- **Days 7-8**: PWA + Offline
- **Days 9-10**: Quality & Edge Cases
- **Days 10-11**: Deploy + Demo

## 🔒 Privacy First

All data is stored locally on your device. No servers, no tracking, no data collection.

## 📅 Changelog

### Epic 1 — Conversation Timer (Completed Dec 24, 2024)
- ✅ Conversation timer with Begin/Pause/Resume/Stop
- ✅ Real-time cost calculation (hourly rate × participants × duration)
- ✅ Participants adjustment (+/-)
- ✅ Observation card at 45min natural conclusion point
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ UI aligned to approved mockup

**Components**: Button, TimerDisplay, CostCounter, ParticipantsInput, ConversationView

### Epic 0 — Setup & Design (Completed Dec 24, 2024)
- ✅ Project initialized (Vue 3 + Vite + TypeScript)
- ✅ Design system with CSS variables
- ✅ Heara rebranding
- ✅ Brand guidelines + UI mockups

## 📄 License

MIT

---

**Status**: ✅ Epic 0 & 1 Complete | 🚧 Epic 2 (Persistence) Next
