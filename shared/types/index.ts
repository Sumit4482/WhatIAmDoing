// Shared types between web dashboard and mobile app

// Task Management
export interface Task {
  id: string;
  title: string;
  emoji: string;
  status: "done" | "pending" | "skipped";
  createdAt: string;
  completedAt?: string;
}

// Activity Tracking
export interface Activity {
  id: string;
  name: string;
  emoji: string;
  duration?: number; // in minutes
  quantity?: number;
  unit?: string; // "km", "pages", "reps", etc.
  startedAt: string;
  endedAt?: string;
  isActive: boolean;
}

// Daily Duo Challenge
export interface DailyChallenge {
  id: string;
  date: string; // YYYY-MM-DD
  mental: {
    name: string;
    detail: string;
    difficulty: "easy" | "medium" | "hard";
    completed: boolean;
  };
  physical: {
    name: string;
    quantity: number;
    unit: string;
    detail: string;
    completed: boolean;
  };
}

// Day Activity for Heatmap
export interface DayActivity {
  date: string; // YYYY-MM-DD
  mentalCompleted: boolean;
  physicalCompleted: boolean;
}

// Timeline Block
export interface TimeBlock {
  id: string;
  activity: string;
  emoji: string;
  color: string;
  startHour: number;
  endHour: number;
}

// Roast/Comment
export interface Roast {
  id: string;
  name: string;
  message: string;
  timestamp: string;
}

// User Status
export type MoodType = "focused" | "chill" | "tired" | "energetic" | "stressed";

export interface UserStatus {
  mood: MoodType;
  quote: string;
  updatedAt: string;
}

// Now Playing
export interface NowPlayingTrack {
  title: string;
  artist: string;
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
}

// Dashboard State (synced from mobile)
export interface DashboardState {
  tasks: Task[];
  currentActivity: Activity | null;
  dailyChallenge: DailyChallenge;
  timeline: TimeBlock[];
  yearActivity: DayActivity[];
  userStatus: UserStatus;
  lastSyncedAt: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Sync payload from mobile to web
export interface SyncPayload {
  dashboardState: DashboardState;
  deviceId: string;
  timestamp: string;
}
