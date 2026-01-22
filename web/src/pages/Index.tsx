import { motion } from "framer-motion";
import { TaskList } from "@/components/TaskList";
import { ActivityTracker } from "@/components/ActivityTracker";
import { RoastSection } from "@/components/RoastSection";
import { TodayTimeline } from "@/components/TodayTimeline";
import { MiniHeatmap } from "@/components/MiniHeatmap";
import { NowPlaying } from "@/components/NowPlaying";
import { useDashboard } from "@/hooks/useDashboard";

const quotes = [
  { text: "Ship it before it's perfect", author: "Every startup ever" },
  { text: "It works on my machine", author: "Famous last words" },
  { text: "One more episode won't hurt", author: "Narrator: It did" },
  { text: "I'll refactor this later", author: "Lies we tell ourselves" },
  { text: "Sleep is for the weak", author: "Me at 3am debugging" },
];

const Index = () => {
  const dashboard = useDashboard();
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  const currentHour = new Date().getHours() + new Date().getMinutes() / 60;

  // Transform tasks for TaskList component
  const tasks = dashboard.tasks.map(t => ({
    id: t.id,
    title: t.title,
    emoji: t.emoji,
    completed: t.completed,
  }));

  // Transform current activity for ActivityTracker
  const currentActivity = dashboard.currentActivity ? {
    id: dashboard.currentActivity.id,
    type: dashboard.currentActivity.type as any,
    title: dashboard.currentActivity.title,
    emoji: dashboard.currentActivity.emoji,
    isLive: dashboard.currentActivity.isLive,
    startedAt: new Date(dashboard.currentActivity.startedAt),
  } : null;

  // Transform time blocks for Timeline
  const timeBlocks = dashboard.timeBlocks.map(b => ({
    id: b.id,
    activity: b.activity,
    emoji: b.emoji,
    startHour: b.startHour,
    endHour: b.endHour,
    color: b.color as any,
  }));

  return (
    <div className="min-h-screen lg:h-screen w-full p-2 sm:p-3 lg:p-4 relative overflow-auto lg:overflow-hidden">
      {/* Light pastel background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[hsl(280_60%_95%)] via-[hsl(200_70%_95%)] to-[hsl(340_60%_95%)]" />
      
      {/* Decorative blobs */}
      <div className="fixed -top-32 -right-32 w-96 h-96 bg-[hsl(280_70%_85%)] blob opacity-50 pointer-events-none" />
      <div className="fixed -bottom-24 -left-24 w-72 h-72 bg-[hsl(200_80%_85%)] blob opacity-50 pointer-events-none" style={{ animationDelay: "-4s" }} />
      <div className="fixed top-1/3 right-1/4 w-48 h-48 bg-[hsl(340_70%_88%)] blob opacity-40 pointer-events-none" style={{ animationDelay: "-2s" }} />
      <div className="fixed bottom-1/4 left-1/3 w-32 h-32 bg-[hsl(45_90%_85%)] blob opacity-40 pointer-events-none" style={{ animationDelay: "-6s" }} />

      {/* Connection Status */}
      {!dashboard.connected && (
        <div className="fixed top-2 right-2 z-50 bg-yellow-100 border border-yellow-300 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2">
          <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
          Connecting...
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto h-full flex flex-col gap-2 lg:gap-3 relative z-10">
        
        {/* ===== HEADER ROW ===== */}
        <div className="grid grid-cols-12 gap-2 items-stretch">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-6 sm:col-span-4 lg:col-span-2 card-white rounded-xl shadow-pastel p-2 flex items-center gap-2"
          >
            <motion.span 
              className="text-lg"
              animate={{ rotate: [-5, 5, -5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              👋
            </motion.span>
            <h1 className="text-xs lg:text-sm font-black gradient-text-fun">
              What's Sumit doing?
            </h1>
          </motion.div>

          {/* Mood Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 }}
            className="col-span-6 sm:col-span-4 lg:col-span-2 card-cyan rounded-xl shadow-pastel p-2"
          >
            <div className="flex items-center gap-2">
              <motion.span 
                className="text-xl lg:text-2xl"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                key={dashboard.mood.emoji}
              >
                {dashboard.mood.emoji}
              </motion.span>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold block text-[hsl(180_60%_35%)]">
                  {dashboard.mood.label}
                </span>
                <span className="text-[8px] text-foreground/50 block truncate">
                  {dashboard.mood.description}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Quote */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="col-span-12 sm:col-span-4 lg:col-span-3 card-purple rounded-xl shadow-pastel p-2 flex items-center"
          >
            <div>
              <p className="text-[9px] italic leading-snug text-foreground/70 line-clamp-1">
                "{quote.text}"
              </p>
              <p className="text-[8px] text-[hsl(280_60%_50%)]">— {quote.author}</p>
            </div>
          </motion.div>

          {/* Daily Duo - Compact inline */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="col-span-12 lg:col-span-5 card-green rounded-xl shadow-pastel p-2"
          >
            <div className="flex items-center gap-2 h-full">
              <span className="text-sm">⚡</span>
              <span className="font-bold text-[10px] text-foreground/70">Daily Duo</span>
              
              {/* Mental */}
              <div className={`flex-1 flex items-center gap-1.5 rounded-lg px-2 py-1 ${
                dashboard.dailyChallenge.mental.done 
                  ? "bg-[hsl(280_60%_90%/0.8)]" 
                  : "bg-white/50"
              }`}>
                <span className="text-sm">🧠</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-bold text-foreground truncate">{dashboard.dailyChallenge.mental.title}</p>
                  <p className="text-[8px] text-foreground/50 truncate">{dashboard.dailyChallenge.mental.detail}</p>
                </div>
                {dashboard.dailyChallenge.mental.done && (
                  <span className="text-[8px] bg-[hsl(145_60%_45%)] text-white px-1 py-0.5 rounded font-bold">✓</span>
                )}
              </div>

              {/* Physical */}
              <div className={`flex-1 flex items-center gap-1.5 rounded-lg px-2 py-1 ${
                dashboard.dailyChallenge.physical.done 
                  ? "bg-[hsl(145_55%_88%/0.8)]" 
                  : "bg-white/50"
              }`}>
                <span className="text-sm">💪</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-bold text-foreground truncate">{dashboard.dailyChallenge.physical.title}</p>
                  <p className="text-[8px] text-[hsl(145_50%_40%)]">{dashboard.dailyChallenge.physical.quantity}</p>
                </div>
                {dashboard.dailyChallenge.physical.done && (
                  <span className="text-[8px] bg-[hsl(145_60%_45%)] text-white px-1 py-0.5 rounded font-bold">✓</span>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ===== MAIN CONTENT ===== */}
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-3 flex-1 min-h-0">
          
          {/* Left Column - Tasks */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full lg:w-1/4"
          >
            <TaskList tasks={tasks} />
          </motion.div>

          {/* Center Column */}
          <div className="w-full lg:w-1/2 flex flex-col gap-2 lg:gap-3">
            {/* Current Activity */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 }}
            >
              <ActivityTracker activity={currentActivity} />
            </motion.div>

            {/* Today's Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex-1"
            >
              <TodayTimeline blocks={timeBlocks} currentHour={currentHour} />
            </motion.div>

            {/* Heatmap */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <MiniHeatmap days={dashboard.heatmapData} />
            </motion.div>
          </div>

          {/* Right Column - Now Playing + Roast (Equal Squares) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full lg:w-1/4 grid grid-rows-2 gap-2 h-full"
          >
            <NowPlaying />
            <RoastSection roasts={dashboard.roasts} />
          </motion.div>
        </div>
      </div>

      {/* Floating decorations */}
      <motion.div
        className="hidden lg:block fixed bottom-8 left-8 text-2xl pointer-events-none opacity-50"
        animate={{ y: [0, -8, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        ⭐
      </motion.div>
      <motion.div
        className="hidden lg:block fixed top-20 right-20 text-xl pointer-events-none opacity-40"
        animate={{ y: [0, -6, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        ✨
      </motion.div>
    </div>
  );
};

export default Index;
