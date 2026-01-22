import { motion } from "framer-motion";

interface ProgressBarProps {
  progress: number;
  label?: string;
}

export function ProgressBar({ progress, label }: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className="relative h-2 bg-surface-tertiary rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-status-focus to-status-active rounded-full"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent animate-shimmer" 
             style={{ backgroundSize: "200% 100%" }} />
      </div>
      {label && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-sm text-muted-foreground mt-2"
        >
          {label}
        </motion.p>
      )}
    </div>
  );
}
