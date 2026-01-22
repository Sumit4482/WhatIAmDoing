// Shared types for mobile app

export interface Task {
  id: string;
  title: string;
  emoji: string;
  completed: boolean | null; // true = done, false = skipped, null = pending
  createdAt: string;
}

export interface Activity {
  id: string;
  type: 'coding' | 'study' | 'running' | 'gym' | 'reading' | 'meditation' | 'custom';
  title: string;
  emoji: string;
  isLive: boolean;
  startedAt: string;
  endedAt?: string;
  duration?: number; // in minutes
}

export interface DailyChallenge {
  mental: {
    done: boolean;
    title: string;
    detail: string;
    difficulty?: string;
    streak: number;
  };
  physical: {
    done: boolean;
    title: string;
    quantity: string;
    detail: string;
    streak: number;
  };
}

export interface TimeBlock {
  id: string;
  activity: string;
  emoji: string;
  startHour: number;
  endHour: number;
  color: 'coding' | 'study' | 'exercise' | 'break' | 'meeting' | 'other';
}

export interface DayActivity {
  date: string; // YYYY-MM-DD
  mental: boolean;
  physical: boolean;
}

export interface Mood {
  emoji: string;
  label: string;
  description: string;
}

export interface Roast {
  id: string;
  name: string;
  message: string;
  timestamp: string;
}

export interface DashboardState {
  mood: Mood;
  tasks: Task[];
  currentActivity: Activity | null;
  dailyChallenge: DailyChallenge;
  timeBlocks: TimeBlock[];
  heatmapData: DayActivity[];
  roasts: Roast[];
}

export const MOOD_OPTIONS: Mood[] = [
  { emoji: '😎', label: 'Focused', description: 'Deep work mode 🎯' },
  { emoji: '😊', label: 'Happy', description: 'Good vibes only ✨' },
  { emoji: '🔥', label: 'Productive', description: 'On fire today 💪' },
  { emoji: '😴', label: 'Tired', description: 'Need coffee ☕' },
  { emoji: '🤔', label: 'Thinking', description: 'Processing... 🧠' },
  { emoji: '😤', label: 'Grinding', description: 'No breaks allowed 💀' },
  { emoji: '🎮', label: 'Chill', description: 'Taking it easy 🌴' },
  { emoji: '📚', label: 'Learning', description: 'Knowledge mode 🎓' },
];

export const ACTIVITY_PRESETS = [
  { type: 'coding' as const, emoji: '💻', title: 'Coding' },
  { type: 'study' as const, emoji: '📚', title: 'Studying' },
  { type: 'running' as const, emoji: '🏃', title: 'Running' },
  { type: 'gym' as const, emoji: '💪', title: 'Gym' },
  { type: 'reading' as const, emoji: '📖', title: 'Reading' },
  { type: 'meditation' as const, emoji: '🧘', title: 'Meditation' },
];

export const TIME_BLOCK_COLORS = {
  coding: '#60A5FA',
  study: '#A78BFA',
  exercise: '#34D399',
  break: '#FBBF24',
  meeting: '#F472B6',
  other: '#9CA3AF',
};
