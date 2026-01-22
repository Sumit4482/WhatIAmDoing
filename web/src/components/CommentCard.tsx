import { motion } from "framer-motion";
import { useState } from "react";

interface Reply {
  author: string;
  content: string;
  time: string;
}

interface CommentCardProps {
  author: string;
  avatar: string;
  content: string;
  time: string;
  reactions?: { emoji: string; count: number }[];
  reply?: Reply;
  delay?: number;
}

export function CommentCard({
  author,
  avatar,
  content,
  time,
  reactions = [],
  reply,
  delay = 0,
}: CommentCardProps) {
  const [localReactions, setLocalReactions] = useState(reactions);

  const handleReaction = (emoji: string) => {
    setLocalReactions((prev) => {
      const existing = prev.find((r) => r.emoji === emoji);
      if (existing) {
        return prev.map((r) =>
          r.emoji === emoji ? { ...r, count: r.count + 1 } : r
        );
      }
      return [...prev, { emoji, count: 1 }];
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 300, damping: 25 }}
      whileHover={{ x: 4 }}
      className="group rounded-xl bg-card p-5 border border-border/50 hover:border-primary/30 transition-all duration-300"
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-lg">
          {avatar}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-foreground">{author}</span>
            <span className="text-xs text-muted-foreground">{time}</span>
          </div>
          
          <p className="text-foreground/90">{content}</p>
          
          <div className="flex items-center gap-2 mt-3">
            {localReactions.map((reaction) => (
              <motion.button
                key={reaction.emoji}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleReaction(reaction.emoji)}
                className="flex items-center gap-1 px-2 py-1 rounded-full bg-surface-tertiary hover:bg-surface-hover text-sm transition-colors"
              >
                <span>{reaction.emoji}</span>
                <span className="font-mono text-xs">{reaction.count}</span>
              </motion.button>
            ))}
            
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {["💜", "😂", "🔥"].map((emoji) => (
                <motion.button
                  key={emoji}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleReaction(emoji)}
                  className="p-1 rounded-full hover:bg-surface-tertiary transition-colors"
                >
                  {emoji}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {reply && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.1 }}
          className="ml-14 mt-4 pl-4 border-l-2 border-primary/30"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-primary">{reply.author}</span>
            <span className="text-xs text-muted-foreground">{reply.time}</span>
          </div>
          <p className="text-sm text-foreground/80">{reply.content}</p>
        </motion.div>
      )}
    </motion.div>
  );
}
