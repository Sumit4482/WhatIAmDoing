import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { BACKEND_API_URL } from "@/lib/socket";

export interface Roast {
  id: string;
  name: string;
  message: string;
  timestamp: string;
  reactions?: { emoji: string; count: number }[];
}

interface RoastSectionProps {
  roasts?: Roast[];
}

function formatTimeAgo(timestamp: string): string {
  const date = new Date(timestamp);
  const hours = Math.floor((Date.now() - date.getTime()) / 1000 / 60 / 60);
  if (hours < 1) return "now";
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

export function RoastSection({ roasts: propRoasts }: RoastSectionProps) {
  const [roasts, setRoasts] = useState<Roast[]>(propRoasts || []);
  
  useEffect(() => {
    if (propRoasts && propRoasts.length > 0) {
      setRoasts(propRoasts);
    }
  }, [propRoasts]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % roasts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [roasts.length]);

  useEffect(() => {
    localStorage.setItem("roasts", JSON.stringify(roasts));
  }, [roasts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    
    // Send to backend
    try {
      const response = await fetch(`${BACKEND_API_URL}/api/roast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), message: message.trim() }),
      });
      if (response.ok) {
        // Roast will be added via socket event
        setCurrentIndex(0);
        setName("");
        setMessage("");
        setIsAdding(false);
      }
    } catch (error) {
      // Fallback to local
      const newRoast: Roast = { id: Date.now().toString(), name: name.trim(), message: message.trim(), timestamp: new Date().toISOString(), reactions: [] };
      setRoasts([newRoast, ...roasts]);
      setCurrentIndex(0);
      setName("");
      setMessage("");
      setIsAdding(false);
    }
  };

  const currentRoast = roasts[currentIndex];

  return (
    <div className="card-pink rounded-xl shadow-pastel p-2 lg:p-3 flex flex-col h-full">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">🔥</span>
          <span className="font-bold text-[10px] text-foreground">Roast</span>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="text-[8px] bg-white/60 hover:bg-white/80 text-foreground/60 w-5 h-5 rounded-full font-bold transition-colors flex items-center justify-center"
        >
          {isAdding ? "✕" : "+"}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {isAdding ? (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-1"
          >
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={15}
              className="w-full px-2 py-1 rounded-md bg-white/60 border border-white/80 text-[10px] placeholder:text-foreground/30 focus:outline-none"
            />
            <textarea
              placeholder="Roast..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={60}
              rows={2}
              className="w-full px-2 py-1 rounded-md bg-white/60 border border-white/80 text-[10px] placeholder:text-foreground/30 focus:outline-none resize-none"
            />
            <button
              type="submit"
              disabled={!name.trim() || !message.trim()}
              className="w-full py-1 rounded-md bg-gradient-to-r from-[hsl(340_70%_65%)] to-[hsl(25_90%_65%)] text-white text-[9px] font-bold disabled:opacity-50"
            >
              Send 🔥
            </button>
          </motion.form>
        ) : (
          <div className="flex-1 flex flex-col justify-between">
            {currentRoast && (
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 lg:w-7 lg:h-7 rounded-full bg-gradient-to-br from-[hsl(280_60%_70%)] to-[hsl(340_70%_70%)] flex items-center justify-center text-white font-bold text-[9px] flex-shrink-0">
                  {currentRoast.name[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-[10px] text-foreground">{currentRoast.name}</span>
                    <span className="text-[8px] text-foreground/40">{formatTimeAgo(currentRoast.timestamp)}</span>
                  </div>
                  <p className="text-[10px] leading-snug text-foreground/70 mt-0.5">{currentRoast.message}</p>
                </div>
              </div>
            )}
            <div className="flex justify-center gap-1 mt-2">
              {roasts.slice(0, 4).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentIndex ? "bg-[hsl(340_70%_60%)] w-3" : "bg-foreground/20"}`}
                />
              ))}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
