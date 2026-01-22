import { motion } from "framer-motion";
import { useState } from "react";

export interface DayActivity {
  date: string;
  mental: boolean;
  physical: boolean;
}

interface MiniHeatmapProps {
  days: DayActivity[];
}

const getLevel = (day: DayActivity): number => {
  if (day.mental && day.physical) return 3;
  if (day.mental || day.physical) return 2;
  return 1;
};

const levelColors: Record<number, string> = {
  0: "bg-[hsl(260_30%_92%)]",
  1: "bg-[hsl(260_25%_82%)]",
  2: "bg-[hsl(35_90%_60%)]",
  3: "bg-[hsl(145_65%_45%)]",
};

export function MiniHeatmap({ days }: MiniHeatmapProps) {
  const [hoveredDay, setHoveredDay] = useState<DayActivity | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const perfectDays = days.filter(d => d.mental && d.physical).length;
  const mentalDays = days.filter(d => d.mental).length;
  const physicalDays = days.filter(d => d.physical).length;

  let currentStreak = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].mental && days[i].physical) {
      currentStreak++;
    } else {
      break;
    }
  }

  const weeks: (DayActivity | null)[][] = [];
  let currentWeek: (DayActivity | null)[] = [];
  
  if (days.length > 0) {
    const firstDayOfWeek = new Date(days[0].date).getDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(null);
    }
  }

  days.forEach((day) => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  const handleMouseEnter = (day: DayActivity, e: React.MouseEvent) => {
    setHoveredDay(day);
    setTooltipPos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div className="card-green rounded-xl shadow-pastel p-2 lg:p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-base lg:text-lg">📈</span>
          <h3 className="font-bold text-xs lg:text-sm text-foreground">Year Activity</h3>
        </div>
        <div className="flex items-center gap-3 text-[9px] text-foreground/50">
          <span>🔥 {currentStreak} streak</span>
          <span>⭐ {perfectDays} perfect</span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-1">
        <div className="flex gap-[2px] min-w-max">
          {/* Day labels */}
          <div className="flex flex-col gap-[2px] text-[7px] text-foreground/30 pr-1">
            <span className="h-[8px] lg:h-[10px]"></span>
            <span className="h-[8px] lg:h-[10px]">M</span>
            <span className="h-[8px] lg:h-[10px]"></span>
            <span className="h-[8px] lg:h-[10px]">W</span>
            <span className="h-[8px] lg:h-[10px]"></span>
            <span className="h-[8px] lg:h-[10px]">F</span>
            <span className="h-[8px] lg:h-[10px]"></span>
          </div>
          
          {/* Weeks */}
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-[2px]">
              {week.map((day, dayIndex) => (
                <motion.div
                  key={dayIndex}
                  className={`w-[8px] h-[8px] lg:w-[10px] lg:h-[10px] rounded-sm cursor-pointer ${
                    day ? levelColors[getLevel(day)] : "bg-[hsl(260_20%_95%)]"
                  }`}
                  whileHover={day ? { scale: 1.4 } : {}}
                  onMouseEnter={day ? (e) => handleMouseEnter(day, e) : undefined}
                  onMouseLeave={() => setHoveredDay(null)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Month Labels */}
      <div className="flex justify-between mt-1 text-[7px] text-foreground/30 px-4">
        {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month) => (
          <span key={month}>{month}</span>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className={`w-[10px] h-[10px] rounded-sm ${levelColors[1]}`} />
            <span className="text-[8px] text-foreground/50">None</span>
          </div>
          <div className="flex items-center gap-1">
            <div className={`w-[10px] h-[10px] rounded-sm ${levelColors[2]}`} />
            <span className="text-[8px] text-foreground/50">Partial</span>
          </div>
          <div className="flex items-center gap-1">
            <div className={`w-[10px] h-[10px] rounded-sm ${levelColors[3]}`} />
            <span className="text-[8px] text-foreground/50">Full</span>
          </div>
        </div>
        <div className="flex gap-2 text-[8px] text-foreground/40">
          <span>🧠 {mentalDays}</span>
          <span>💪 {physicalDays}</span>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredDay && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed z-50 bg-white/95 border border-white rounded-lg p-2 text-[10px] pointer-events-none shadow-lg backdrop-blur-sm"
          style={{ 
            left: tooltipPos.x + 10, 
            top: tooltipPos.y - 50,
          }}
        >
          <div className="font-bold text-foreground mb-1">{hoveredDay.date}</div>
          <div className="flex flex-col gap-0.5">
            <span className={hoveredDay.mental ? "text-[hsl(280_60%_50%)]" : "text-foreground/30"}>
              🧠 Mental: {hoveredDay.mental ? "✓ Done" : "✗ Missed"}
            </span>
            <span className={hoveredDay.physical ? "text-[hsl(145_55%_45%)]" : "text-foreground/30"}>
              💪 Physical: {hoveredDay.physical ? "✓ Done" : "✗ Missed"}
            </span>
          </div>
          <div className={`text-[9px] mt-1 pt-1 border-t border-foreground/10 font-bold ${
            hoveredDay.mental && hoveredDay.physical 
              ? "text-[hsl(145_55%_45%)]" 
              : hoveredDay.mental || hoveredDay.physical 
                ? "text-[hsl(45_80%_45%)]" 
                : "text-foreground/30"
          }`}>
            {hoveredDay.mental && hoveredDay.physical 
              ? "🎉 Full Daily Duo!" 
              : hoveredDay.mental || hoveredDay.physical 
                ? "⚡ Partial Duo" 
                : "😴 No Duo"}
          </div>
        </motion.div>
      )}
    </div>
  );
}
