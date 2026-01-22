const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);

// Environment variables
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8080';

// CORS origins - allow both production and development
const allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:8090',
  'http://localhost:8095',
  'http://localhost:5173',
  'http://127.0.0.1:8080',
  'http://127.0.0.1:8090',
  FRONTEND_URL,
];

// Add any additional origins from env
if (process.env.ALLOWED_ORIGINS) {
  process.env.ALLOWED_ORIGINS.split(',').forEach(origin => {
    allowedOrigins.push(origin.trim());
  });
}

// Initialize Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: '🚀 Sumit Dashboard Backend is running!',
    env: NODE_ENV,
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Initialize SQLite Database
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'dashboard.db');
const dbDir = path.dirname(dbPath);

// Ensure database directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log(`📁 Created database directory: ${dbDir}`);
}

const db = new Database(dbPath);

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS dashboard_state (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    mood_emoji TEXT DEFAULT '😎',
    mood_label TEXT DEFAULT 'Focused',
    mood_description TEXT DEFAULT 'Deep work mode 🎯',
    current_activity TEXT,
    daily_challenge TEXT,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    emoji TEXT DEFAULT '📋',
    completed INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS time_blocks (
    id TEXT PRIMARY KEY,
    activity TEXT NOT NULL,
    emoji TEXT DEFAULT '💻',
    start_hour REAL NOT NULL,
    end_hour REAL NOT NULL,
    color TEXT DEFAULT 'coding'
  );

  CREATE TABLE IF NOT EXISTS heatmap_data (
    date TEXT PRIMARY KEY,
    mental INTEGER DEFAULT 0,
    physical INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS roasts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    message TEXT NOT NULL,
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

// Initialize default state if not exists
const initState = db.prepare('SELECT * FROM dashboard_state WHERE id = 1').get();
if (!initState) {
  db.prepare(`
    INSERT INTO dashboard_state (id, mood_emoji, mood_label, mood_description, daily_challenge)
    VALUES (1, '😎', 'Focused', 'Deep work mode 🎯', ?)
  `).run(JSON.stringify({
    mental: { done: false, title: 'LeetCode #234', detail: 'Palindrome Linked List', difficulty: 'Medium', streak: 12 },
    physical: { done: false, title: 'Running', quantity: '5km', detail: '28min pace', streak: 5 },
  }));
}

// Initialize default tasks
const taskCount = db.prepare('SELECT COUNT(*) as count FROM tasks').get();
if (taskCount.count === 0) {
  const insertTask = db.prepare('INSERT INTO tasks (id, title, emoji, completed) VALUES (?, ?, ?, ?)');
  insertTask.run('1', 'Morning workout', '💪', null);
  insertTask.run('2', 'DSA practice', '🧠', null);
  insertTask.run('3', 'Read 30 pages', '📚', null);
}

// Initialize default time blocks
const blockCount = db.prepare('SELECT COUNT(*) as count FROM time_blocks').get();
if (blockCount.count === 0) {
  const insertBlock = db.prepare('INSERT INTO time_blocks (id, activity, emoji, start_hour, end_hour, color) VALUES (?, ?, ?, ?, ?, ?)');
  insertBlock.run('1', 'Sleep', '😴', 0, 7, 'other');
  insertBlock.run('2', 'Workout', '💪', 7, 8, 'exercise');
  insertBlock.run('3', 'DSA Practice', '🧠', 8, 10, 'study');
  insertBlock.run('4', 'Break', '☕', 10, 10.5, 'break');
  insertBlock.run('5', 'Coding', '💻', 10.5, 13, 'coding');
  insertBlock.run('6', 'Lunch', '🍱', 13, 14, 'break');
  insertBlock.run('7', 'Meeting', '📞', 14, 15, 'meeting');
  insertBlock.run('8', 'Coding', '💻', 15, 18, 'coding');
}

// Initialize default roasts
const roastCount = db.prepare('SELECT COUNT(*) as count FROM roasts').get();
if (roastCount.count === 0) {
  const insertRoast = db.prepare('INSERT INTO roasts (id, name, message, timestamp) VALUES (?, ?, ?, ?)');
  insertRoast.run('1', 'Alex', 'Skipped gym again? 💀', new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString());
  insertRoast.run('2', 'Maya', 'Duolingo owl is watching 🦉', new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString());
  insertRoast.run('3', 'Jordan', "YouTube isn't studying bro 📺", new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString());
}

// Initialize heatmap data (last 365 days)
const heatmapCount = db.prepare('SELECT COUNT(*) as count FROM heatmap_data').get();
if (heatmapCount.count === 0) {
  const insertDay = db.prepare('INSERT OR IGNORE INTO heatmap_data (date, mental, physical) VALUES (?, ?, ?)');
  const today = new Date();
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    insertDay.run(dateStr, Math.random() < 0.6 ? 1 : 0, Math.random() < 0.5 ? 1 : 0);
  }
}

// Helper function to get full state
function getFullState() {
  const state = db.prepare('SELECT * FROM dashboard_state WHERE id = 1').get();
  const tasks = db.prepare('SELECT * FROM tasks ORDER BY created_at').all();
  const timeBlocks = db.prepare('SELECT * FROM time_blocks ORDER BY start_hour').all();
  const heatmapData = db.prepare('SELECT * FROM heatmap_data ORDER BY date').all();
  const roasts = db.prepare('SELECT * FROM roasts ORDER BY timestamp DESC').all();

  return {
    mood: {
      emoji: state.mood_emoji,
      label: state.mood_label,
      description: state.mood_description,
    },
    currentActivity: state.current_activity ? JSON.parse(state.current_activity) : null,
    dailyChallenge: state.daily_challenge ? JSON.parse(state.daily_challenge) : null,
    tasks: tasks.map(t => ({
      id: t.id,
      title: t.title,
      emoji: t.emoji,
      completed: t.completed === null ? null : t.completed === 1,
      createdAt: t.created_at,
    })),
    timeBlocks: timeBlocks.map(b => ({
      id: b.id,
      activity: b.activity,
      emoji: b.emoji,
      startHour: b.start_hour,
      endHour: b.end_hour,
      color: b.color,
    })),
    heatmapData: heatmapData.map(d => ({
      date: d.date,
      mental: d.mental === 1,
      physical: d.physical === 1,
    })),
    roasts: roasts.map(r => ({
      id: r.id,
      name: r.name,
      message: r.message,
      timestamp: r.timestamp,
    })),
  };
}

// REST API Endpoints
app.get('/api/state', (req, res) => {
  res.json(getFullState());
});

app.post('/api/roast', (req, res) => {
  const { name, message } = req.body;
  if (!name || !message) {
    return res.status(400).json({ error: 'Name and message required' });
  }
  const id = Date.now().toString();
  const timestamp = new Date().toISOString();
  db.prepare('INSERT INTO roasts (id, name, message, timestamp) VALUES (?, ?, ?, ?)').run(id, name, message, timestamp);
  const roast = { id, name, message, timestamp };
  io.emit('roast:new', roast);
  res.json(roast);
});

// Socket.io Connection
io.on('connection', (socket) => {
  console.log(`✅ Client connected: ${socket.id}`);

  // Send initial state
  socket.emit('state:full', getFullState());

  // Mood update
  socket.on('mood:update', (mood) => {
    db.prepare('UPDATE dashboard_state SET mood_emoji = ?, mood_label = ?, mood_description = ?, updated_at = ? WHERE id = 1')
      .run(mood.emoji, mood.label, mood.description, new Date().toISOString());
    io.emit('mood:updated', mood);
    console.log('😎 Mood updated:', mood.label);
  });

  // Current activity
  socket.on('activity:start', (activity) => {
    db.prepare('UPDATE dashboard_state SET current_activity = ?, updated_at = ? WHERE id = 1')
      .run(JSON.stringify(activity), new Date().toISOString());
    io.emit('activity:started', activity);
    console.log('⚡ Activity started:', activity.title);
  });

  socket.on('activity:stop', () => {
    db.prepare('UPDATE dashboard_state SET current_activity = NULL, updated_at = ? WHERE id = 1')
      .run(new Date().toISOString());
    io.emit('activity:stopped');
    console.log('⏹️ Activity stopped');
  });

  // Tasks
  socket.on('task:add', (task) => {
    db.prepare('INSERT INTO tasks (id, title, emoji, completed, created_at) VALUES (?, ?, ?, ?, ?)')
      .run(task.id, task.title, task.emoji, null, task.createdAt || new Date().toISOString());
    io.emit('task:added', task);
    console.log('📋 Task added:', task.title);
  });

  socket.on('task:update', (task) => {
    const completed = task.completed === null ? null : task.completed ? 1 : 0;
    db.prepare('UPDATE tasks SET title = ?, emoji = ?, completed = ? WHERE id = ?')
      .run(task.title, task.emoji, completed, task.id);
    io.emit('task:updated', task);
    console.log('✏️ Task updated:', task.title);
  });

  socket.on('task:delete', (taskId) => {
    db.prepare('DELETE FROM tasks WHERE id = ?').run(taskId);
    io.emit('task:deleted', taskId);
    console.log('🗑️ Task deleted:', taskId);
  });

  // Daily Challenge
  socket.on('dailyChallenge:update', (challenge) => {
    db.prepare('UPDATE dashboard_state SET daily_challenge = ?, updated_at = ? WHERE id = 1')
      .run(JSON.stringify(challenge), new Date().toISOString());
    
    // Update today's heatmap
    const today = new Date().toISOString().split('T')[0];
    db.prepare('INSERT OR REPLACE INTO heatmap_data (date, mental, physical) VALUES (?, ?, ?)')
      .run(today, challenge.mental.done ? 1 : 0, challenge.physical.done ? 1 : 0);
    
    io.emit('dailyChallenge:updated', challenge);
    console.log('🏆 Daily challenge updated');
  });

  // Time blocks
  socket.on('timeBlock:add', (block) => {
    db.prepare('INSERT INTO time_blocks (id, activity, emoji, start_hour, end_hour, color) VALUES (?, ?, ?, ?, ?, ?)')
      .run(block.id, block.activity, block.emoji, block.startHour, block.endHour, block.color);
    io.emit('timeBlock:added', block);
    console.log('🗓️ Time block added:', block.activity);
  });

  socket.on('timeBlock:update', (block) => {
    db.prepare('UPDATE time_blocks SET activity = ?, emoji = ?, start_hour = ?, end_hour = ?, color = ? WHERE id = ?')
      .run(block.activity, block.emoji, block.startHour, block.endHour, block.color, block.id);
    io.emit('timeBlock:updated', block);
    console.log('🗓️ Time block updated:', block.activity);
  });

  socket.on('timeBlock:delete', (blockId) => {
    db.prepare('DELETE FROM time_blocks WHERE id = ?').run(blockId);
    io.emit('timeBlock:deleted', blockId);
    console.log('🗓️ Time block deleted:', blockId);
  });

  // Heatmap
  socket.on('heatmap:update', (day) => {
    db.prepare('INSERT OR REPLACE INTO heatmap_data (date, mental, physical) VALUES (?, ?, ?)')
      .run(day.date, day.mental ? 1 : 0, day.physical ? 1 : 0);
    io.emit('heatmap:updated', day);
    console.log('📊 Heatmap updated:', day.date);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`
🚀 Sumit Dashboard Backend Running!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 Server:     http://0.0.0.0:${PORT}
🌐 Environment: ${NODE_ENV}
💾 Database:   ${dbPath}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
});
