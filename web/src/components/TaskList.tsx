import { motion } from "framer-motion";

export interface Task {
  id: string;
  title: string;
  completed: boolean | null;
  emoji?: string;
}

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  const completedCount = tasks.filter(t => t.completed === true).length;
  const skippedCount = tasks.filter(t => t.completed === false).length;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.15 }}
      className="card-purple rounded-xl shadow-pastel p-2 lg:p-3 flex flex-col h-full"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-base lg:text-lg">📋</span>
          <span className="font-bold text-xs lg:text-sm text-foreground">Today's Tasks</span>
        </div>
        <div className="flex gap-1.5">
          <span className="text-[9px] bg-[hsl(145_60%_85%/0.8)] border border-[hsl(145_50%_70%/0.5)] px-1.5 py-0.5 rounded-full font-bold text-[hsl(145_50%_35%)]">
            ✓ {completedCount}
          </span>
          {skippedCount > 0 && (
            <span className="text-[9px] bg-[hsl(0_70%_92%/0.8)] border border-[hsl(0_60%_80%/0.5)] px-1.5 py-0.5 rounded-full font-bold text-[hsl(0_60%_45%)]">
              ✗ {skippedCount}
            </span>
          )}
        </div>
      </div>
      
      <div className="flex-1 space-y-1 overflow-y-auto">
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.05 }}
            className={`flex items-center gap-2 p-1.5 lg:p-2 rounded-lg transition-all ${
              task.completed === true
                ? "bg-[hsl(145_55%_90%/0.7)] border border-[hsl(145_50%_75%/0.5)]"
                : task.completed === false
                ? "bg-[hsl(0_70%_95%/0.7)] border border-[hsl(0_60%_85%/0.5)]"
                : "bg-white/50 border border-white/60"
            }`}
          >
            <span className="text-sm lg:text-base">{task.emoji || "📌"}</span>
            <span className={`flex-1 text-[10px] lg:text-xs font-medium ${
              task.completed === true ? "line-through text-foreground/40" : "text-foreground/80"
            }`}>
              {task.title}
            </span>
            {task.completed === true && (
              <span className="text-[8px] lg:text-[9px] bg-[hsl(145_60%_45%)] text-white px-1.5 py-0.5 rounded-full font-bold">
                Done
              </span>
            )}
            {task.completed === false && (
              <span className="text-[8px] lg:text-[9px] bg-[hsl(0_60%_60%)] text-white px-1.5 py-0.5 rounded-full font-bold">
                Skip
              </span>
            )}
            {task.completed === null && (
              <span className="text-[8px] lg:text-[9px] bg-[hsl(45_80%_60%)] text-white px-1.5 py-0.5 rounded-full font-bold">
                •••
              </span>
            )}
          </motion.div>
        ))}
        
        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-foreground/30">
            <span className="text-2xl mb-1">📱</span>
            <span className="text-[10px]">Add tasks from mobile</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
