import { useState, useEffect } from 'react';
import { socketService } from '@/lib/socket';

export interface Task {
  id: string;
  title: string;
  emoji: string;
  completed: boolean | null;
  createdAt: string;
}

export interface Activity {
  id: string;
  type: string;
  title: string;
  emoji: string;
  isLive: boolean;
  startedAt: string;
}

export interface DailyChallenge {
  mental: { done: boolean; title: string; detail: string; difficulty?: string; streak: number };
  physical: { done: boolean; title: string; quantity: string; detail: string; streak: number };
}

export interface TimeBlock {
  id: string;
  activity: string;
  emoji: string;
  startHour: number;
  endHour: number;
  color: string;
}

export interface DayActivity {
  date: string;
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
  currentActivity: Activity | null;
  dailyChallenge: DailyChallenge;
  tasks: Task[];
  timeBlocks: TimeBlock[];
  heatmapData: DayActivity[];
  roasts: Roast[];
  connected: boolean;
}

const initialState: DashboardState = {
  mood: { emoji: '😎', label: 'Focused', description: 'Deep work mode 🎯' },
  currentActivity: null,
  dailyChallenge: {
    mental: { done: false, title: 'LeetCode #234', detail: 'Palindrome Linked List', difficulty: 'Medium', streak: 12 },
    physical: { done: false, title: 'Running', quantity: '5km', detail: '28min pace', streak: 5 },
  },
  tasks: [],
  timeBlocks: [],
  heatmapData: [],
  roasts: [],
  connected: false,
};

export function useDashboard() {
  const [state, setState] = useState<DashboardState>(initialState);

  useEffect(() => {
    // Connect to backend
    socketService.connect();

    // Listen for full state
    const unsubFull = socketService.on('state:full', (data) => {
      setState((prev) => ({ ...prev, ...data, connected: true }));
    });

    // Listen for updates
    const unsubMood = socketService.on('mood:updated', (mood) => {
      setState((prev) => ({ ...prev, mood }));
    });

    const unsubActivityStart = socketService.on('activity:started', (activity) => {
      setState((prev) => ({ ...prev, currentActivity: activity }));
    });

    const unsubActivityStop = socketService.on('activity:stopped', () => {
      setState((prev) => ({ ...prev, currentActivity: null }));
    });

    const unsubTaskAdd = socketService.on('task:added', (task) => {
      setState((prev) => ({ ...prev, tasks: [...prev.tasks, task] }));
    });

    const unsubTaskUpdate = socketService.on('task:updated', (task) => {
      setState((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) => (t.id === task.id ? task : t)),
      }));
    });

    const unsubTaskDelete = socketService.on('task:deleted', (taskId) => {
      setState((prev) => ({
        ...prev,
        tasks: prev.tasks.filter((t) => t.id !== taskId),
      }));
    });

    const unsubChallenge = socketService.on('dailyChallenge:updated', (challenge) => {
      setState((prev) => ({ ...prev, dailyChallenge: challenge }));
    });

    const unsubBlockAdd = socketService.on('timeBlock:added', (block) => {
      setState((prev) => ({
        ...prev,
        timeBlocks: [...prev.timeBlocks, block].sort((a, b) => a.startHour - b.startHour),
      }));
    });

    const unsubBlockUpdate = socketService.on('timeBlock:updated', (block) => {
      setState((prev) => ({
        ...prev,
        timeBlocks: prev.timeBlocks.map((b) => (b.id === block.id ? block : b)).sort((a, b) => a.startHour - b.startHour),
      }));
    });

    const unsubBlockDelete = socketService.on('timeBlock:deleted', (blockId) => {
      setState((prev) => ({
        ...prev,
        timeBlocks: prev.timeBlocks.filter((b) => b.id !== blockId),
      }));
    });

    const unsubHeatmap = socketService.on('heatmap:updated', (day) => {
      setState((prev) => ({
        ...prev,
        heatmapData: prev.heatmapData.map((d) => (d.date === day.date ? day : d)),
      }));
    });

    const unsubRoast = socketService.on('roast:new', (roast) => {
      setState((prev) => ({
        ...prev,
        roasts: [roast, ...prev.roasts],
      }));
    });

    return () => {
      unsubFull();
      unsubMood();
      unsubActivityStart();
      unsubActivityStop();
      unsubTaskAdd();
      unsubTaskUpdate();
      unsubTaskDelete();
      unsubChallenge();
      unsubBlockAdd();
      unsubBlockUpdate();
      unsubBlockDelete();
      unsubHeatmap();
      unsubRoast();
      socketService.disconnect();
    };
  }, []);

  return state;
}
