import { motion } from "framer-motion";
import { useState } from "react";

export interface TimeBlock {
  id: string;
  activity: string;
  emoji: string;
  startHour: number;
  endHour: number;
  color: "coding" | "study" | "exercise" | "break" | "meeting" | "other";
}

interface TodayTimelineProps {
  blocks: TimeBlock[];
  currentHour: number;
}

const colorMap: Record<string, string> = {
  coding: "bg-[hsl(200_70%_65%)]",
  study: "bg-[hsl(280_60%_70%)]",
  exercise: "bg-[hsl(145_55%_60%)]",
  break: "bg-[hsl(45_85%_65%)]",
  meeting: "bg-[hsl(340_65%_70%)]",
  other: "bg-[hsl(260_20%_75%)]",
};

export function TodayTimeline({ blocks, currentHour }: TodayTimelineProps) {
  const [hoveredBlock, setHoveredBlock] = useState<TimeBlock | null>(null);

  const totalHours = 24;
  const startHour = 0;

  const getBlockPosition = (block: TimeBlock) => {
    const left = ((block.startHour - startHour) / totalHours) * 100;
    const width = ((block.endHour - block.startHour) / totalHours) * 100;
    return { left: `${left}%`, width: `${width}%` };
  };

  const currentPosition = ((currentHour - startHour) / totalHours) * 100;

  return (
    <div className="card-blue rounded-xl shadow-pastel p-2 lg:p-3 h-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-base lg:text-lg">📅</span>
          <h3 className="font-bold text-xs lg:text-sm text-foreground">Today's Timeline</h3>
        </div>
        <span className="text-[9px] text-foreground/50 font-mono">
          {Math.floor(currentHour)}:{String(Math.round((currentHour % 1) * 60)).padStart(2, '0')}
        </span>
      </div>

      {/* Timeline Bar */}
      <div className="relative h-8 lg:h-10 bg-white/40 rounded-lg overflow-hidden border border-white/60">
        {blocks.map((block) => {
          const pos = getBlockPosition(block);
          return (
            <motion.div
              key={block.id}
              className={`absolute top-0 bottom-0 ${colorMap[block.color]} opacity-80 hover:opacity-100 cursor-pointer transition-opacity`}
              style={pos}
              onMouseEnter={() => setHoveredBlock(block)}
              onMouseLeave={() => setHoveredBlock(null)}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.1 * blocks.indexOf(block), duration: 0.3 }}
            >
              <span className="absolute inset-0 flex items-center justify-center text-[10px] lg:text-xs opacity-0 hover:opacity-100 transition-opacity text-white font-bold drop-shadow-sm">
                {block.emoji}
              </span>
            </motion.div>
          );
        })}

        {/* Current Time Indicator */}
        <motion.div
          className="absolute top-0 bottom-0 w-0.5 bg-[hsl(340_70%_55%)] z-10"
          style={{ left: `${currentPosition}%` }}
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>

      {/* Hour Labels */}
      <div className="flex justify-between mt-1 text-[8px] text-foreground/40 font-mono">
        <span>12AM</span>
        <span>6AM</span>
        <span>12PM</span>
        <span>6PM</span>
        <span>12AM</span>
      </div>

      {/* Hover Tooltip */}
      {hoveredBlock && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 bg-white/80 border border-white/90 rounded-lg p-2 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm">{hoveredBlock.emoji}</span>
            <span className="text-xs font-bold text-foreground">{hoveredBlock.activity}</span>
            <span className="text-[9px] text-foreground/50 ml-auto">
              {hoveredBlock.startHour}:00 - {hoveredBlock.endHour}:00
            </span>
          </div>
          <div className="text-[9px] text-foreground/40 mt-1">
            Duration: {hoveredBlock.endHour - hoveredBlock.startHour}h
          </div>
        </motion.div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-2 mt-2">
        {[
          { color: "coding", label: "Code", emoji: "💻" },
          { color: "study", label: "Study", emoji: "📚" },
          { color: "exercise", label: "Exercise", emoji: "💪" },
          { color: "break", label: "Break", emoji: "☕" },
        ].map((item) => (
          <div key={item.color} className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-sm ${colorMap[item.color]}`} />
            <span className="text-[8px] text-foreground/40">{item.emoji}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
