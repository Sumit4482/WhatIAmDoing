import { io, Socket } from 'socket.io-client';

// Use environment variable or fallback to localhost for development
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  connect() {
    if (this.socket?.connected) return;

    console.log('🔌 Connecting to backend:', BACKEND_URL);

    this.socket = io(BACKEND_URL, {
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('🔌 Connected to backend');
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from backend');
    });

    this.socket.on('connect_error', (error) => {
      console.error('⚠️ Connection error:', error.message);
    });

    // Re-emit events to listeners
    const events = [
      'state:full',
      'mood:updated',
      'activity:started',
      'activity:stopped',
      'task:added',
      'task:updated',
      'task:deleted',
      'dailyChallenge:updated',
      'timeBlock:added',
      'timeBlock:updated',
      'timeBlock:deleted',
      'heatmap:updated',
      'roast:new',
    ];

    events.forEach((event) => {
      this.socket!.on(event, (data) => {
        const eventListeners = this.listeners.get(event);
        if (eventListeners) {
          eventListeners.forEach((listener) => listener(data));
        }
      });
    });
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  on(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  emit(event: string, data?: any) {
    this.socket?.emit(event, data);
  }

  // Convenience methods
  updateMood(mood: { emoji: string; label: string; description: string }) {
    this.emit('mood:update', mood);
  }

  startActivity(activity: any) {
    this.emit('activity:start', activity);
  }

  stopActivity() {
    this.emit('activity:stop');
  }

  addTask(task: any) {
    this.emit('task:add', task);
  }

  updateTask(task: any) {
    this.emit('task:update', task);
  }

  deleteTask(taskId: string) {
    this.emit('task:delete', taskId);
  }

  updateDailyChallenge(challenge: any) {
    this.emit('dailyChallenge:update', challenge);
  }

  addTimeBlock(block: any) {
    this.emit('timeBlock:add', block);
  }

  updateTimeBlock(block: any) {
    this.emit('timeBlock:update', block);
  }

  deleteTimeBlock(blockId: string) {
    this.emit('timeBlock:delete', blockId);
  }

  updateHeatmap(day: { date: string; mental: boolean; physical: boolean }) {
    this.emit('heatmap:update', day);
  }
}

export const socketService = new SocketService();

// Export the backend URL for API calls
export const BACKEND_API_URL = BACKEND_URL;
