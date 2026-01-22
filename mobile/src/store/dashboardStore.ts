import AsyncStorage from '@react-native-async-storage/async-storage';
import { io, Socket } from 'socket.io-client';
import { 
  DashboardState, 
  Task, 
  Activity, 
  DailyChallenge, 
  TimeBlock, 
  DayActivity, 
  Mood, 
  Roast,
  MOOD_OPTIONS 
} from '../types';

const STORAGE_KEY = 'dashboard_state';
const BACKEND_URL = 'http://localhost:3001';

const initialState: DashboardState = {
  mood: MOOD_OPTIONS[0],
  tasks: [],
  currentActivity: null,
  dailyChallenge: {
    mental: { done: false, title: 'LeetCode #234', detail: 'Palindrome Linked List', difficulty: 'Medium', streak: 12 },
    physical: { done: false, title: 'Running', quantity: '5km', detail: '28min pace', streak: 5 },
  },
  timeBlocks: [],
  heatmapData: [],
  roasts: [],
};

type Listener = (state: DashboardState) => void;

class DashboardStore {
  private state: DashboardState = initialState;
  private listeners: Set<Listener> = new Set();
  private initialized = false;
  private socket: Socket | null = null;
  private connected = false;

  async init() {
    if (this.initialized) return;
    
    // Connect to backend
    this.connectSocket();
    
    this.initialized = true;
  }

  private connectSocket() {
    this.socket = io(BACKEND_URL, {
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('🔌 Connected to backend');
      this.connected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from backend');
      this.connected = false;
    });

    // Listen for full state
    this.socket.on('state:full', (data) => {
      this.state = { ...this.state, ...data };
      this.notify();
    });

    // Listen for updates
    this.socket.on('mood:updated', (mood) => {
      this.state = { ...this.state, mood };
      this.notify();
    });

    this.socket.on('activity:started', (activity) => {
      this.state = { ...this.state, currentActivity: activity };
      this.notify();
    });

    this.socket.on('activity:stopped', () => {
      this.state = { ...this.state, currentActivity: null };
      this.notify();
    });

    this.socket.on('task:added', (task) => {
      this.state = { ...this.state, tasks: [...this.state.tasks, task] };
      this.notify();
    });

    this.socket.on('task:updated', (task) => {
      this.state = {
        ...this.state,
        tasks: this.state.tasks.map(t => t.id === task.id ? task : t),
      };
      this.notify();
    });

    this.socket.on('task:deleted', (taskId) => {
      this.state = {
        ...this.state,
        tasks: this.state.tasks.filter(t => t.id !== taskId),
      };
      this.notify();
    });

    this.socket.on('dailyChallenge:updated', (challenge) => {
      this.state = { ...this.state, dailyChallenge: challenge };
      this.notify();
    });

    this.socket.on('timeBlock:added', (block) => {
      this.state = {
        ...this.state,
        timeBlocks: [...this.state.timeBlocks, block].sort((a, b) => a.startHour - b.startHour),
      };
      this.notify();
    });

    this.socket.on('timeBlock:updated', (block) => {
      this.state = {
        ...this.state,
        timeBlocks: this.state.timeBlocks.map(b => b.id === block.id ? block : b).sort((a, b) => a.startHour - b.startHour),
      };
      this.notify();
    });

    this.socket.on('timeBlock:deleted', (blockId) => {
      this.state = {
        ...this.state,
        timeBlocks: this.state.timeBlocks.filter(b => b.id !== blockId),
      };
      this.notify();
    });

    this.socket.on('heatmap:updated', (day) => {
      this.state = {
        ...this.state,
        heatmapData: this.state.heatmapData.map(d => d.date === day.date ? day : d),
      };
      this.notify();
    });

    this.socket.on('roast:new', (roast) => {
      this.state = {
        ...this.state,
        roasts: [roast, ...this.state.roasts],
      };
      this.notify();
    });
  }

  getState(): DashboardState {
    return this.state;
  }

  isConnected(): boolean {
    return this.connected;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(l => l(this.state));
  }

  private emit(event: string, data?: any) {
    this.socket?.emit(event, data);
  }

  // Mood
  setMood(mood: Mood) {
    this.state = { ...this.state, mood };
    this.notify();
    this.emit('mood:update', mood);
  }

  // Tasks
  addTask(title: string, emoji: string) {
    const task: Task = {
      id: Date.now().toString(),
      title,
      emoji,
      completed: null,
      createdAt: new Date().toISOString(),
    };
    this.state = { ...this.state, tasks: [...this.state.tasks, task] };
    this.notify();
    this.emit('task:add', task);
  }

  updateTask(id: string, updates: Partial<Task>) {
    const task = this.state.tasks.find(t => t.id === id);
    if (!task) return;
    const updatedTask = { ...task, ...updates };
    this.state = {
      ...this.state,
      tasks: this.state.tasks.map(t => t.id === id ? updatedTask : t),
    };
    this.notify();
    this.emit('task:update', updatedTask);
  }

  deleteTask(id: string) {
    this.state = {
      ...this.state,
      tasks: this.state.tasks.filter(t => t.id !== id),
    };
    this.notify();
    this.emit('task:delete', id);
  }

  setTaskStatus(id: string, completed: boolean | null) {
    this.updateTask(id, { completed });
  }

  // Current Activity
  startActivity(type: Activity['type'], title: string, emoji: string) {
    const activity: Activity = {
      id: Date.now().toString(),
      type,
      title,
      emoji,
      isLive: true,
      startedAt: new Date().toISOString(),
    };
    this.state = { ...this.state, currentActivity: activity };
    this.notify();
    this.emit('activity:start', activity);
  }

  stopActivity() {
    if (this.state.currentActivity) {
      this.state = { ...this.state, currentActivity: null };
      this.notify();
      this.emit('activity:stop');
    }
  }

  clearActivity() {
    this.state = { ...this.state, currentActivity: null };
    this.notify();
    this.emit('activity:stop');
  }

  // Daily Challenge
  updateDailyChallenge(updates: Partial<DailyChallenge>) {
    this.state = {
      ...this.state,
      dailyChallenge: { ...this.state.dailyChallenge, ...updates },
    };
    this.notify();
    this.emit('dailyChallenge:update', this.state.dailyChallenge);
  }

  toggleMentalChallenge() {
    const mental = { ...this.state.dailyChallenge.mental, done: !this.state.dailyChallenge.mental.done };
    if (mental.done && !this.state.dailyChallenge.mental.done) {
      mental.streak += 1;
    }
    this.updateDailyChallenge({ mental });
  }

  togglePhysicalChallenge() {
    const physical = { ...this.state.dailyChallenge.physical, done: !this.state.dailyChallenge.physical.done };
    if (physical.done && !this.state.dailyChallenge.physical.done) {
      physical.streak += 1;
    }
    this.updateDailyChallenge({ physical });
  }

  setMentalChallenge(title: string, detail: string, difficulty?: string) {
    this.updateDailyChallenge({
      mental: { ...this.state.dailyChallenge.mental, title, detail, difficulty },
    });
  }

  setPhysicalChallenge(title: string, quantity: string, detail: string) {
    this.updateDailyChallenge({
      physical: { ...this.state.dailyChallenge.physical, title, quantity, detail },
    });
  }

  // Timeline
  addTimeBlock(block: Omit<TimeBlock, 'id'>) {
    const newBlock: TimeBlock = { ...block, id: Date.now().toString() };
    this.state = { ...this.state, timeBlocks: [...this.state.timeBlocks, newBlock].sort((a, b) => a.startHour - b.startHour) };
    this.notify();
    this.emit('timeBlock:add', newBlock);
  }

  updateTimeBlock(id: string, updates: Partial<TimeBlock>) {
    const block = this.state.timeBlocks.find(b => b.id === id);
    if (!block) return;
    const updatedBlock = { ...block, ...updates };
    this.state = {
      ...this.state,
      timeBlocks: this.state.timeBlocks.map(b => b.id === id ? updatedBlock : b).sort((a, b) => a.startHour - b.startHour),
    };
    this.notify();
    this.emit('timeBlock:update', updatedBlock);
  }

  deleteTimeBlock(id: string) {
    this.state = {
      ...this.state,
      timeBlocks: this.state.timeBlocks.filter(b => b.id !== id),
    };
    this.notify();
    this.emit('timeBlock:delete', id);
  }

  // Heatmap
  updateHeatmapDay(date: string, mental: boolean, physical: boolean) {
    const day = { date, mental, physical };
    const exists = this.state.heatmapData.find(d => d.date === date);
    if (exists) {
      this.state = {
        ...this.state,
        heatmapData: this.state.heatmapData.map(d => d.date === date ? day : d),
      };
    } else {
      this.state = {
        ...this.state,
        heatmapData: [...this.state.heatmapData, day].sort((a, b) => a.date.localeCompare(b.date)),
      };
    }
    this.notify();
    this.emit('heatmap:update', day);
  }
}

export const dashboardStore = new DashboardStore();
