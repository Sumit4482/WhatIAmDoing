import { motion } from "framer-motion";

interface MissCardProps {
  task: string;
  reason: string;
  date: string;
  delay?: number;
}

export function MissCard({ task, reason, date, delay = 0 }: MissCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, type: "spring", stiffness: 300, damping: 25 }}
      whileHover={{ x: 4 }}
      className="relative flex items-center gap-4 rounded-xl bg-gradient-to-r from-card to-status-miss/5 p-5 border-l-4 border-status-miss overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-status-miss/10 to-transparent pointer-events-none" />
      
      <span className="text-2xl relative z-10">❌</span>
      
      <div className="flex-1 relative z-10">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-foreground">{task}</span>
          <span className="text-xs text-muted-foreground">{date}</span>
        </div>
        <span className="text-sm text-status-miss/80 italic">"{reason}"</span>
      </div>
    </motion.div>
  );
}
