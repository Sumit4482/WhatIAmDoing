import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

// Free lofi music stream URLs
const LOFI_STREAMS = [
  {
    name: "Lofi Girl Radio",
    url: "https://play.streamafrica.net/lofiradio",
  },
];

export function NowPlaying() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio(LOFI_STREAMS[0].url);
    audioRef.current.volume = volume;
    audioRef.current.loop = true;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="card-yellow rounded-xl shadow-pastel p-2 lg:p-3 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm">🎵</span>
        <span className="font-bold text-[10px] text-foreground/70">Now Playing</span>
      </div>

      <div className="flex-1 flex items-center gap-3">
        {/* Album Art / Visualizer */}
        <div className="relative w-12 h-12 lg:w-14 lg:h-14 rounded-lg bg-gradient-to-br from-[hsl(280_60%_70%)] to-[hsl(200_70%_60%)] flex items-center justify-center overflow-hidden flex-shrink-0">
          {isPlaying ? (
            <div className="flex items-end gap-0.5 h-5">
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-white rounded-full"
                  animate={{ height: ["40%", "100%", "60%", "80%", "40%"] }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          ) : (
            <span className="text-xl">🎧</span>
          )}
        </div>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-foreground truncate">
            Lofi Hip Hop Radio
          </p>
          <p className="text-[9px] text-foreground/50 truncate">
            beats to relax/study to
          </p>
          
          {/* Controls */}
          <div className="flex items-center gap-1.5 mt-1">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] transition-all ${
                isPlaying 
                  ? "bg-[hsl(145_55%_55%)] text-white" 
                  : "bg-white/60 text-foreground/70 hover:bg-white/80"
              }`}
            >
              {isPlaying ? "⏸" : "▶"}
            </button>

            {/* Mute */}
            <button
              onClick={toggleMute}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] transition-all ${
                isMuted 
                  ? "bg-[hsl(0_60%_60%)] text-white" 
                  : "bg-white/60 text-foreground/70 hover:bg-white/80"
              }`}
            >
              {isMuted ? "🔇" : "🔊"}
            </button>

            {/* Volume Slider */}
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="flex-1 h-1 bg-white/40 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:bg-[hsl(45_80%_50%)] [&::-webkit-slider-thumb]:rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Live indicator */}
      {isPlaying && (
        <div className="flex items-center gap-1 mt-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[hsl(0_70%_55%)] animate-pulse" />
          <span className="text-[8px] text-foreground/40 uppercase tracking-wider">Live</span>
        </div>
      )}
    </div>
  );
}
