import { motion } from "framer-motion";

type StatusType = "working" | "studying" | "exercising" | "idle" | "sleeping" | "focus";

interface StatusBadgeProps {
  status: StatusType;
  activity: string;
  duration: string;
}

const statusConfig: Record<StatusType, { icon: string; gradient: string; glow: string; label: string }> = {
  working: {
    icon: "💼",
    gradient: "gradient-active",
    glow: "glow-active",
    label: "WORKING",
  },
  studying: {
    icon: "📚",
    gradient: "gradient-focus",
    glow: "glow-focus",
    label: "STUDYING",
  },
  exercising: {
    icon: "🏋️",
    gradient: "gradient-active",
    glow: "glow-active",
    label: "EXERCISING",
  },
  idle: {
    icon: "😴",
    gradient: "gradient-idle",
    glow: "glow-idle",
    label: "IDLE",
  },
  sleeping: {
    icon: "🌙",
    gradient: "bg-surface-tertiary",
    glow: "",
    label: "SLEEPING",
  },
  focus: {
    icon: "🎯",
    gradient: "gradient-focus",
    glow: "glow-focus",
    label: "DEEP FOCUS",
  },
};

export function StatusBadge({ status, activity, duration }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="flex flex-col items-center gap-6"
    >
      <motion.div
        className={`relative inline-flex items-center gap-4 px-8 py-5 rounded-2xl ${config.gradient} ${config.glow} animate-pulse-glow`}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <motion.span
          className="text-4xl"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {config.icon}
        </motion.span>
        <div className="flex flex-col">
          <span className="text-sm font-semibold uppercase tracking-wider text-foreground/80">
            {config.label}
          </span>
          <span className="text-xl font-bold text-foreground">{activity}</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-2 text-muted-foreground"
      >
        <span className="text-sm">Since:</span>
        <span className="font-mono text-lg font-semibold text-foreground">{duration}</span>
      </motion.div>
    </motion.div>
  );
}
