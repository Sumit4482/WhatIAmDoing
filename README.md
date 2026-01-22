# Sumit Dashboard

Personal accountability dashboard with web and mobile apps.

## 📁 Project Structure

```
sumit-dashboard/
├── web/          # React web dashboard (Vite + TypeScript)
├── mobile/       # Expo mobile app (React Native + TypeScript)
├── shared/       # Shared types and utilities
└── package.json  # Root monorepo config
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo Go app on your phone (for mobile development)

### Install Dependencies

```bash
# Install all dependencies (web, mobile, shared)
npm install
```

### Run Web Dashboard

```bash
npm run web
# Opens at http://localhost:8080
```

### Run Mobile App

```bash
npm run mobile
# Scan QR code with Expo Go app
```

Or run on specific platform:
```bash
npm run mobile:ios      # iOS Simulator
npm run mobile:android  # Android Emulator
```

## 📱 Mobile App Features

The mobile app controls the dashboard:
- ✅ Add/complete/skip tasks
- 🏃 Track activities with time/quantity
- 🧠 Complete daily mental & physical challenges
- 😊 Set mood and status
- 🔄 Sync data to web dashboard

## 🌐 Web Dashboard Features

Read-only display (except roasts):
- 📋 View tasks and progress
- ⏱️ See current activity
- 📊 Year activity heatmap
- 🔥 Roast corner (visitors can add)
- 🎵 Lofi music player

## 🔗 Shared Types

Import shared types in both projects:

```typescript
// In web or mobile
import { Task, Activity, DashboardState } from '@sumit-dashboard/shared';
```

## 📦 Tech Stack

| Layer | Technology |
|-------|------------|
| Web | React 18, Vite, TypeScript, Tailwind CSS |
| Mobile | Expo, React Native, TypeScript |
| Shared | TypeScript interfaces |
