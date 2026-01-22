import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  value: string;
  label: string;
  subtext?: string;
  delay?: number;
}

export function StatCard({ icon, value, label, subtext, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 300, damping: 25 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative flex flex-col items-center gap-2 rounded-2xl bg-card p-6 border border-border/50 hover:border-primary/30 transition-all duration-300"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="text-3xl mb-1">{icon}</div>
      
      <span className="font-mono text-3xl font-bold text-foreground">{value}</span>
      
      <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      
      {subtext && (
        <span className="text-xs text-muted-foreground/70">{subtext}</span>
      )}
    </motion.div>
  );
}
