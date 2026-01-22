import { motion } from "framer-motion";
import { useState } from "react";

interface DayData {
  date: string;
  level: 0 | 1 | 2 | 3 | 4;
  activity?: string;
}

const levelColors = {
  0: "bg-surface-tertiary",
  1: "bg-status-focus/40",
  2: "bg-status-active/60",
  3: "bg-status-idle/80",
  4: "bg-primary",
};

// Generate mock data for last 12 weeks
function generateMockData(): DayData[] {
  const data: DayData[] = [];
  const today = new Date();
  
  for (let i = 83; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const level = Math.floor(Math.random() * 5) as 0 | 1 | 2 | 3 | 4;
    const activities = ["Working", "Studying", "Gym", "Side project", "Reading"];
    
    data.push({
      date: date.toISOString().split("T")[0],
      level,
      activity: level > 0 ? activities[Math.floor(Math.random() * activities.length)] : undefined,
    });
  }
  
  return data;
}

export function ActivityHeatmap() {
  const [hoveredDay, setHoveredDay] = useState<DayData | null>(null);
  const data = generateMockData();
  
  // Group by weeks
  const weeks: DayData[][] = [];
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7));
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="rounded-2xl bg-card p-6 border border-border/50"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Activity Heatmap</h3>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔥</span>
          <span className="font-mono text-xl font-bold text-status-idle">7 day streak</span>
        </div>
      </div>
      
      <div className="relative">
        <div className="flex gap-1 overflow-x-auto pb-2">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => (
                <motion.div
                  key={day.date}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + (weekIndex * 7 + dayIndex) * 0.01 }}
                  whileHover={{ scale: 1.3 }}
                  className={`w-3 h-3 rounded-sm cursor-pointer transition-all ${levelColors[day.level]}`}
                  onMouseEnter={() => setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}
                />
              ))}
            </div>
          ))}
        </div>
        
        {hoveredDay && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 bg-surface-tertiary px-3 py-2 rounded-lg text-sm whitespace-nowrap border border-border z-10"
          >
            <span className="font-medium">{hoveredDay.date}</span>
            {hoveredDay.activity && (
              <span className="text-muted-foreground"> • {hoveredDay.activity}</span>
            )}
          </motion.div>
        )}
      </div>
      
      <div className="flex items-center justify-end gap-2 mt-4 text-xs text-muted-foreground">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`w-3 h-3 rounded-sm ${levelColors[level as 0 | 1 | 2 | 3 | 4]}`}
          />
        ))}
        <span>More</span>
      </div>
    </motion.div>
  );
}
