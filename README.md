# Heara

Hear what truly matters.

## Overview

Heara is a privacy-first productivity companion designed to bring visibility to the hidden costs of meetings and work sessions. By tracking time and calculating financial impact in real-time, it helps professionals and teams make more conscious decisions about how they spend their most valuable resource.

The application is built as a Progressive Web App (PWA) with a "Local-First" architecture, ensuring that all sensitive data remains strictly on the user's device.

## Key Features

### Real-Time Cost Tracking
- **Live Calculation**: Instantly visualizes the financial cost of a meeting based on participant count and hourly rates.
- **Visual Feedback**: Provides a gentle, non-intrusive display of accumulating costs to encourage efficiency without inducing stress.

### Smart Session Management
- **Multi-Mode Timer**: Supports various work modes including Conversation, Focus, and Deep Focus.
- **Natural Conclusion Points**: Subtly notifies users when a session has reached a natural wrap-up point (e.g., 45 minutes) to prevent fatigue.
- **Session Restoration**: Automatically saves progress and offers seamless restoration if the browser is closed or the device reloads.

### Analytics & Insights
- **Weekly Summary**: Aggregates data over a rolling 7-day period to show trends in meeting time versus focus time.
- **Privacy-Centric Storage**: All historical data is stored locally using IndexedDB, allowing for detailed insights without compromising privacy.

### Data Safety & Portability
- **Full Export/Import**: Users can export their entire session history to a JSON file for backup or analysis.
- **Secure Restore**: Implements a strict "Wipe & Replace" protocol for data importation to ensure database integrity.

### Progressive Web App (PWA)
- **Offline Capability**: Fully functional without an internet connection.
- **Installable**: Can be installed on iOS, Android, and Desktop for a native app-like experience.

## Technology Stack

### Core
- **Vue 3**: Progressive JavaScript framework for building the user interface.
- **TypeScript**: Ensures type safety and code reliability across the application.
- **Vite**: Next-generation frontend tooling for fast development and optimized production builds.

### State & Persistence
- **Pinia**: Intuitive, type-safe state management for Vue.
- **Dexie.js**: A wrapper for IndexedDB, providing a robust local database for session history.

### Testing & Quality
- **Vitest**: Blazing fast unit test framework used to verify critical logic (cost calculations, data validation).
- **ESLint**: Maintains code quality and consistency.

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YOROBIZ/heara.git
   cd heara
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the local development server:
```bash
npm run dev
```

### Testing

Run the unit test suite to verify core logic:
```bash
npm test
```

### Production Build

Create an optimized production build:
```bash
npm run build
```
The output will be in the `dist` directory.

## Architecture & Design Decisions

### Local-First Philosophy
We prioritized user privacy by adopting a Local-First architecture. Unlike traditional SaaS tools that store sensitive meeting data on remote servers, Heara keeps everything in the browser's IndexedDB. This ensures that:
1. Data ownership remains with the user.
2. The application works perfectly offline.
3. There is zero latency in data retrieval.

### Glassmorphism Design System
The UI employs a "Glassmorphism" aesthetic to create a calm, modern interface. Translucent layers, subtle blurs, and a harmonious color palette are used to reduce visual noise and help users maintain focus.

## License

MIT License

## Author

**Yoro Ndiaye**
Software Developer
