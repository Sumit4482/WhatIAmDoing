import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export interface Activity {
  id: string;
  type: "study" | "running" | "gym" | "coding" | "reading" | "meditation" | "custom";
  title: string;
  emoji: string;
  duration?: number;
  isLive?: boolean;
  startedAt?: Date;
  distance?: number;
  customMetric?: { label: string; value: string };
}

const activityConfig: Record<string, string> = {
  study: "card-purple",
  running: "card-orange",
  gym: "card-coral",
  coding: "card-blue",
  reading: "card-yellow",
  meditation: "card-green",
  custom: "card-pink",
};

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
}

function LiveTimer({ startedAt }: { startedAt: Date }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = Math.floor((Date.now() - startedAt.getTime()) / 1000 / 60);
      setElapsed(diff);
    }, 1000);
    return () => clearInterval(interval);
  }, [startedAt]);

  return (
    <div className="flex items-center gap-1.5 bg-[hsl(145_60%_88%/0.8)] border border-[hsl(145_50%_70%/0.5)] px-2 py-1 rounded-full">
      <span className="w-2 h-2 rounded-full bg-[hsl(145_60%_45%)] animate-pulse" />
      <span className="font-mono text-xs font-bold text-[hsl(145_50%_35%)]">{formatDuration(elapsed)}</span>
    </div>
  );
}

interface ActivityTrackerProps {
  activity: Activity | null;
}

export function ActivityTracker({ activity }: ActivityTrackerProps) {
  if (!activity) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card-white rounded-xl shadow-pastel p-3 lg:p-4 flex flex-col items-center justify-center text-center"
      >
        <span className="text-3xl lg:text-4xl mb-2">😴</span>
        <span className="text-[9px] font-bold uppercase tracking-widest text-foreground/40">Currently</span>
        <h2 className="text-base lg:text-lg font-extrabold text-foreground">Chilling</h2>
        <span className="text-[10px] text-foreground/40 mt-1">No activity tracked</span>
      </motion.div>
    );
  }

  const cardClass = activityConfig[activity.type] || activityConfig.custom;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
      className={`${cardClass} rounded-xl shadow-pastel p-3 lg:p-4 flex flex-col items-center justify-center text-center`}
    >
      <motion.div
        className="text-3xl lg:text-5xl mb-2"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {activity.emoji}
      </motion.div>
      
      <span className="text-[9px] font-bold uppercase tracking-widest text-foreground/50">
        {activity.isLive ? "Currently" : "Last Activity"}
      </span>
      
      <h2 className="text-base lg:text-xl font-extrabold text-foreground">{activity.title}</h2>
      
      <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
        {activity.isLive && activity.startedAt ? (
          <LiveTimer startedAt={activity.startedAt} />
        ) : activity.duration ? (
          <div className="flex items-center gap-1.5 bg-white/60 border border-white/80 px-2 py-1 rounded-full">
            <span className="text-xs">⏱️</span>
            <span className="font-mono text-xs font-bold text-foreground/70">{formatDuration(activity.duration)}</span>
          </div>
        ) : null}
        
        {activity.distance && (
          <div className="flex items-center gap-1.5 bg-white/60 border border-white/80 px-2 py-1 rounded-full">
            <span className="text-xs">📍</span>
            <span className="font-mono text-xs font-bold text-foreground/70">{activity.distance} km</span>
          </div>
        )}
        
        {activity.customMetric && (
          <div className="flex items-center gap-1.5 bg-white/60 border border-white/80 px-2 py-1 rounded-full">
            <span className="text-xs font-medium text-foreground/50">{activity.customMetric.label}:</span>
            <span className="font-mono text-xs font-bold text-foreground/70">{activity.customMetric.value}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
